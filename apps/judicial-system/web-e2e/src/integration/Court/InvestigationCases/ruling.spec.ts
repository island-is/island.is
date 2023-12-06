import faker from 'faker'

import {
  INVESTIGATION_CASE_COURT_RECORD_ROUTE,
  INVESTIGATION_CASE_RULING_ROUTE,
} from '@island.is/judicial-system/consts'

import { mockCase, intercept } from '../../../utils'
import { CaseType, UserRole } from '@island.is/judicial-system/types'

describe(`${INVESTIGATION_CASE_RULING_ROUTE}/:id`, () => {
  const lorem = faker.lorem.sentence()

  beforeEach(() => {
    const caseData = mockCase(CaseType.INTERNET_USAGE)
    const caseDataAddition = {
      ...caseData,
      demands: lorem,
      caseFacts: lorem,
      legalArguments: lorem,
    }

    cy.login(UserRole.DISTRICT_COURT_JUDGE)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${INVESTIGATION_CASE_RULING_ROUTE}/test_id_stadfest`)
  })

  it('should autofill conclusion when accepting decision is chosen and decision is ACCEPTING', () => {
    cy.get('[name="conclusion"]').should('match', ':empty')
    cy.get('#case-decision-accepting').click()
    cy.get('[name="conclusion"]').contains(lorem)
    cy.get('#case-decision-rejecting').click()
    cy.get('[name="conclusion"]').contains(lorem)
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.wait('@gqlCaseQuery')

    // Introduction validation
    cy.getByTestid('introduction').invoke('val').should('not.be.empty')
    cy.getByTestid('introduction').clear()
    cy.clickOutside()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('introduction').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')

    // Prosecutor demands validation
    cy.getByTestid('prosecutorDemands').invoke('val').should('not.be.empty')
    cy.getByTestid('prosecutorDemands').clear()
    cy.clickOutside()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('prosecutorDemands').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')

    // Court case facts validation
    cy.getByTestid('courtCaseFacts').invoke('val').should('not.be.empty')
    cy.getByTestid('courtCaseFacts').clear()
    cy.clickOutside()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('courtCaseFacts').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')

    // Legal arguments validation
    cy.getByTestid('courtLegalArguments').invoke('val').should('not.be.empty')
    cy.getByTestid('courtLegalArguments').clear()
    cy.clickOutside()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('courtLegalArguments').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')

    // Ruling should be autofilled but not required
    cy.getByTestid('ruling').invoke('val').should('not.be.empty')
    cy.getByTestid('ruling').clear()

    cy.get('#case-decision-accepting').check()
    cy.getByTestid('continueButton').should('not.be.disabled').click()
    cy.url().should('include', INVESTIGATION_CASE_COURT_RECORD_ROUTE)
  })
})
