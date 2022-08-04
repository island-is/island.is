import { getApplicationQuery } from 'src/support/utils'
import '@testing-library/cypress'
import { regex as uuidRegex } from 'uuidv4'

interface Application {
  id: string
  user: string
}

const baseUrl = Cypress.config().baseUrl
const fakeUsers: FakeUser[] = Cypress.env('fakeUsers')
const applications: Application[] = []

describe('P-sign', () => {
  before(() => {
    // Disable all translations
    // Note: this intercept is causing issues in the front-end throwing errors,
    // so I've disabled it for now.
    //cy.intercept(`${Cypress.env('apiUrl')}/graphql?op=GetTranslations`, {getTranslations: {}})
  })
  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: fakeUsers[0].phoneNumber,
      url: '/',
    })
    cy.visit('/umsoknir/p-merki')
    cy.get('form').should('exist')
    cy.pathUuid().as('firstApplication')
  })

  it.only('should be able to create application', function() {
    cy.pathUuid()
      .should('match', uuidRegex.v4)
      .then(function(uuid) {
        cy.wrap(uuid).should('eq', this.firstApplication)
      })
    cy.get('input[name="approveExternalData"]').click()
    cy.get('button[type="submit"]').click()
    cy.get('[aria-live="alert"]').should('not.exist')
    cy.get('p').contains('Eitthvað fór úrskeiðis').should('not.exist') // Same as the aria-liveselector
  })

  it('should be error for invalid email', () => {
    cy.get('button[name="approveExternalData"]').click()
    cy.get('button[type="submit"]').click()
    // cy.intercept(userprofile), return default email & phonenumber
    // Edit email, with invalid, missing etc.
    // Try clicking unselectable elements
    // Continue with no phonenumber
    // Successfully go to next step
  })

  it.skip('should have application in db', () => {
    cy.pathUuid().then((applicationId) => {
      const applicationQuery = getApplicationQuery(applicationId)
      cy.gqlRequest(getApplicationQuery(applicationId)).its('body').as('body')

      // Debug errors, if any
      cy.get('@body')
        .its('errors')
        .then((e) => {
          if (e.length > 0) cy.log(`Error message: "${e[0].message}"`)
        })
      // GraphQL returns 200 OK for all completed requests, but can still be errors
      // indicated by the return object having error messages and null in data object
      cy.get('@body').its('errors').should('have.length.at.most', 0)

      cy.get('@body').its('body.data').as('data')
      cy.get('@data')
        .its('applicationApplication')
        .should('not.be.undefined')
        .should('not.be.empty')
        .should('have.length.greaterThan', 0)
      cy.wait(3000)
    })
  })
})
