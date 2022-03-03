import faker from 'faker'

import {
  IC_COURT_HEARING_ARRANGEMENTS_ROUTE,
  IC_COURT_RECORD_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  makeCourt,
  makeInvestigationCase,
} from '@island.is/judicial-system/formatters'
import { Case, CaseState } from '@island.is/judicial-system/types'

import { intercept } from '../../../utils'

describe(`${IC_COURT_HEARING_ARRANGEMENTS_ROUTE}/:id`, () => {
  beforeEach(() => {
    cy.login()

    cy.stubAPIResponses()
    cy.visit(`${IC_COURT_HEARING_ARRANGEMENTS_ROUTE}/test_id_stadfest`)
  })

  it('should display case comments', () => {
    const caseData = makeInvestigationCase()
    const comment = faker.lorem.sentence(1)
    const caseDataAddition: Case = {
      ...caseData,
      comments: comment,
    }

    intercept(caseDataAddition)

    cy.contains(comment)
  })

  it('should allow users to choose if they send COURT_DATE notification', () => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    intercept(caseDataAddition)

    cy.get('[name="session-arrangements-all-present"]').click()
    cy.getByTestid('courtroom').type('1337')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modal').should('be.visible')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    intercept(caseDataAddition)

    cy.get('[name="session-arrangements-all-present"]').click()
    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('include', IC_COURT_RECORD_ROUTE)
  })
})
