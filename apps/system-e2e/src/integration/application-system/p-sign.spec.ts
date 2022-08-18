import { regex as uuidRegex } from 'uuidv4'
import { getFakeUser } from '../../support/utils'
import { FakeUser } from '../../lib/types'
import fakeUsers from '../../fixtures/service-portal/users.json'

const fakeUser: FakeUser = getFakeUser(
  fakeUsers as FakeUser[],
  'María Sól ÞÍ Torp',
)

describe('P-sign', function () {
  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: fakeUser.phoneNumber,
      urlPath: '/minarsidur',
    })
  })

  it('should be able to create application', () => {
    cy.visit('/umsoknir/p-merki')
    cy.contains('Gagnaöflun', { timeout: 10000 })
    cy.pathUuid().should('match', uuidRegex.v4)

    // Data collection
    cy.get('input[name="approveExternalData"]').click()
    cy.get('button[type="submit"]').click()

    // Information
    cy.get('input').type('blablabla')
  })
})
