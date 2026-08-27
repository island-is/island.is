export const isHttpsUrl = (url: string | undefined | null): url is string => {
  if (!url) {
    return false
  }

  try {
    return new URL(url).protocol === 'https:'
  } catch {
    return false
  }
}
