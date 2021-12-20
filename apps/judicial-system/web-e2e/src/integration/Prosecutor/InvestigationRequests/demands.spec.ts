import faker from 'faker'

import { makeCustodyCase } from '@island.is/judicial-system/formatters'

import { intercept } from '../../../utils'

describe('/krafa/rannsoknarheimild/domkrofur-og-lagaakvaedi/:id', () => {
  beforeEach(() => {
    const caseData = makeCustodyCase()

    cy.stubAPIResponses()
    cy.visit('/krafa/rannsoknarheimild/domkrofur-og-lagaakvaedi/test_id')

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
    cy.url().should('include', '/krafa/rannsoknarheimild/greinargerd/test_id')
  })
})
