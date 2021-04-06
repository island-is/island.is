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
    cy.get('#search_input_home-input').scrollIntoView()
    cy.get('#search_input_home-input').click()
    cy.get('#search_input_home-input').type('Ísland{enter}')
    cy.location('pathname', { timeout: 10000 }).should('equal', '/leit')
    cy.get('div').contains('Stafrænt Ísland')
  })
})
