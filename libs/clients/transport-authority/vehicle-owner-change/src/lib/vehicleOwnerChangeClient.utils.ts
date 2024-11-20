import { ReturnTypeMessage } from '../../gen/fetch'
import { ValidationMessage } from './vehicleOwnerChangeClient.types'

// Returns date object with at the selected timestamp
export const getDateAtTimestamp = (oldDate: Date, timestamp: string): Date => {
  const newDate =
    oldDate instanceof Date && !isNaN(oldDate.getDate()) ? oldDate : new Date()
  return new Date(newDate.toISOString().substring(0, 10) + 'T' + timestamp)
}

export const getCleanMessagesFromTryCatch = (
  e: any,
  type: 'ERROR' | 'INFO',
): ValidationMessage[] => {
  let errorList: ReturnTypeMessage[] = []

  // Note: Error message will be in the field "body.Errors" for input validation,
  // and "body" for data validation (in database)
  // Note: The schema for the errors is the same as the schema for the 200 response
  // result schema (ReturnTypeMessage[])
  if (e?.body?.Errors && Array.isArray(e.body.Errors)) {
    errorList = e.body.Errors as ReturnTypeMessage[]
  } else if (e?.body && Array.isArray(e.body)) {
    errorList = e.body as ReturnTypeMessage[]
  } else {
    throw e
  }

  return getCleanMessagesFromRequestResult(errorList, type)
}

export const getCleanMessagesFromRequestResult = (
  result: ReturnTypeMessage[],
  type: 'ERROR' | 'INFO',
): ValidationMessage[] => {
  const warnSeverityError = 'E'
  const warnSeverityLock = 'L'
  const warnSeverityWarning = 'W'
  const warnSeverityMessage = 'M'

  let possibleWarnSeverity: string[] = []
  if (type === 'ERROR') {
    possibleWarnSeverity = [
      warnSeverityError,
      warnSeverityLock,
      warnSeverityWarning,
    ]
  } else if (type === 'INFO') {
    possibleWarnSeverity = [warnSeverityMessage]
  }

  const filteredList = result.filter(
    (x) =>
      x.errorMess && x.warnSever && possibleWarnSeverity.includes(x.warnSever),
  )

  return filteredList.map((item) => {
    let serialNo = item.warningSerialNumber?.toString()

    // Note: For vehicle locks, we need to do some special parsing since
    // the error number (warningSerialNumber) is always -1 for locks,
    // but the number is included in the errorMess field (value before the first space)
    if (item.warnSever === warnSeverityLock) {
      serialNo = item.errorMess?.split(' ')[0]
    }

    return {
      errorNo: serialNo ? (item.warnSever || '_') + serialNo : undefined,
      defaultMessage: item.errorMess || undefined,
    }
  })
}
