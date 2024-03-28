
export default ({
  schema: "./electron/schema.ts",
  driver: "better-sqlite",
  dbCredentials: {
    url: 'sqlite.db',
  }
}) satisfies Config;