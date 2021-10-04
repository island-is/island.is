/// <reference path="../../support/index.d.ts" />

import { Case } from '@island.is/judicial-system/types'
import { makeCase } from '../../fixtures/testDataFactory'
import { intercept } from '../../utils'

describe('/domur/urskurdur/:id', () => {
  beforeEach(() => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
    }
    cy.stubAPIResponses()

    intercept(caseDataAddition)
  })

  it('should require a valid ruling', () => {
    cy.visit('/domur/urskurdur/test_id_stadfest')
    cy.getByTestid('ruling').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('ruling').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.visit('/domur/urskurdur/test_id_stadfest')
    cy.getByTestid('ruling').type('lorem')
    cy.get('#case-decision-accepting').check()
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/urskurdarord/test_id_stadfest')
  })

  it('should show appropriate valid to dates based on decision', () => {
    cy.visit('/domur/urskurdur/test_id_without_decision')
    cy.getByTestid('caseDecisionSection').should('not.exist')
    cy.get('#case-decision-accepting').check()
    cy.getByTestid('caseDecisionSection').should('exist')
    cy.get('#case-decision-rejecting').check()
    cy.getByTestid('caseDecisionSection').should('not.exist')
    cy.get('#case-decision-accepting-partially').check()
    cy.getByTestid('caseDecisionSection').should('exist')
  })
})
