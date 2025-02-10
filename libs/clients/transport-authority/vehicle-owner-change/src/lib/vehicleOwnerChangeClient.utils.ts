import { ReturnTypeMessage } from '../../gen/fetch'

// Returns date object with at the selected timestamp
export const getDateAtTimestamp = (oldDate: Date, timestamp: string): Date => {
  const newDate =
    oldDate instanceof Date && !isNaN(oldDate.getDate()) ? oldDate : new Date()
  return new Date(newDate.toISOString().substring(0, 10) + 'T' + timestamp)
}

export interface ErrorMessage {
  errorNo: string | undefined
  defaultMessage: string | null | undefined
}

export const getCleanErrorMessagesFromTryCatch = (e: any): ErrorMessage[] => {
  let errorList: ReturnTypeMessage[] | undefined
  let filteredErrorList: ReturnTypeMessage[] | undefined

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

  const warnSeverityError = 'E'
  const warnSeverityLock = 'L'
  const warnSeverityWarning = 'W'

  // Note: All three types of warnSever (E, L, W) will cause the api to throw error
  // (and not continue execute on SGS side). But some messages are duplicated as both
  // E and W. To prevent us from displaying the duplicated W error, we will first
  // check for E and L, if none, then display W errors

  // First check if there are any E or L errors
  filteredErrorList = errorList?.filter(
    (x) =>
      x.errorMess &&
      (x.warnSever === warnSeverityError || x.warnSever === warnSeverityLock),
  )

  // If not, then check for W error
  if (!filteredErrorList?.length) {
    filteredErrorList = errorList?.filter(
      (x) => x.errorMess && x.warnSever === warnSeverityWarning,
    )
  }

  return filteredErrorList?.map((item) => {
    let errorNo = item.warningSerialNumber?.toString()

    // Note: For vehicle locks, we need to do some special parsing since
    // the error number (warningSerialNumber) is always -1 for locks,
    // but the number is included in the errorMess field (value before the first space)
    if (item.warnSever === warnSeverityLock) {
      errorNo = item.errorMess?.split(' ')[0]
    }

    return {
      errorNo: errorNo ? (item.warnSever || '_') + errorNo : undefined,
      defaultMessage: item.errorMess,
    }
  })
}
