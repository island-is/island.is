import * as faker from 'faker'

import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'
import {
  RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
  RESTRICTION_CASE_RULING_ROUTE,
} from '@island.is/judicial-system/consts'

import { makeCourt, intercept, mockCase } from '../../../utils'

describe(`${RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/:id`, () => {
  const caseData = mockCase(CaseType.CUSTODY)
  const comment = faker.lorem.sentence(1)

  beforeEach(() => {
    const caseDataAddition: Case = {
      ...caseData,
      comments: comment,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      requestedValidToDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(
      `${RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/test_id_stadfest`,
    )
  })

  it('should display case comments', () => {
    cy.contains(comment)
  })

  it('should display a warning if the user enters a lawyer that is not in the lawyer registry', () => {
    cy.get('#react-select-defenderName-input').type('click', { force: true })
    cy.get('#react-select-defenderName-input').type('{enter}')
    cy.getByTestid('defenderNotFound').should('exist')
  })

  it('should allow users to choose if they send COURT_DATE notification', () => {
    cy.getByTestid('courtroom').type('1337')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modal').should('be.visible')
  })

  it('should autofill properties', () => {
    cy.wait('@UpdateCaseMutation')
      .its('response.body.data.updateCase')
      .should('have.any.key', 'validToDate')
      .should('have.any.key', 'isolationToDate')
      .should('have.any.key', 'isCustodyIsolation')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('continueButton').click()
    cy.wait('@UpdateCaseMutation')
    cy.wait('@UpdateCaseMutation')
      .its('response.body.data.updateCase')
      .should('have.any.key', 'courtDate')

    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should(
      'include',
      `${RESTRICTION_CASE_RULING_ROUTE}/${caseData.id}`,
    )
  })
})
