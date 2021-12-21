import faker from 'faker'

import { makeCustodyCase } from '@island.is/judicial-system/formatters'

import { intercept } from '../../../utils'
import { Case } from '@island.is/judicial-system/types'

describe('/krafa/greinargerd/domkrofur-og-lagaakvaedi/:id', () => {
  const demands = faker.lorem.paragraph()

  beforeEach(() => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      demands,
    }

    cy.stubAPIResponses()
    cy.visit('/krafa/rannsoknarheimild/greinargerd/test_id')

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
    cy.url().should('include', '/krafa/rannsoknarheimild/rannsoknargogn')
  })
})
