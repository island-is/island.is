import { getApplicationQuery } from 'src/support/utils'
import { regex as uuidRegex } from 'uuidv4'

interface Application {
  id: string
  user: string
}

const baseUrl = Cypress.config().baseUrl
const fakeUsers: FakeUser[] = Cypress.env('fakeUsers')
const applications: Application[] = []

describe('P-sign', () => {
  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: fakeUsers[0].phoneNumber,
      url: '/',
    })
    cy.visit('/umsoknir/p-merki')
    cy.get('form').should('exist')
  })

  it('should be able to create application', () => {
    cy.pathUuid().should('match', uuidRegex.v4)
    cy.get('input[name="approveExternalData"]').click()
    cy.get('button[type="submit"]').click()
    cy.pathUuid().then((applicationId) => {
      cy.gqlRequest(
        'ApplicationApplication',
        getApplicationQuery(applicationId),
      )
        .its('data.applicationApplication')
        .should('not.be.empty')
    })
  })

  it('should filter applications', () => {
    cy.createApplication(ApplicationType.pSign)
    cy.log("hi")
  })
})
