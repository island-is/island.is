const { fakeUsers } = Cypress.env()
const { authDomain } = Cypress.env(Cypress.env('testEnvironment'))

describe('Home page', () => {
  it('should navigate serviceportal', () => {
    cy.log('fakeUsers', fakeUsers)
    cy.log('authDomain', authDomain)
    cy.visit('/minarsidur/')

    cy.idsLogin({
      phoneNumber: fakeUsers[0].phoneNumber,
      authDomain: `https://${authDomain}`,
    })
    cy.contains('Pósthólf')
    cy.contains(fakeUsers[0].name)
  })
})
