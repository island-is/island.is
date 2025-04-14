/*
Credit: https://gist.github.com/hunan-rostomyan/28e8702c1cecff41f7fe64345b76f2ca

Given a cookie key `name`, returns the value of
the cookie or `null`, if the key is not found.
*/
export const getCookie = (name: string): string | undefined => {
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
      })[0] || undefined
  )
}

/*
Credit: https://www.w3schools.com/js/js_cookies.asp

Given a cookie key `name`, sets the expires value of
the cookie to Jan 1st. 1970, making it invalid.
*/
export const deleteCookie = (name: string): void => {
  if (getCookie(name)) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }
}
// Test force deploy