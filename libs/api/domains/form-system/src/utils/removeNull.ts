/* eslint-disable @typescript-eslint/no-explicit-any */
export const removeNullProperties = (input: any): any => {
  if (Array.isArray(input)) {
    return input.map(removeNullProperties)
  } else if (input !== null && typeof input === 'object') {
    return Object.entries(input).reduce((acc, [key, value]) => {
      if (value !== null) {
        acc[key] = removeNullProperties(value)
      }
      return acc
    }, {} as { [key: string]: any })
  }
  return input
}
