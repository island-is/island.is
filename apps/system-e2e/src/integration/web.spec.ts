/// <reference path="../support/index.d.ts" />

Cypress.config(
  'baseUrl',
  `https://beta.${Cypress.env('testEnvironment')}01.devland.is`,
)

describe('web', () => {
  before(() => {
    cy.ensureLoggedIn({ path: '/' })
  })
  it('should navigate homepage', () => {
    cy.visit('/')
    cy.get('h3').contains('Að eignast barn')
  })
})
