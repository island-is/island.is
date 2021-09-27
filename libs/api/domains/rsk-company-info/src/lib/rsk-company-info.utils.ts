const toCursorHash = (input: string) => Buffer.from(input).toString('base64')

const fromCursorHash = (input: string) =>
  Buffer.from(input, 'base64').toString('ascii')

export { toCursorHash, fromCursorHash }
