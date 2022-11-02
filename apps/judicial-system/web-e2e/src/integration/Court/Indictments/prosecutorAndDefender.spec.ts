import { INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE } from '@island.is/judicial-system/consts'
import { CaseType, UserRole } from '@island.is/judicial-system/types'

import {
  makeCourt,
  mockCase,
  makeProsecutor,
  intercept,
  hasOperationName,
  Operation,
  makeJudge,
} from '../../../utils'

describe(`${INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = mockCase(CaseType.MURDER)
    const caseDataAddition = {
      ...caseData,
      prosecutor: makeProsecutor(),
      creatingProsecutor: makeProsecutor(),
      court: makeCourt(),
      judge: makeJudge(),
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.login(UserRole.JUDGE)
    cy.visit(`${INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE}/test_id`)
  })

  it('should validate the form', () => {
    // should set the default prosecutor as the user who created the case
    cy.getByTestid('select-prosecutor').contains('Áki Ákærandi')

    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('creatable-select-defenderName')
      .click()
      .find('input')
      .get('.island-select__option')
      .should('contain', 'Logmadur')
      .click()
    cy.getByTestid('defenderEmail').should('have.value', 'logmadur@logmenn.is')
    cy.getByTestid('defenderPhoneNumber').should('have.value', '666-6666')
    cy.getByTestid('defenderNotFound').should('not.exist')
    cy.getByTestid('continueButton').should('be.enabled')

    cy.getByTestid('defendantWaivesRightToCounsel').first().check()
    cy.getByTestid('creatable-select-defenderName').should('not.have.value')
    cy.getByTestid('defenderEmail')
      .should('have.value', '')
      .should('be.disabled')
    cy.getByTestid('defenderPhoneNumber')
      .should('have.value', '')
      .should('be.disabled')
    cy.getByTestid('continueButton').should('be.enabled')

    cy.getByTestid('defendantWaivesRightToCounsel').uncheck()
    cy.getByTestid('continueButton').should('be.disabled')
  })

  it('should send notification to defender', () => {
    cy.getByTestid('select-prosecutor').contains('Áki Ákærandi')

    cy.getByTestid('creatable-select-defenderName')
      .click()
      .find('input')
      .get('.island-select__option')
      .should('contain', 'Logmadur')
      .click()
    cy.getByTestid('defenderEmail').should('have.value', 'logmadur@logmenn.is')

    cy.intercept('POST', '**/api/graphql', (req) => {
      if (hasOperationName(req, Operation.SendNotificationMutation)) {
        req.alias = 'sendNotification'
      }
    })
    cy.getByTestid('continueButton').click()
    cy.wait('@sendNotification')
      .its('request.body.variables.input.type')
      .should('eq', 'DEFENDER_ASSIGNED')
  })
})
