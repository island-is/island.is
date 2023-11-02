export const getNextConfig = async (appDir: string, dev: boolean) => {
  const dir = process.env.NX_NEXT_DIR || __dirname
  console.log(dir)
  return { dev, dir }
}
