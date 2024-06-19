export const removeTypename = (obj: any): any => {
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(removeTypename)
  }
  const newObj: { [key: string]: any } = {}
  for (const [key, value] of Object.entries(obj)) {
    if (key !== '__typename') {
      newObj[key] = removeTypename(value)
    }
  }
  return newObj
}
