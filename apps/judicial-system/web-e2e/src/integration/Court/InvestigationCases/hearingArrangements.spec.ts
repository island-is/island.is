import faker from 'faker'

import {
  Case,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
  INVESTIGATION_CASE_RULING_ROUTE,
} from '@island.is/judicial-system/consts'

import { mockCase, makeCourt, intercept } from '../../../utils'

describe(`${INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/:id`, () => {
  const comment = faker.lorem.sentence(1)

  beforeEach(() => {
    const caseData = mockCase(CaseType.INTERNET_USAGE)
    const caseDataAddition: Case = {
      ...caseData,
      comments: comment,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
      defenderName: 'Test Testesen',
      courtDate: '2020-09-16T19:50:08.033Z',
    }

    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(
      `${INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/test_id_stadfest`,
    )
  })

  it('should display case comments', () => {
    cy.contains(comment)
  })

  it('should ask for defender info depending on selected session arrangement and warn users if defender is not found in the lawyer registry', () => {
    cy.get('[name="session-arrangements-all-present"]').click()
    cy.get('[name*="defenderName"]').should('exist')
    cy.get('[name*="defenderEmail"]').should('exist')
    cy.get('[name*="defenderPhoneNumber"]').should('exist')

    cy.get('#react-select-defenderName-input').type('click', { force: true })
    cy.get('#react-select-defenderName-input').type('{enter}')

    cy.getByTestid('defenderNotFound').should('exist')

    cy.get('[name="session-arrangements-all-present_spokesperson"]').click()
    cy.get('[name*="defenderName"]').should('exist')
    cy.get('[name*="defenderEmail"]').should('exist')
    cy.get('[name*="defenderPhoneNumber"]').should('exist')

    cy.get('[name="session-arrangements-prosecutor-present"]').click()
    cy.get('[name*="defenderName"]').should('not.exist')
    cy.get('[name*="defenderEmail"]').should('not.exist')
    cy.get('[name*="defenderPhoneNumber"]').should('not.exist')
  })

  it('should autofill form correctly and allow court to confirm court date and send notification', () => {
    cy.wait('@UpdateCaseMutation')
      .its('response.body.data.updateCase')
      .should('have.keys', 'sessionArrangements', 'id', '__typename')

    cy.get('[name="session-arrangements-all-present"]').should('be.checked')
    cy.getByTestid('courtDate-time').should('have.value', '19:50')

    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.wait('@UpdateCaseMutation')
      .its('response.body.data.updateCase')
      .should('have.any.key', 'courtDate')

    cy.getByTestid('modal').should('be.visible')
    cy.getByTestid('modalPrimaryButton').click()
    cy.wait('@SendNotificationMutation')
      .its('request.body.variables.input.type')
      .should('equal', 'COURT_DATE')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.get('[name="session-arrangements-all-present"]').click()

    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('include', INVESTIGATION_CASE_RULING_ROUTE)
  })
})
