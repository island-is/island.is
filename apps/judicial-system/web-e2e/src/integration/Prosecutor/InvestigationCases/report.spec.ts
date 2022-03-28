import faker from 'faker'

import { makeInvestigationCase } from '@island.is/judicial-system/formatters'
import { Case } from '@island.is/judicial-system/types'
import {
  IC_CASE_FILES_ROUTE,
  IC_POLICE_REPORT_ROUTE,
} from '@island.is/judicial-system/consts'

import { intercept } from '../../../utils'

describe(`${IC_POLICE_REPORT_ROUTE}/:id`, () => {
  const demands = faker.lorem.paragraph()

  beforeEach(() => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      demands,
    }

    cy.stubAPIResponses()
    cy.visit(`${IC_POLICE_REPORT_ROUTE}/test_id`)

    intercept(caseDataAddition)
  })

  it('should display the demand', () => {
    cy.contains(demands)
  })

  it('should require a valid case facts value', () => {
    cy.getByTestid('caseFacts').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('caseFacts').type(faker.lorem.words(5))
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid legal arguments value', () => {
    cy.getByTestid('legalArguments').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('legalArguments').type(faker.lorem.words(5))
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should autofill prosecutor-only-session-request when request-prosecutor-only-session is checked', () => {
    cy.get('[name=prosecutor-only-session-request]').should('be.empty')
    cy.get('[name=request-prosecutor-only-session]').check()
    cy.get('[name=prosecutor-only-session-request]').should('not.be.empty')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('caseFacts').type(faker.lorem.words(5))
    cy.getByTestid('legalArguments').type(faker.lorem.words(5))
    cy.getByTestid('continueButton').click()
    cy.url().should('include', IC_CASE_FILES_ROUTE)
  })
})
