const { fakeUsers } = Cypress.env()
const { authDomain } = Cypress.env(Cypress.env('testEnvironment'))

describe('Home page', () => {
  beforeEach(() => {
    cy.cognitoLogin({
      cognitoUsername: Cypress.env('cognitoUsername'),
      cognitoPassword: Cypress.env('cognitoPassword'),
    })
  })

  it('should navigate serviceportal', () => {
    cy.log('fakeUsers', fakeUsers)
    cy.log('authDomain', authDomain)
    cy.visit('/minarsidur/')

    cy.idsLogin({
      phoneNumber: fakeUsers['Ameríka'].phoneNumber,
      authDomain: `https://${authDomain}`,
    })
    cy.contains(fakeUsers['Ameríka'].name)
    cy.get('svg[data-testid="icon-reader"]').parentsUntil('a').as('inboxnav')
    cy.get('@inboxnav').contains('Pósthólf').click()
    cy.get('div[data-testid="documents"]')
      .children()
      .should('have.length.greaterThan', 1)
  })
})
