export const createBffUrl = (base: string, path: string) => {
  try {
    const cleanPath = path.replace(/^\/+|\/+$/g, '')
    const querystring = new URLSearchParams({ url: cleanPath }).toString()

    const url = `${base}/bff/api`

    const qs = querystring
    return `${url}${qs ? `?${qs}` : ''}`
  } catch (error) {
    return path
  }
}
