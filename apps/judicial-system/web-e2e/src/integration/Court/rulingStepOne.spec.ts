/// <reference path="../../support/index.d.ts" />

import {
  Case,
  CaseCustodyRestrictions,
  CaseDecision,
} from '@island.is/judicial-system/types'
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

    cy.visit('/domur/urskurdur/test_id_stadfest')
  })

  it('should require a valid ruling', () => {
    cy.getByTestid('ruling').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('ruling').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('ruling').type('lorem')
    cy.get('#case-decision-accepting').check()
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/urskurdarord/test_id_stadfest')
  })

  it('should show appropriate valid to dates based on decision', () => {
    cy.getByTestid('caseDecisionSection').should('not.exist')
    cy.get('#case-decision-accepting').check()
    cy.getByTestid('caseDecisionSection').should('exist')
    cy.get('#case-decision-rejecting').check()
    cy.getByTestid('caseDecisionSection').should('not.exist')
    cy.get('#case-decision-accepting-partially').check()
    cy.getByTestid('caseDecisionSection').should('exist')
  })

  it('should have a disabled isolationTo datepicker if isolation is not one of the custody restrictions and not if it is', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      custodyRestrictions: [CaseCustodyRestrictions.VISITAION],
    }

    intercept(caseDataAddition)

    cy.get('#isolationToDate').should('have.attr', 'disabled')
    cy.getByTestid('checkbox').children('div').children('input').check()
    cy.get('#isolationToDate').should('not.have.attr', 'disabled')
  })
})
