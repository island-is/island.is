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

  it.only('should have clickable navigation bar', () => {
    cy.get('a:has(div[data-testid^="nav-"])').each((el) => {
      cy.wrap(el).click()
      cy.location('pathname').should('eq', el.attr('href'))
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
