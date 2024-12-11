export interface UpdateResponseError {
  type: string
  title: string
  status: number
  Errors: Array<{
    lookupNo: number
    warnSever: string
    errorMess: string
    permno: string
    warningSerialNumber: string
  }>
}
