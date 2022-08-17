describe('Silavottorð', () => {
  const fakeUsers: FakeUser[] = Cypress.env('fakeUsers')
  const path = '/app/skilavottord/my-cars'

  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: fakeUsers[2].phoneNumber,
      urlPath: path,
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
