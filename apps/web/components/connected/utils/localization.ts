/**
 * A function that provides a text lookup function with fallback support.
 * This is especially useful for localized JSON values for Connected component, in order
 * to look up localized text values.
 * @param localizedJson A key-value object containing string values.
 * @returns A lookup function for the provided localizedJson object, with fallback support.
 */
export function useLocalization(localizedJson = {}) {
  return (key: string, fallback?: string) => {
    return (
      (localizedJson && localizedJson[key as keyof typeof localizedJson]) ??
      fallback ??
      key
    )
  }
}
