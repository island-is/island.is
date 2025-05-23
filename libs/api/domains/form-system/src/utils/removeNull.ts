export const removeNullProperties = (input: any): any => {
  if (Array.isArray(input)) {
    // For arrays, map through each item.
    return input.map(removeNullProperties)
  } else if (input !== null && typeof input === 'object') {
    // For objects, iterate through keys and filter out those with null values.
    return Object.entries(input).reduce((acc, [key, value]) => {
      if (value !== null) {
        acc[key] = removeNullProperties(value)
      }
      return acc
    }, {} as { [key: string]: any })
  }
  // Return the value if it's not an object/array.
  return input
}
