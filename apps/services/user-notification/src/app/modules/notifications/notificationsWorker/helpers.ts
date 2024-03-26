export const wait = async (seconds = 2) => {
  const start = Date.now()
  while (Date.now() - start < seconds * 1_000) {
    await new Promise((r) => setTimeout(r, 10))
  }
}
