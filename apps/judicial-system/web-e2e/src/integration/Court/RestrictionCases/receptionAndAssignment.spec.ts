import {
  makeCourt,
  makeCustodyCase,
} from '@island.is/judicial-system/formatters'
import { CaseState } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system-web/src/utils/constants'

import { intercept } from '../../../utils'

describe(`${constants.RECEPTION_AND_ASSIGNMENT_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = makeCustodyCase()

    const caseDataAddition = {
      ...caseData,
      state: CaseState.RECEIVED,
      court: makeCourt(),
    }

    cy.login()
    cy.stubAPIResponses()
    cy.visit(`${constants.RECEPTION_AND_ASSIGNMENT_ROUTE}/test`)

    intercept(caseDataAddition)
  })

  it('should require a valid case id', () => {
    cy.getByTestid('courtCaseNumber').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('courtCaseNumber').type('R-X/2021')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('courtCaseNumber').type('R-X/2021')
    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()
    cy.getByTestid('select-registrar').click()
    cy.get('#react-select-registrar-option-0').click()
    cy.getByTestid('continueButton').click()
    cy.url().should('include', constants.OVERVIEW_ROUTE)
  })
})
