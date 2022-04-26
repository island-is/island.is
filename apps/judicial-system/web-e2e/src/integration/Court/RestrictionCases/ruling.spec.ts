/// <reference path="../../../support/index.d.ts" />
import { Case, CaseDecision, CaseType } from '@island.is/judicial-system/types'
import {
  COURT_RECORD_ROUTE,
  RULING_ROUTE,
} from '@island.is/judicial-system/consts'

import { makeCustodyCase, intercept } from '../../../utils'

describe(`${RULING_ROUTE}/:id`, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
  })

  it('should autofill prosecutor demands', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }
    cy.visit(`${RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('prosecutorDemands').contains(
      'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    )
  })

  it('should require a valid introduction', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      courtDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit(`${RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.wait('@gqlCaseQuery')
    cy.getByTestid('introduction')
      .contains('Mál þetta var tekið til úrskurðar 22. desember 2020.')
      .clear()
    cy.clickOutside()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('introduction').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid ruling', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }
    cy.visit(`${RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.wait('@gqlCaseQuery')
    cy.getByTestid('ruling')
      .contains('héraðsdómari kveður upp úrskurð þennan.')
      .clear()
    cy.clickOutside()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('ruling').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should show appropriate valid to dates based on decision', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }
    cy.visit(`${RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('caseDecisionSection').should('not.exist')
    cy.get('#case-decision-accepting').check()
    cy.getByTestid('caseDecisionSection').should('exist')
    cy.get('#case-decision-rejecting').check()
    cy.getByTestid('caseDecisionSection').should('not.exist')
    cy.get('#case-decision-accepting-partially').check()
    cy.getByTestid('caseDecisionSection').should('exist')
  })

  it('should have a disabled isolationTo datepicker if isolation is nor selected and not if it is', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      isCustodyIsolation: true,
    }
    cy.visit(`${RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.get('#isolationToDate').should('not.have.attr', 'disabled')
    cy.get('[name="isCustodyIsolation"]').uncheck()
    cy.get('#isolationToDate').should('have.attr', 'disabled')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }
    cy.visit(`${RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('ruling').type('lorem')
    cy.get('#case-decision-accepting').check()
    cy.getByTestid('continueButton').click()
    cy.url().should('include', COURT_RECORD_ROUTE)
  })
})
