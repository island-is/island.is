import { regex as uuidRegex } from 'uuidv4'
import { getFakeUser } from '../../../support/utils'
import { FixtureUser, Timeout } from '../../../lib/types'
import fakeUsers from '../../../fixtures/service-portal/users.json'

const fakeUser: FixtureUser = getFakeUser(fakeUsers, 'Gervimaður Afríka')

describe('P-sign', function () {
  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: fakeUser.phoneNumber,
      urlPath: '/umsoknir/p-merki',
      setBaseUrl: true,
    })
  })

  it('should be able to create application', () => {
    cy.visit('/umsoknir/p-merki')
    cy.bypassApplicationFluff()

    // First page load takes a long time
    cy.contains('Gagnaöflun', { timeout: Timeout.long })
    cy.pathUuid().should('match', uuidRegex.v4)

    // Data collection
    cy.get('input[name="approveExternalData"]').click()
    cy.get('button[type="submit"]').click()
    cy.get('[data-testid="alertMessage"]').should('not.exist')

    // Information
    cy.contains('Símanúmer')
    cy.get('input[name="phone"]').type('{selectAll}{backspace}7654321')
    cy.get('input[name="email"]').type('{selectAll}{backspace}secret@island.is')

    cy.get('button[type="submit"]').click()
  })
})
