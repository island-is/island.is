export const parseCookie = (cookieString: string) => {
  if (cookieString) {
    return cookieString
      .split(';')
      .map((v) => v.split('='))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim())
        return acc
      }, {})
  }
  return {}
}

export default parseCookie
