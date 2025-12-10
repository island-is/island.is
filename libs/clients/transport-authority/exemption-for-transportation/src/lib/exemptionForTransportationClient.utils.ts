// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessagesFromTryCatch = (e: any): string[] => {
  const errors = e.body?.errors ?? e.problem?.errors
  if (!!errors && typeof errors === 'object') {
    return Object.values(errors)
      .flat()
      .filter((msg): msg is string => typeof msg === 'string')
  } else if (typeof e?.body?.detail === 'string') {
    return [e.body.detail]
  } else {
    throw e
  }
}
