export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockAsync(retVal) {
  return sleep(200).then(() => retVal)
}
