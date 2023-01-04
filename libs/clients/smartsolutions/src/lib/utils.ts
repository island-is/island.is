import { ServiceErrorCode } from './smartSolutions.types'

export const ErrorMessageToActionStatusCodeMap: Record<string, number> = {
  'Invalid barcode. Please try to refresh the pass.': 3,
  'Expired barcode. Please refresh the pass.': 3,
  'Request contains some field errors': 4,
}

export function MapErrorMessageToActionStatusCode(
  message?: string,
): ServiceErrorCode {
  if (!message) {
    return 99
  }
  //Check for mandatory input fields
  if (message.startsWith('Missing following mandatory inputfields')) {
    return 4
  }

  return message in ErrorMessageToActionStatusCodeMap
    ? (ErrorMessageToActionStatusCodeMap[message] as ServiceErrorCode)
    : 99
}
