Cypress.config(
  'baseUrl',
  `https://beta.${Cypress.env('testEnvironment')}01.devland.is`,
)

describe('web', () => {
  before(() => {
    cy.ensureLoggedIn({ url: '/' })
  })
  it('should navigate homepage', () => {
    cy.visit('/')
    cy.contains('Að eignast barn')
  })
})
