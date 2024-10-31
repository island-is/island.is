export const convertToArray = <T>(
  data?: Array<T> | T,
): Array<T> | undefined => {
  if (!data) {
    return
  }

  return Array.isArray(data) ? data : [data]
}
