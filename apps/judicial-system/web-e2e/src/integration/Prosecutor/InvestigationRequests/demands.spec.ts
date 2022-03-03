import faker from 'faker'

import { makeInvestigationCase } from '@island.is/judicial-system/formatters'
import {
  IC_POLICE_DEMANDS_ROUTE,
  IC_POLICE_REPORT_ROUTE,
} from '@island.is/judicial-system/consts'

import { intercept } from '../../../utils'

describe(`${IC_POLICE_DEMANDS_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = makeInvestigationCase()

    cy.stubAPIResponses()
    cy.visit(`${IC_POLICE_DEMANDS_ROUTE}/test_id`)

    intercept(caseData)
  })

  it('should require a valid demands value', () => {
    cy.getByTestid('demands').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('demands').type(faker.lorem.words(5))
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid laws broken value', () => {
    cy.getByTestid('lawsBroken').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('lawsBroken').type(faker.lorem.words(5))
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid legal basis value', () => {
    cy.getByTestid('legalBasis').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('legalBasis').type(faker.lorem.words(5))
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('demands').type(faker.lorem.words(5))
    cy.getByTestid('lawsBroken').type(faker.lorem.words(5))
    cy.getByTestid('legalBasis').type(faker.lorem.words(5))
    cy.getByTestid('continueButton').click()
    cy.url().should('include', IC_POLICE_REPORT_ROUTE)
  })
})
