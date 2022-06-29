import { idsLogin } from '../../support/commands'

describe('Home page', () => {
  const fakeUsers: FakeUser[] = Cypress.env('fakeUsers')
  const testEnvironment: TestEnvironment = Cypress.env('testEnvironment')
  const { authUrl }: Pick<TestConfig, 'authUrl'> = Cypress.env(testEnvironment)
  beforeEach(() => {
    cy.log('fakeUsers', fakeUsers)
    cy.log('authUrl', authUrl)
    cy.log('testEnvironment', testEnvironment)
    // cy.intercept('/min-rettindi', (req) => {
    //   req.on('response', (res) => {
    //     // Throttle the response to 1 Mbps to simulate a
    //     // mobile 3G connection
    //     res.setThrottle(5000)
    //   })
    // })

    // cy.patchSameSiteCookie('*')
    cy.log(
      'cookies',
      cy.getCookies().then((cookie) => cookie),
    )
    cy.log('fakeUsers[2].phoneNumber', fakeUsers[2].phoneNumber)

    cy.session('idsLogin', () => {
      idsLogin({
        phoneNumber: fakeUsers[2].phoneNumber,
        fn: () => cy.get('[data-testid="show-benefits-button"]').click(),
      })
    })
    // cy.patchSameSiteCookie('http://localhost:4200/*')
    // cy.idsLogin({
    //   phoneNumber: fakeUsers[2].phoneNumber,
    //   url: '/min-rettindi',
    // })
  })

  it(`should have user ${fakeUsers[2].name} logged in`, () => {
    // cy.visit('/min-rettindi')
    cy.contains(fakeUsers[2].name)
  })
})
