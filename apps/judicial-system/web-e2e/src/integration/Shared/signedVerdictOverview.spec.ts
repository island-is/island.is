import { SIGNED_VERDICT_OVERVIEW } from '@island.is/judicial-system/consts'

describe('Signed verdict overview', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit(`${SIGNED_VERDICT_OVERVIEW}/test_id`)
  })

  it.skip('should not allow users to share cases with the institution they themselves belong to', () => {
    cy.getByTestid('select-sharedWithProsecutorsOfficeId')
      .click()
      .should('contain.text', 'Héraðssaksóknari')
      .should('not.contain.text', 'Lögreglustjórinn á höfuðborgarsvæðinu')
  })
})
