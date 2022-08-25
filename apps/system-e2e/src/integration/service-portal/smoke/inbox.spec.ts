import { getFakeUser } from '../../../support/utils'
import fakeUsers from '../../../fixtures/service-portal/users.json'

describe('Service Portal', () => {
  const userName = 'María Sól ÞÍ Torp'
  const testUser = getFakeUser(fakeUsers, userName)
  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: testUser,
      urlPath: '/minarsidur/',
    })
  })

  it(`should have ${userName} logged in`, () => {
    cy.visit('/minarsidur/')
    cy.contains(userName)
  })

  it('should have Pósthólf', () => {
    cy.visit('/minarsidur/')
    cy.contains('Pósthólf')
  })
})
