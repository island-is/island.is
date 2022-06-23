describe('Home page', () => {
  beforeEach(() => {
    cy.cognitoLogin({
      cognitoUsername: Cypress.env('cognitoUsername'),
      cognitoPassword: Cypress.env('cognitoPassword'),
    })
  })

  beforeEach(() => {
    cy.log('fakeUsers', fakeUsers)
    cy.log('authUrl', authUrl)
    cy.log('testEnvironment', testEnvironment)
    cy.idsLogin({
      phoneNumber: fakeUsers['María'].phoneNumber,
      authDomain: `https://${authDomain}`,
    })
    cy.contains(fakeUsers['María'].name)
    cy.get('div[data-testid=nav-*').each((el) => {
      cy.click()
      cy.url().should('eq', el)
    })
  })
})
