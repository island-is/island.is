import { Plugins } from 'cypress-social-logins'
const testEnviron = Cypress.env('testEnvironment')

const cookieName = `_oauth2_${testEnviron}`

interface CookieType {
  name: string
  value: string
  domain: string
  expires: number
  httpOnly: boolean
  path: string
  secure: boolean
}

interface CustomizedLoginTaskType {
  cookies: CookieType[]
}

Cypress.Commands.add('ensureLoggedIn', ({ path }) => {
  Cypress.log({
    name: 'ensureLoggedIn',
  })

  return cy
    .request({
      url: '/',
      followRedirect: false,
    })
    .then(({ status, headers, body }) => {
      if (headers.location) {
        const socialLoginOptions = {
          username: Cypress.env('cognito_username'),
          password: Cypress.env('cognito_password'),
          usernameField: '.modal-content-desktop input#signInFormUsername',
          passwordField: '.modal-content-desktop input#signInFormPassword',
          passwordSubmitBtn:
            '.modal-content-desktop .submitButton-customizable',
          loginUrl: headers.location,
          headless: false,
          postLoginSelector: 'div#__next',
          args: ['--no-sandbox'],
        }
        return cy
          .task<CustomizedLoginTaskType>('CustomizedLogin', socialLoginOptions)
          .then(({ cookies }) => {
            cy.clearCookies()

            const cookie = cookies
              .filter((cookie) => cookie.name === cookieName)
              .pop()
            if (cookie) {
              Cypress.Cookies.defaults({
                preserve: cookieName,
              })
              return cy.setCookie(cookie.name, cookie.value, {
                domain: cookie.domain,
                expiry: cookie.expires,
                httpOnly: cookie.httpOnly,
                path: cookie.path,
                secure: cookie.secure,
              })
            }
          })
      }
    })
})
