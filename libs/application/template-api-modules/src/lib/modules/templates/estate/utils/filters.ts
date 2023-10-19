type RepeaterType<T> = T & { initial?: boolean; enabled?: boolean }

// A helper type that extracts values from an ArrayLike
export type Extract<T extends ArrayLike<any> | Record<any, any>> =
  T extends ArrayLike<any> ? T[number] : never

export const filterAndRemoveRepeaterMetadata = <T>(
  elements: RepeaterType<Extract<NonNullable<T>>>[],
): Omit<Extract<NonNullable<T>>, 'initial' | 'enabled' | 'dummy'>[] => {
  elements.forEach((element) => {
    delete element.initial
    delete element.dummy
  })

  return elements
}

export const filterEmptyObjects = <T extends Record<string, unknown>>(
  objs: T[],
) => {
  return objs.filter((obj) => Object.keys(obj).length > 0)
}
