import faker from 'faker'

import {
  investigationCaseAccusedAddress,
  investigationCaseAccusedName,
  makeInvestigationCase,
} from '@island.is/judicial-system/formatters'
import { Case } from '@island.is/judicial-system/types'

import { intercept } from '../../../utils'

describe('/krafa/rannsoknarheimild/stadfesta/:id', () => {
  const demands = faker.lorem.paragraph()

  beforeEach(() => {
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      demands,
    }

    cy.stubAPIResponses()
    cy.visit('/krafa/rannsoknarheimild/stadfesta/test_id')

    intercept(caseDataAddition)
  })

  it('should display information about the case', () => {
    cy.contains(demands)
    cy.contains(
      `${investigationCaseAccusedName}, kt. 000000-0000, ${investigationCaseAccusedAddress}`,
    )
  })

  // it('should require a valid case facts value', () => {
  //   cy.getByTestid('caseFacts').click().blur()
  //   cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
  //   cy.getByTestid('caseFacts').type(faker.lorem.words(5))
  //   cy.getByTestid('inputErrorMessage').should('not.exist')
  // })

  // it('should require a valid legal arguments value', () => {
  //   cy.getByTestid('legalArguments').click().blur()
  //   cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
  //   cy.getByTestid('legalArguments').type(faker.lorem.words(5))
  //   cy.getByTestid('inputErrorMessage').should('not.exist')
  // })

  // it('should autofill prosecutor-only-session-request when request-prosecutor-only-session is checked', () => {
  //   cy.get('[name=prosecutor-only-session-request]').should('be.empty')
  //   cy.get('[name=request-prosecutor-only-session]').check()
  //   cy.get('[name=prosecutor-only-session-request]').should('not.be.empty')
  // })

  // it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
  //   cy.getByTestid('caseFacts').type(faker.lorem.words(5))
  //   cy.getByTestid('legalArguments').type(faker.lorem.words(5))
  //   cy.getByTestid('continueButton').click()
  //   cy.url().should('include', '/krafa/rannsoknarheimild/rannsoknargogn')
  // })
})
