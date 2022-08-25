import { regex as uuidRegex } from 'uuidv4'
import { getFakeUser } from '../../support/utils'
import { FixtureUser } from '../../lib/types'
import fakeUsers from '../../fixtures/service-portal/users.json'

const fakeUser: FixtureUser = getFakeUser(
  fakeUsers as FixtureUser[],
  'Gervimaður Afríka',
)

describe('P-sign', function () {
  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: fakeUser.mobile,
      urlPath: '/umsoknir/p-merki',
    })
  })

  it('should be able to create application', () => {
    cy.visit('/umsoknir/p-merki')

    // First page load takes a long time
    cy.contains('Gagnaöflun', { timeout: 10000 })
    cy.pathUuid().should('match', uuidRegex.v4)

    // Data collection
    cy.get('input[name="approveExternalData"]').click()
    cy.get('button[type="submit"]').click()
    cy.wait(5000)
    cy.get('[data-testid="alertMessage"]').should('not.exist')

    // Information
    cy.contains('Símanúmer')
    cy.get('input[name="phone"]').type('7654321')
    cy.get('input[name="email"]').type('secret@island.is')

    cy.get('button[type="submit"]').click()
  })
})
