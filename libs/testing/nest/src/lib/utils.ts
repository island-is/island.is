export const buildQueryString = (
  params?: Record<string, string | string[]>,
) => {
  const entries = Object.entries(params ?? {})

  return entries.length > 0
    ? `?${entries
        .map(
          ([key, value]) =>
            `${key}=${Array.isArray(value) ? value.join(',') : value}`,
        )
        .join('&')}`
    : ''
}
