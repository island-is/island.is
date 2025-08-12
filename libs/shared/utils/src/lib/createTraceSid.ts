const bufferToHex = (buffer: ArrayBuffer) => {
  const hashArray = Array.from(new Uint8Array(buffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

type HashFn = (hash: string) => Promise<string> | string

const webCryptoSha256 = async (data: string): Promise<string> => {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) {
    return ''
  }
  const encodedData = new TextEncoder().encode(data)
  const hashBuffer = await subtle.digest('SHA-256', encodedData)
  return bufferToHex(hashBuffer)
}

export const createTraceSid = async (
  sid: string,
  hashFn: HashFn = webCryptoSha256,
) => {
  const isoDate = new Date().toISOString().split('T')[0]
  const data = `${sid}:${isoDate}`
  const h = await hashFn(data)

  // Crypto / SHA256 not supported in this environment.
  if (h.length < 12) {
    return undefined
  }
  return `${h.slice(0, 4)}-${h.slice(4, 8)}-${h.slice(8, 12)}`
}
