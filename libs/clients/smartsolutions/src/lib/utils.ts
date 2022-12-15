import { VerifyPassServiceStatusCode } from './smartSolutions.types'

export const ErrorMessageToStatusCodeMap: Record<string, number> = {
  'Invalid barcode. Please try to refresh the pass.': 3,
  'Expired barcode. Please refresh the pass.': 3,
  'Request contains some field errors': 4,
}

export const MapError = (errorMessage: string): VerifyPassServiceStatusCode => {
  const mappedError =
    errorMessage in ErrorMessageToStatusCodeMap
      ? (ErrorMessageToStatusCodeMap[
          errorMessage
        ] as VerifyPassServiceStatusCode)
      : (99 as VerifyPassServiceStatusCode)

  return mappedError as VerifyPassServiceStatusCode
}
