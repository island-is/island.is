describe('web', () => {
  before(() => {
    cy.ensureLoggedIn({ url: '/minarsidur/' })
  })
  it('should navigate serviceportal', () => {
    cy.visit('/minarsidur/')
    // TODO: IDS login
    cy.contains('Skráðu þig inn')
  })
})
