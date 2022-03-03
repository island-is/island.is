import {
  CONFIRMATION_ROUTE,
  RULING_STEP_TWO_ROUTE,
} from '@island.is/judicial-system/consts'
import { makeCustodyCase } from '@island.is/judicial-system/formatters'
import { Case } from '@island.is/judicial-system/types'

import { intercept } from '../../../utils'

describe(`${RULING_STEP_TWO_ROUTE}/:id`, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
  })

  it('should require a accused and prosecutor appeal decisions to be made', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      courtStartDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit(`${RULING_STEP_TWO_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('continueButton').should('be.disabled')
    cy.get('#prosecutor-appeal').check()
    cy.get('#accused-appeal').check()
    cy.getByTestid('courtEndTime').type('11:00')
    cy.getByTestid('continueButton').should('not.be.disabled')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      courtStartDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit(`${RULING_STEP_TWO_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.get('#prosecutor-appeal').check()
    cy.get('#accused-appeal').check()
    cy.getByTestid('courtEndTime').type('11:00')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', CONFIRMATION_ROUTE)
  })
})
