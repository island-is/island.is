/// <reference path="../support/index.d.ts" />
import { cms } from '@island.is/api/mocks'
import { getPageUrl } from '../support/app.po'

describe('web', () => {
  before(() => {
    cy.login()
  })
  beforeEach(() =>
    cy.visit(getPageUrl('beta', '/'), {
      auth: {
        username: 'preview',
        password: 'n5gQGmrSCzTgp7bdn',
      },
    }),
  )
  it('should navigate homepage', () => {
    cy.get('h3').contains('Að eignast barn')
    cy.get('#search_input_home-input').scrollIntoView()
    cy.get('#search_input_home-input').click()
    cy.get('#search_input_home-input').type('Ísland{enter}')
    cy.location('pathname', { timeout: 10000 }).should('equal', '/leit')
    cy.get('div').contains('Stafrænt Ísland')
  })
})
