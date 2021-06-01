describe('Signed verdict overview', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/krafa/yfirlit/test_id')
  })

  it('should not allow users to share cases with the institution they themselves belong to', () => {
    cy.getByTestid('select-sharedWithProsecutorsOfficeId')
      .click()
      .should('contain.text', 'Héraðssaksóknari')
      .should('not.contain.text', 'Lögreglustjórinn á höfuðborgarsvæðinu')
  })
})
