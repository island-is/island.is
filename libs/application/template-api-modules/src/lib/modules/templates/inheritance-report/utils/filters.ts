export const filterEmptyObjects = <T extends Record<string, unknown>>(
  obj: T,
) => {
  const somePropertyHasValue = Object.values(obj).some(
    (v) => v !== undefined && v !== null && v !== '',
  )
  return Object.keys(obj).length > 0 && somePropertyHasValue
}
