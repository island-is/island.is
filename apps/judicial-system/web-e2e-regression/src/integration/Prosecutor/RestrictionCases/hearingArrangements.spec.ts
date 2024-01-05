import {
  RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
  RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseTransition, CaseType } from '@island.is/judicial-system/types'

import { transitionCase, loginAndCreateCase } from '../../../utils'

describe(RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE, () => {
  let caseId = ''

  before(() => {
    cy.intercept('POST', '**/api/graphql', (req) => {
      if (req.body.query.includes('ProsecutorSelectionUsers')) {
        req.alias = 'gqlProsecutorSelectionUsersQuery'
      }
    })

    loginAndCreateCase(CaseType.CUSTODY, ['007-2020-0101']).then((id) => {
      caseId = id
      cy.visit(
        `http://localhost:4200${RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`,
      )
    })
  })

  after(() => {
    transitionCase(caseId, CaseTransition.DELETE)
  })

  it('should validate the form', () => {
    cy.wait('@gqlProsecutorSelectionUsersQuery')
    cy.getByTestid('select-prosecutor').click()
    cy.get('[id="react-select-prosecutor-option-0"]').click()
    cy.getByTestid('continueButton').should('be.disabled')

    cy.getByTestid('select-court').click()
    cy.get('[id="react-select-court-option-0"]').click()
    cy.getByTestid('continueButton').should('be.disabled')

    cy.get('#arrestDate').type('2020-10-10')
    cy.get('#arrestDate').type('{enter}')
    cy.get('#arrestDate-time').type('10:10')

    cy.get('#reqCourtDate').type('2020-10-10')
    cy.get('#reqCourtDate').type('{enter}')
    cy.get('#reqCourtDate-time').type('10:10')

    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()

    cy.url().should('contain', RESTRICTION_CASE_POLICE_DEMANDS_ROUTE)
  })
})
