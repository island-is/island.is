import CryptoJS from 'crypto-js'

import { HashAlgorithm } from '@island.is/judicial-system/types'

const HASH_ALGORITHM = HashAlgorithm.SHA256

export const getCaseFileHash = (pdf: Buffer) => {
  const binaryPdf = pdf.toString('binary')

  const hash = CryptoJS.SHA256(binaryPdf).toString(CryptoJS.enc.Hex)
  return { hash, hashAlgorithm: HASH_ALGORITHM, binaryPdf }
}
