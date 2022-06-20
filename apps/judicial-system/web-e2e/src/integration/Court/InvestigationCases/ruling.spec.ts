import faker from 'faker'

import {
  IC_COURT_RECORD_ROUTE,
  IC_RULING_ROUTE,
} from '@island.is/judicial-system/consts'
import { Case } from '@island.is/judicial-system/types'

import { makeInvestigationCase, intercept } from '../../../utils'

describe(`${IC_RULING_ROUTE}/:id`, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
  })

  it('should autofill conclusion when accepting decision is chosen and clear the conclusion otherwise', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition = { ...caseData, demands: faker.lorem.sentence() }

    cy.visit(`${IC_RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.get('[name="conclusion"]').should('match', ':empty')

    cy.get('#case-decision-accepting').click()

    cy.get('[name="conclusion"]').should('not.match', ':empty')

    cy.get('#case-decision-rejecting').click()

    cy.get('[name="conclusion"]').should('match', ':empty')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }
    cy.visit(`${IC_RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)
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
    cy.url().should('include', IC_COURT_RECORD_ROUTE)
  })
})
