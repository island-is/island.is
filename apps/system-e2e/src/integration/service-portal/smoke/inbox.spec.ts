import { getFakeUser } from '../../../support/utils'
import fakeUsers from '../../../fixtures/service-portal/users.json'
import { Timeout } from '../../../lib/types'

describe('Service Portal', () => {
  const testUser = getFakeUser(fakeUsers, 'María Sól ÞÍ Torp')
  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: testUser.phoneNumber,
      urlPath: '/minarsidur/',
    })
    cy.visit('/minarsidur')
    cy.wait(Timeout.short)
  })

  it('should have Pósthólf', () => {
    cy.contains('Pósthólf')
    cy.get('a[href="/minarsidur/postholf"]').click()
    cy.contains('Hér getur þú fundið skjöl')
    // TODO: mock items in inbox and verify they appear in the inbox
  })
})
