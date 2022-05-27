import {
  STEP_FIVE_ROUTE,
  STEP_FOUR_ROUTE,
} from '@island.is/judicial-system/consts'

import { makeRestrictionCase, intercept } from '../../../utils'

describe(`${STEP_FOUR_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = makeRestrictionCase()

    cy.stubAPIResponses()
    cy.visit(`${STEP_FOUR_ROUTE}/test_id`)

    intercept(caseData)
  })

  it('should validate form', () => {
    cy.get('[name=demands]').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.get('[name=demands]').type('lorem ipsum')
    cy.getByTestid('inputErrorMessage').should('not.exist')

    cy.get('[name=caseFacts]').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.get('[name=caseFacts]').type('lorem ipsum')
    cy.getByTestid('inputErrorMessage').should('not.exist')

    cy.get('[name=legalArguments]').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.get('[name=legalArguments]').type('lorem ipsum')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.get('[name=demands]').type('lorem ipsum')
    cy.get('[name=caseFacts]').type('lorem ipsum')
    cy.get('[name=legalArguments]').type('lorem ipsum')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', STEP_FIVE_ROUTE)
  })
})
