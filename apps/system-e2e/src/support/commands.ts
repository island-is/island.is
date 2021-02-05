import { Plugins } from 'cypress-social-logins'
const username = 'sindrigudmundsson+githubtest@gmail.com'
const password = 'Y69cVnruYxHceTuGCvRs'
const loginUrl = 'https://beta.dev01.devland.is'
const cookieName = '_oauth2_proxy'
const socialLoginOptions = {
  username,
  password,
  loginUrl,
  // cookieDelay: 100000,
  // authorize: true,
  headless: false,
  logs: true,
  isPopup: true,
  // loginSelector: `a[href="${Cypress.env('SITE_NAME')}/api/auth/signin/google"]`,
  loginSelector: null,
  // postLoginSelector: 'div',
}

interface CookieType {
  name: string
  value: string
  domain: string
  expires: number
  httpOnly: boolean
  path: string
  secure: boolean
}

interface GithubLoginTaskType {
  cookies: CookieType[]
}

Cypress.Commands.add('login', () => {
  Cypress.log({
    name: 'loginViaGithub',
  })
  return cy
    .task<GithubLoginTaskType>('GitHubSocialLogin', socialLoginOptions)
    .then(({ cookies }) => {
      cy.clearCookies()
      cy.log(`Cookies: ${cookies}`)

      const cookie = cookies
        .filter((cookie) => cookie.name === cookieName)
        .pop()
      if (cookie) {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expires,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure,
        })

        Cypress.Cookies.defaults({
          preserve: cookieName,
        })
      }
    })
})
