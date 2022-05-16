import faker from 'faker'

import { Case, CaseState } from '@island.is/judicial-system/types'
import {
  IC_COURT_HEARING_ARRANGEMENTS_ROUTE,
  IC_RULING_ROUTE,
} from '@island.is/judicial-system/consts'

import {
  makeInvestigationCase,
  makeCourt,
  intercept,
  interceptUpdateCase,
} from '../../../utils'

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

  it('should ask for defender info depending on selected session arrangement and warn users if defender is not found in the lawyer registry', () => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    intercept(caseDataAddition)

    cy.get('[name="session-arrangements-all-present"]').click()
    cy.get('[name="defenderName"]').should('exist')
    cy.get('[name="defenderEmail"]').should('exist')
    cy.get('[name="defenderPhoneNumber"]').should('exist')

    cy.get('#react-select-defenderName-input')
      .type('click', { force: true })
      .type('{enter}')
    cy.getByTestid('defenderNotFound').should('exist')

    cy.get('[name="session-arrangements-all-present_spokesperson"]').click()
    cy.get('[name="defenderName"]').should('exist')
    cy.get('[name="defenderEmail"]').should('exist')
    cy.get('[name="defenderPhoneNumber"]').should('exist')

    cy.get('[name="session-arrangements-prosecutor-present"]').click()
    cy.get('[name="defenderName"]').should('not.exist')
    cy.get('[name="defenderEmail"]').should('not.exist')
    cy.get('[name="defenderPhoneNumber"]').should('not.exist')
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
    cy.url().should('include', IC_RULING_ROUTE)
  })
})
