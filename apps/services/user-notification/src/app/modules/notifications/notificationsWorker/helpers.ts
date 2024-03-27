export const wait = async (seconds = 2) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1_000))
}
