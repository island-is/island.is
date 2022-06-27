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
    cy.visit('/')
  })

  it('should have clickable navigation bar', () => {
    cy.contains(fakeUsers['María'].name)
    cy.get('div[data-testid^="nav-"]').each((el) => {
      el.click()
      cy.url().should('eq', el)
    })
  })

  it(`should have user María logged in`, () => {
    cy.visit('/minarsidur/')
    cy.contains(fakeUsers['María'].name)
  })

  it('should have Pósthólf', () => {
    cy.visit('/minarsidur/')
    cy.contains('Pósthólf')
  })
})
