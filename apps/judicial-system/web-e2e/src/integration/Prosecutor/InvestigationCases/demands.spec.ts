import faker from 'faker'

import {
  INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE,
  INVESTIGATION_CASE_POLICE_REPORT_ROUTE,
} from '@island.is/judicial-system/consts'

import { mockCase, intercept } from '../../../utils'
import { CaseType } from '@island.is/judicial-system/types'

describe(`${INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = mockCase(CaseType.INTERNET_USAGE)

    cy.stubAPIResponses()
    intercept(caseData)
    cy.visit(`${INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE}/test_id`)
  })

  it('should require a valid demands value', () => {
    cy.getByTestid('demands').click()
    cy.getByTestid('demands').blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('demands').type(faker.lorem.words(5))
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid laws broken value', () => {
    cy.getByTestid('lawsBroken').click()
    cy.getByTestid('lawsBroken').blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('lawsBroken').type(faker.lorem.words(5))
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid legal basis value', () => {
    cy.getByTestid('legalBasis').click()
    cy.getByTestid('legalBasis').blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('legalBasis').type(faker.lorem.words(5))
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('demands').type(faker.lorem.words(5))
    cy.getByTestid('lawsBroken').type(faker.lorem.words(5))
    cy.getByTestid('legalBasis').type(faker.lorem.words(5))
    cy.getByTestid('continueButton').click()
    cy.url().should('include', INVESTIGATION_CASE_POLICE_REPORT_ROUTE)
  })
})
