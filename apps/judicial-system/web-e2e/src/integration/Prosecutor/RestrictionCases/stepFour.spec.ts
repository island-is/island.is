import {
  RESTRICTION_CASE_CASE_FILES_ROUTE,
  RESTRICTION_CASE_POLICE_REPORT_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseType } from '@island.is/judicial-system/types'

import { intercept, mockCase } from '../../../utils'

describe(`${RESTRICTION_CASE_POLICE_REPORT_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = mockCase(CaseType.CUSTODY)

    cy.stubAPIResponses()
    intercept(caseData)
    cy.visit(`${RESTRICTION_CASE_POLICE_REPORT_ROUTE}/test_id`)
  })

  it('should validate form', () => {
    cy.get('[name=demands]').click()
    cy.get('[name=demands]').blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.get('[name=demands]').type('lorem ipsum')
    cy.getByTestid('inputErrorMessage').should('not.exist')

    cy.get('[name=caseFacts]').click()
    cy.get('[name=caseFacts]').blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.get('[name=caseFacts]').type('lorem ipsum')
    cy.getByTestid('inputErrorMessage').should('not.exist')

    cy.get('[name=legalArguments]').click()
    cy.get('[name=legalArguments]').blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.get('[name=legalArguments]').type('lorem ipsum')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.get('[name=demands]').type('lorem ipsum')
    cy.get('[name=caseFacts]').type('lorem ipsum')
    cy.get('[name=legalArguments]').type('lorem ipsum')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', RESTRICTION_CASE_CASE_FILES_ROUTE)
  })
})
