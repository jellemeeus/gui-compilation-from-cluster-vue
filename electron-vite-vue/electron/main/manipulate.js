import ClipArray from "./ClipArray"

async function read_clips() {
  const data = await window.electron.readJSON('clips.json');
  return data
}

async function read_compilation() {
  const data = await window.ipcRenderer.readJSON('compilation.json');
  return {
    n: data.n,
    clips: data.clips,
    project: data.project,
  }
}

async function save_compilation(compilationArray) {
  console.debug(`Before ${compilationArray.csv}`)
  await window.electron.writeFile('compilation.csv', compilationArray.csv);
}

export default async function manipulate(obj, buttonName) {
  console.debug(`new manipulate: ${buttonName}`);
  if (/^Up+/.test(buttonName)) {
    console.debug(`Move up`);
    const n = Number(buttonName.match(/[0-9]+/)[0])
    console.debug(`from: ${n}`);
    // Manipulate compilation to move index n 1 space up
    const from = n
    const to = n - 1 < 0 ? 0 : n - 1
    console.debug(`to: ${to}`);
    let clips_swapped = obj.compilationArray.swap(to, from)
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: clips_swapped,
      clipsArray: obj.clipsArray,
    };
  }

  if (/^Down+/.test(buttonName)) {
    console.debug(`Move down`);
    const n = Number(buttonName.match(/[0-9]+/)[0])
    console.debug(`from: ${n}`);
    // Manipulate compilation to move index n 1 space up
    const from = n
    const to = n + 1 >= obj.compilationArray.amountOfClips ? n : n + 1
    console.debug(`to: ${to}`);
    let clips_swapped = obj.compilationArray.swap(to, from)
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: clips_swapped,
      clipsArray: obj.clipsArray,
    };
  }

  if (/^Top+/.test(buttonName)) {
    console.debug(`Move to top`);
    const n = Number(buttonName.match(/[0-9]+/)[0])
    console.debug(`from: ${n}`);
    // Manipulate compilation to move index n 1 space up
    const from = n
    const to = 0
    console.debug(`to: ${to}`);
    let clips_swapped = obj.compilationArray.swap(to, from)
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: clips_swapped,
      clipsArray: obj.clipsArray,
    };
  }

  if (/^Bottom+/.test(buttonName)) {
    console.debug(`Move to bottom`);
    const n = Number(buttonName.match(/[0-9]+/)[0])
    console.debug(`from: ${n}`);
    // Manipulate compilation to move index n 1 space up
    const from = n
    const to = obj.compilationArray.amountOfClips - 1
    console.debug(`to: ${to}`);
    let clips_swapped = obj.compilationArray.swap(to, from)
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: clips_swapped,
      clipsArray: obj.clipsArray,
    };
  }

  if (/^CompilationRemove+/.test(buttonName)) {
    console.debug(`Remove`);
    const n = Number(buttonName.match(/[0-9]+/)[0])
    console.debug(`from: ${n}`);
    // Manipulate compilation to move index n 1 space up
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: obj.compilationArray.removeIndex(n),
      clipsArray: obj.clipsArray,
    };
  }

  if (/^ClipsRemove+/.test(buttonName)) {
    console.debug(`Remove`);
    const n = Number(buttonName.match(/[0-9]+/)[0])
    console.debug(`from: ${n}`);
    // Manipulate compilation to move index n 1 space up
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: obj.compilationArray,
      clipsArray: obj.clipsArray.removeIndex(n),
    };
  }



  if (/^Add+/.test(buttonName)) {
    console.debug(`Add`);
    const n = Number(buttonName.match(/[0-9]+/)[0])
    console.debug(`from: ${n}`);
    const clip = obj.clipsArray.clips[n]
    console.log(`Clip to remove ${clip}`)
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: obj.compilationArray.add(clip),
      clipsArray: obj.clipsArray.removeIndex(n),
    };
  }

  if (/^ClipsRemove+/.test(buttonName)) {
    console.debug(`Remove`);
    const n = Number(buttonName.match(/[0-9]+/)[0])
    console.debug(`from: ${n}`);
    // Manipulate compilation to move index n 1 space up
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: obj.compilationArray,
      clipsArray: obj.clipsArray.removeIndex(n),
    };
  }

  if (/^Add+/.test(buttonName)) {
    console.debug(`Add`);
    const n = Number(buttonName.match(/[0-9]+/)[0])
    console.debug(`from: ${n}`);
    const clip = obj.clipsArray.clips[n]
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: obj.compilationArray.add(clip),
      clipsArray: obj.clipsArray.removeIndex(n),
    };
  }

  if (buttonName === "ShuffleCompilation") {
    console.debug("ShuffleCompilation");
    await save_compilation(obj.compilationArray)
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: obj.compilationArray.shuffle(),
      clipsArray: obj.clipsArray,
    }
  }

  if (buttonName === "SelectLowN") {
    console.debug("SelectLowN");
    let n = obj.clipsArray.indexOfLowN(obj.compilationArray)
    if (n === undefined) {
      return {
        n: obj.n,
        project: obj.project,
        compilationArray: obj.compilationArray,
        clipsArray: obj.clipsArray,
      }
    }
    const clip = obj.clipsArray.clips[n]
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: obj.compilationArray.add(clip),
      clipsArray: obj.clipsArray.removeIndex(n),
    }
  }

  if (buttonName === "SelectMostViews") {
    console.debug("SelectMostViews");
    let n = obj.clipsArray.indexOfMostViews()
    const clip = obj.clipsArray.clips[n]
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: obj.compilationArray.add(clip),
      clipsArray: obj.clipsArray.removeIndex(n),
    }
  }

  if (buttonName === "SaveCompilation") {
    console.debug("SaveCompilation");
    await save_compilation(obj.compilationArray)
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: obj.compilationArray,
      clipsArray: obj.clipsArray,
    }
  }

  if (buttonName === "ReadCompilation") {
    console.debug("ReadCompilation");
    const data = await read_compilation()
    const new_compilation = new ClipArray().fill_from_compilation(data.clips)
    // Remove clips already present
    new_compilation.clips.forEach(
      (comp) => {
        obj.clipsArray
        .removeIndex(obj.clipsArray.clips
          .findIndex( (clip) => clip.url === comp.url))
      }
    )
    return {
      n: data.n,
      project: data.project,
      compilationArray: new_compilation,
      clipsArray: obj.clipsArray,
    };
  }

  if (buttonName === "ReadClips") {
    console.debug("ReadClips");
    const data = await read_clips()
    return {
      n: obj.n,
      project: obj.project,
      compilationArray: obj.compilationArray,
      clipsArray: new ClipArray().fill_from_clips(data),
    };
  }
}
