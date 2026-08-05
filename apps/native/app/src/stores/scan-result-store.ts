import { VerifyLicenseBarcodeMutation } from '@/graphql/types/schema'

/** Simple module-level store for passing scan result between scanner and detail screens */
let scanResult: VerifyLicenseBarcodeMutation['verifyLicenseBarcode'] | null =
  null

export function setScanResult(
  result: VerifyLicenseBarcodeMutation['verifyLicenseBarcode'],
) {
  scanResult = result
}

export function getScanResult() {
  return scanResult
}

export function clearScanResult() {
  scanResult = null
}
