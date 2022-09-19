import {
  INDICTMENTS_CASE_FILES_ROUTE,
  INDICTMENTS_PROCESSING_ROUTE,
} from '@island.is/judicial-system/consts'

describe(`${INDICTMENTS_PROCESSING_ROUTE}/:id`, () => {
  before(() => {
    cy.visit(
      `${INDICTMENTS_PROCESSING_ROUTE}/${localStorage.getItem('caseId')}`,
    )
  })

  it('should navigate to the correct page on continue', () => {
    cy.getByTestid('continueButton').click()
    cy.url().should('contain', INDICTMENTS_CASE_FILES_ROUTE)
  })
})
