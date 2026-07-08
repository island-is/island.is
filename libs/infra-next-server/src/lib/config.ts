export const getNextConfig = async (appDir: string, dev: boolean) => {
  const dir = process.env.NX_NEXT_DIR || __dirname
  console.log(dir)
  // Next.js 16 defaults to Turbopack, which is incompatible with our custom
  // webpack configs (withNx). The CLI --webpack flag does not apply to
  // programmatic custom servers, so opt in to webpack here. Only relevant in
  // dev - production serves the prebuilt .next output.
  return { dev, dir, webpack: true }
}
