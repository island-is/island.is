describe('application-system-form', () => {
  beforeEach(() => cy.visit('/'))

  it('should display form title', () => {
    cy.contains('Atvinnuleysisbætur')
  })
})
