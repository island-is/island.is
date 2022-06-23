const { fakeUsers } = Cypress.env()
const { authDomain } = Cypress.env(Cypress.env('testEnvironment'))

describe('Parental leave', () => {
  before(() => {
    cy.cognitoLogin({
      cognitoUsername: Cypress.env('cognitoUsername'),
      cognitoPassword: Cypress.env('cognitoPassword'),
    })
  })
  it('should navigate serviceportal', () => {
    cy.visit('/umsoknir/faedingarorlof')

    cy.idsLogin({
      phoneNumber: fakeUsers[0].phoneNumber,
      authDomain: `https://${authDomain}`,
    }).then((_) => cy.wait(2000).get("[data-testid='mockdata-no']").click())
  })
})
