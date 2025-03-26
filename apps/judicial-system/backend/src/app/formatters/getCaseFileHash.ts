import { HashAlgorithm } from '@island.is/judicial-system/types'

// TODO: update MD5 to SHA256 in a follow-up
const HASH_ALGORITHM = HashAlgorithm.MD5

export const getCaseFileHash = (pdf: Buffer) => {
  const binaryPdf = pdf.toString('binary')
  // TODO: update MD5 to SHA256 in a follow-up
  const hash = CryptoJS.MD5(pdf.toString('binary')).toString(CryptoJS.enc.Hex)
  return { hash, hashAlgorithm: HASH_ALGORITHM, binaryPdf }
}
