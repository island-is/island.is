export const getNextConfig = async (appDir: string, dev: boolean) => {
  const dir = process.env.NX_NEXT_DIR || __dirname
  console.log(dir)
  // Our custom webpack configs (withNx) are incompatible with Turbopack, and
  // the CLI --webpack flag does not apply to programmatic custom servers, so
  // opt in to webpack here. Only relevant in dev - production serves the
  // prebuilt .next output.
  return { dev, dir, webpack: true }
}
