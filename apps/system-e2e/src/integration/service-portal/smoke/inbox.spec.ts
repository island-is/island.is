import { getFakeUser } from '../../../support/utils'
import fakeUsers from '../../../fixtures/service-portal/users.json'

describe('Service Portal', () => {
  const testUser = getFakeUser(fakeUsers, 'María Sól ÞÍ Torp')
  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: testUser.phoneNumber,
      urlPath: '/minarsidur/',
    })
  })

  it('should have Pósthólf', () => {
    cy.visit('/minarsidur/')
    cy.contains('Pósthólf')
    cy.contains('deleteme')
  })
})
