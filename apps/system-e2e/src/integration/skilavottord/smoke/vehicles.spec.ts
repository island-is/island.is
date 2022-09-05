import { FixtureUser } from '../../../lib/types'
import { getFakeUser } from '../../../support/utils'
import fakeUsers from '../../../fixtures/skilavottord/users.json'

describe.skip('Skilavottorð', () => {
  const path = '/app/skilavottord/my-cars'
  const fakeUser: FixtureUser = getFakeUser(fakeUsers, 'Gervimaður Útlönd')

  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: fakeUser.phoneNumber,
      baseUrl: Cypress.env('baseUrl'),
      urlPath: '/app/skilavottord/my-cars',
    })
  })

  it('should render list', () => {
    cy.visit(path)
    cy.contains('Úrvinnsla ökutækis')
    cy.contains('Þín ökutæki')
    cy.get('p:contains(Óendurvinnanlegt)').should('have.length.gt', 1)
    cy.contains('Förguð ökutæki')
    cy.get('button:contains(Endurunnin)').should('have.length.gt', 1)
  })
})
