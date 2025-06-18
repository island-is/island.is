// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeTypename = (obj: any): any => {
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(removeTypename)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newObj: { [key: string]: any } = {}
  for (const [key, value] of Object.entries(obj)) {
    if (key !== '__typename') {
      newObj[key] = removeTypename(value)
    }
  }
  // if the key is fieldSettings remove all properties where the values are null
  if (newObj.fieldSettings) {
    newObj.fieldSettings = Object.fromEntries(
      Object.entries(newObj.fieldSettings).filter(([_, v]) => v !== null),
    )
  }
  return newObj
}
