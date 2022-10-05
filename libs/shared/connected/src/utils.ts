export function useTranslation(localizedJson = {}) {
  return (key: string, fallback?: string) => {
    return localizedJson[key as keyof typeof localizedJson] ?? fallback ?? key
  }
}
