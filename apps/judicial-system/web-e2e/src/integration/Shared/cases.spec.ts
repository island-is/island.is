import { CASES_ROUTE } from '@island.is/judicial-system/consts'
import { UserRole } from '@island.is/judicial-system/types'

import { hasOperationName, Operation } from '../../utils'

describe(CASES_ROUTE, () => {
  beforeEach(() => {
    cy.login(UserRole.PROSECUTOR)
    cy.stubAPIResponses()
    cy.intercept('POST', '**/api/graphql', (req) => {
      if (hasOperationName(req, Operation.CaseListQuery)) {
        req.reply({
          fixture: 'cases',
        })
      }
    })
    cy.visit(CASES_ROUTE)
  })

  it('should have a table with one row that is a button', () => {
    cy.getByTestid('custody-cases-table-row').should(
      'have.attr',
      'role',
      'button',
    )
  })

  it('should have a button that allows me to create a custody, travel ban, investigation and indictment cases', () => {
    cy.getByTestid('createCaseDropdown').click()
    // cy.contains('a', 'Ákæra') TODO: Uncomment when indictments become available
    cy.contains('a', 'Gæsluvarðhald')
    cy.contains('a', 'Farbann')
    cy.contains('a', 'Rannsóknarheimild')
  })

  it('should have a button that allows me to delete cases', () => {
    cy.getByTestid('deleteCase').click()
    cy.contains('button', 'Afturkalla')
  })
})
