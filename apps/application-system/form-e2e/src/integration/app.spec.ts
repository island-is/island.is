describe('application-system-form', () => {
  before(() => {
    cy.server()
    cy.route('POST', '/api/graphql').as('graphql')
  })
  beforeEach(() => cy.visit('/umsoknir/example'))

  it('should display form title', () => {
    cy.wait('@graphql')
    cy.contains('ExampleForm')
  })
})
