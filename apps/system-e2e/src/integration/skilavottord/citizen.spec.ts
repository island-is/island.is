describe('Silavottorð', () => {
  const fakeUsers: FakeUser[] = Cypress.env('fakeUsers')

  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: fakeUsers[0].phoneNumber,
      url: '/app/skilavottord/my-cars',
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
