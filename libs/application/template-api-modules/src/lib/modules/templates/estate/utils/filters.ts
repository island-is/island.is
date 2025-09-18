type RepeaterType<T> = T & { initial?: boolean; enabled?: boolean }

// A helper type that extracts values from an ArrayLike
export type Extract<T extends ArrayLike<any> | Record<any, any>> =
  T extends ArrayLike<any> ? T[number] : never

export const filterAndRemoveRepeaterMetadata = <T>(
  elements: RepeaterType<Extract<NonNullable<T>>>[],
): Omit<Extract<NonNullable<T>>, 'initial' | 'enabled' | 'dummy'>[] => {
  // First filter out disabled items, then remove metadata
  const enabledElements = elements.filter(
    (element) => element.enabled !== false,
  )

  enabledElements.forEach((element) => {
    delete element.initial
    delete element.enabled
    delete element.dummy
  })

  return enabledElements
}

export const filterEmptyObjects = <T extends Record<string, unknown>>(
  obj: T,
) => {
  const somePropertyHasValue = Object.values(obj).some(
    (v) => v !== undefined && v !== null && v !== '',
  )
  return Object.keys(obj).length > 0 && somePropertyHasValue
}
