import { app, BrowserWindow, shell, ipcMain, session } from "electron";
import { release } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Config.toml
import { readFileSync, writeFileSync } from "fs";
import toml from "toml";
// Twitch API
import { AppTokenAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";
// DB
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { ClipsTable } from "../schema";

globalThis.__filename = fileURLToPath(import.meta.url);
globalThis.__dirname = dirname(__filename);

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.mjs");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindow() {
  // modified from: https://github.com/BarryCarlyon/twitch_misc/blob/main/player/electron/app.js
  // The first handler intercepts requests to Twitch clip URLs. It parses
  // the URL to extract some parameters. It then modifies the URL by setting the "parent"
  // parameter to "localhost" and the "referrer" to a local URL. This is likely done
  // to make the clip embed think the request is coming from a local page rather than directly to avoid cross-origin restrictions.

  session.defaultSession.webRequest.onBeforeRequest(
    {
      urls: ["https://clips.twitch.tv/*"],
    },
    (details, cb) => {
      var redirectURL = details.url;

      var params = new URLSearchParams(
        redirectURL.replace("https://clips.twitch.tv/", "")
      );
      if (params.get("parent") != "") {
        cb({});
        return;
      }
      params.set("parent", "localhost");
      params.set("referrer", "https://localhost/");

      var redirectURL = "https://clips.twitch.tv/" + params.toString();
      console.log("Adjust to", redirectURL);

      cb({
        cancel: false,
        redirectURL,
      });
    }
  );

  // The second handler intercepts responses from Twitch site URLs. It deletes the "Content-Security-Policy" header from the response headers.
  // This may be done to relax the security policy and allow the app more access to Twitch page resources.
  session.defaultSession.webRequest.onHeadersReceived(
    {
      urls: [
        "https://www.twitch.tv/*",
        "https://clips.twitch.tv/*",
        "https://embed.twitch.tv/*",
      ],
    },
    (details, cb) => {
      var responseHeaders = details.responseHeaders;

      console.log("headers", details.url, responseHeaders);
      console.log("headers", details.url, responseHeaders);
      console.log("headers", details.url, responseHeaders);
      console.log("headers", details.url, responseHeaders);
      console.log("headers", details.url, responseHeaders);

      delete responseHeaders["Content-Security-Policy"];
      cb({
        cancel: false,
        responseHeaders,
      });
    }
  );

  win = new BrowserWindow({
    title: "Main window",
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
    width: 960,
    height: 1000,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      //nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

ipcMain.handle("read-json", (_, fileName) => {
  const fileContent = readFileSync(fileName, { encoding: "utf-8" });
  console.log(`read json! ${fileContent}`);
  const json = JSON.parse(fileContent);
  return json;
});

ipcMain.on("write-file", (_, fileName, fileContent) => {
  console.log(`saving! ${fileContent}`);
  writeFileSync(fileName, fileContent);
});

async function handleGetClips() {
  console.log("Async: handleGetClips");

  const config = toml.parse(readFileSync("config.toml", "utf-8"));
  process.env.TWITCH_CLIENT_ID = config.twitch["client-id"];
  process.env.TWITCH_CLIENT_SECRET = config.twitch["client-secret"];

  const clientId = config.twitch["client-id"];
  const clientSecret = config.twitch["client-secret"];

  const authProvider = new AppTokenAuthProvider(clientId, clientSecret);
  const apiClient = new ApiClient({ authProvider });
  const broadcasterName = "summit1g";
  let broadcaster;
  try {
    broadcaster = await apiClient.users.getUserByName(broadcasterName);
  } catch (e) {
    console.log(e);
    return false;
  }
  if (!broadcaster) {
    return false;
  }
  const clips = await apiClient.clips.getClipsForBroadcaster(broadcaster.id, {
    limit: 100,
  });

  const sqlite = new Database("sqlite.db");
  const db = drizzle(sqlite);

  const clipsArray = clips.data.map((clip) => ({
    id: clip.id,
    url: clip.url,
    embedUrl: clip.embedUrl,
    broadcasterId: clip.broadcasterId,
    broadcasterDisplayName: clip.broadcasterDisplayName,
    creatorId: clip.creatorId,
    creatorDisplayName: clip.creatorDisplayName,
    videoId: clip.videoId,
    gameId: clip.gameId,
    language: clip.language,
    title: clip.title,
    views: clip.views,
    creationDate: clip.creationDate,
    thumbnailUrl: clip.thumbnailUrl,
    duration: clip.duration,
    vodOffset: clip.vodOffset,
    isFeatured: clip.isFeatured ? true : false,
  }));

  await db.insert(ClipsTable).values(clipsArray).onConflictDoNothing();
}

//
ipcMain.on("clips:getClips", handleGetClips);

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
