type RepeaterType<T> = T & {
  initial?: boolean
  enabled?: boolean
  dummy?: unknown
}

// A helper type that extracts values from an ArrayLike
export type Extract<T extends ArrayLike<unknown> | Record<string, unknown>> =
  T extends ArrayLike<unknown> ? T[number] : never

export const filterAndRemoveRepeaterMetadata = <T>(
  elements: RepeaterType<Extract<NonNullable<T>>>[],
): Omit<Extract<NonNullable<T>>, 'initial' | 'enabled' | 'dummy'>[] => {
  return elements
    .filter((element) => element?.enabled !== false)
    .map((element) => {
      const { initial, enabled, dummy, ...rest } = element
      return rest as Omit<
        Extract<NonNullable<T>>,
        'initial' | 'enabled' | 'dummy'
      >
    })
}

export const filterEmptyObjects = <T extends Record<string, unknown>>(
  obj: T,
) => {
  const somePropertyHasValue = Object.values(obj).some(
    (v) => v !== undefined && v !== null && v !== '',
  )
  return Object.keys(obj).length > 0 && somePropertyHasValue
}
