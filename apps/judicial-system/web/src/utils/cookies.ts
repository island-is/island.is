/*
Credit: https://gist.github.com/hunan-rostomyan/28e8702c1cecff41f7fe64345b76f2ca

Given a cookie key `name`, returns the value of
the cookie or `null`, if the key is not found.
*/
export const getCookie = (name: string): string => {
  const nameLenPlus = name.length + 1
  return (
    document.cookie
      .split(';')
      .map((c) => c.trim())
      .filter((cookie) => {
        return cookie.substring(0, nameLenPlus) === `${name}=`
      })
      .map((cookie) => {
        return decodeURIComponent(cookie.substring(nameLenPlus))
      })[0] || null
  )
}
