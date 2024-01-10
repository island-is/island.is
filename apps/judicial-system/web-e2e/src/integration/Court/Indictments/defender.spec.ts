import { INDICTMENTS_DEFENDER_ROUTE } from '@island.is/judicial-system/consts'
import { CaseType, UserRole } from '@island.is/judicial-system/types'

import {
  makeCourt,
  mockCase,
  makeProsecutor,
  intercept,
  hasOperationName,
  Operation,
  makeJudge,
  makeDefendant,
} from '../../../utils'

describe(`${INDICTMENTS_DEFENDER_ROUTE}/:id`, () => {
  const caseData = mockCase(CaseType.INDICTMENT)
  const defendant1 = makeDefendant(caseData.id)
  const defendant2 = makeDefendant(caseData.id)

  beforeEach(() => {
    const caseDataAddition = {
      ...caseData,
      prosecutor: makeProsecutor(),
      creatingProsecutor: makeProsecutor(),
      court: makeCourt(),
      judge: makeJudge(),
      defendants: [defendant1, defendant2],
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.login(UserRole.DISTRICT_COURT_JUDGE)
    cy.visit(`${INDICTMENTS_DEFENDER_ROUTE}/test_id`)
  })

  it('should validate the form', () => {
    cy.getByTestid('continueButton').should('be.disabled')
    const createableSelectTestId = `creatable-select-defenderName-${defendant1.id}`
    cy.getByTestid(createableSelectTestId).click()
    cy.getByTestid(createableSelectTestId)
      .find('input')
      .get('.island-select__option')
      .should('contain', 'Logmadur')
    cy.getByTestid(createableSelectTestId)
      .find('input')
      .get('.island-select__option')
      .click()
    cy.getByTestid(`defenderEmail-${defendant1.id}`).should(
      'have.value',
      'logmadur@logmenn.is',
    )
    cy.getByTestid(`defenderPhoneNumber-${defendant1.id}`).should(
      'have.value',
      '666-6666',
    )

    cy.getByTestid('defenderNotFound').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')

    cy.getByTestid('continueButton').should('be.disabled')
    const createableSelectTestId2 = `creatable-select-defenderName-${defendant2.id}`

    cy.getByTestid(createableSelectTestId2).click()
    cy.getByTestid(createableSelectTestId2)
      .find('input')
      .get('.island-select__option')
      .should('contain', 'Logmadur')
    cy.getByTestid(createableSelectTestId2)
      .find('input')
      .get('.island-select__option')
      .click()
    cy.getByTestid(`defenderEmail-${defendant2.id}`).should(
      'have.value',
      'logmadur@logmenn.is',
    )
    cy.getByTestid(`defenderPhoneNumber-${defendant2.id}`).should(
      'have.value',
      '666-6666',
    )

    cy.getByTestid(`defendantWaivesRightToCounsel-${defendant1.id}`).check()
    cy.getByTestid(`creatable-select-defenderName-${defendant1.id}`).should(
      'not.have.value',
    )
    cy.getByTestid(`defenderEmail-${defendant1.id}`)
      .should('have.value', '')
      .should('be.disabled')
    cy.getByTestid(`defenderPhoneNumber-${defendant1.id}`)
      .should('have.value', '')
      .should('be.disabled')
    cy.getByTestid('continueButton').should('be.enabled')

    cy.getByTestid(`defendantWaivesRightToCounsel-${defendant1.id}`).uncheck()
    cy.getByTestid('continueButton').should('be.disabled')
  })

  it('should list all defendants and have fields to update defender for each defendant', () => {
    cy.get(
      `[data-testid="creatable-select-defenderName-${defendant1.id}"]`,
    ).should('exist')
    cy.get(
      `[data-testid="creatable-select-defenderName-${defendant2.id}"]`,
    ).should('exist')
  })

  it('should send notification to defender', () => {
    const createableSelectTestId = `creatable-select-defenderName-${defendant1.id}`
    cy.getByTestid(createableSelectTestId).click()
    cy.getByTestid(createableSelectTestId)
      .find('input')
      .get('.island-select__option')
      .should('contain', 'Logmadur')
    cy.getByTestid(createableSelectTestId)
      .find('input')
      .get('.island-select__option')
      .click()

    cy.getByTestid(`defenderEmail-${defendant1.id}`).should(
      'have.value',
      'logmadur@logmenn.is',
    )

    const createableSelectTestId2 = `creatable-select-defenderName-${defendant2.id}`
    cy.getByTestid(createableSelectTestId2).click()
    cy.getByTestid(createableSelectTestId2)
      .find('input')
      .get('.island-select__option')
      .should('contain', 'Logmadur')
    cy.getByTestid(createableSelectTestId2)
      .find('input')
      .get('.island-select__option')
      .click()

    cy.getByTestid(`defenderEmail-${defendant2.id}`).should(
      'have.value',
      'logmadur@logmenn.is',
    )

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
