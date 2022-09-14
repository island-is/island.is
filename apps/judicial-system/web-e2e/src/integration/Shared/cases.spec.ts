import { CASES_ROUTE } from '@island.is/judicial-system/consts'

describe(CASES_ROUTE, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit(CASES_ROUTE)
  })

  it.skip('should have a table with one row that is a button', () => {
    cy.getByTestid('custody-cases-table-row').should(
      'have.attr',
      'role',
      'button',
    )
  })

  it.skip('should have a button that allows me to create a custody and travel ban cases', () => {
    cy.getByTestid('createCaseDropdown').click()
    cy.contains('a', 'Gæsluvarðhald')
    cy.contains('a', 'Farbann')
    cy.contains('a', 'Rannsóknaheimild')
  })

  it.skip('should have a button that allows me to delete cases', () => {
    cy.getByTestid('deleteCase').click()
    cy.contains('button', 'Afturkalla')
  })
})
