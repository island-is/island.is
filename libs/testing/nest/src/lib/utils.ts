export const buildQueryString = (
  params?: Record<string, string | string[]>,
) => {
  const entries = Object.entries(params ?? {})

  if (entries.length === 0) {
    return ''
  }

  const search = new URLSearchParams()
  entries.forEach(([key, value]) =>
    Array.isArray(value)
      ? value.forEach((v) => search.append(key, v))
      : search.append(key, value),
  )

  return `?${search.toString()}`
}
