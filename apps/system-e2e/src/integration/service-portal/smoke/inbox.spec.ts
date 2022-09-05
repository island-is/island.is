import fakeUsers from '../../../fixtures/service-portal/users.json'

describe('Service Portal', () => {
  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: fakeUsers[0].phoneNumber,
      baseUrl: Cypress.config('baseUrl'),
      urlPath: '/minarsidur/',
    })
  })

  it(`should have user ${fakeUsers[0].name} logged in`, () => {
    cy.visit('/minarsidur/')
    cy.contains(fakeUsers[0].name)
  })
  it('should have Pósthólf', () => {
    cy.visit('/minarsidur/')
    cy.contains('Pósthólf')
  })
})
