const toBase64 = (input: string) => Buffer.from(input).toString('base64')

const decodeBase64 = (input: string) =>
  Buffer.from(input, 'base64').toString('ascii')

export { toBase64, decodeBase64 }
