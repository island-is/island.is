import faker from 'faker'

import { Case, CaseState } from '@island.is/judicial-system/types'
import {
  investigationCaseAccusedAddress,
  investigationCaseAccusedName,
  makeInvestigationCase,
  makeProsecutor,
} from '@island.is/judicial-system/formatters'

import { intercept } from '../../../utils'

describe('/domur/krafa/:id', () => {
  const demands = faker.lorem.paragraph()
  const defenderName = faker.name.findName()
  const defenderEmail = faker.internet.email()
  const defenderPhoneNumber = faker.phone.phoneNumber()
  const lawsBroken = faker.lorem.words(5)
  const legalBasis = faker.lorem.words(5)
  const caseFacts = faker.lorem.words(5)
  const legalArguments = faker.lorem.words(5)
  const comments = faker.lorem.words(5)
  const caseFilesComments = faker.lorem.words(5)

  beforeEach(() => {
    cy.login()
    const caseData = makeInvestigationCase()
    const caseDataAddition: Case = {
      ...caseData,
      demands,
      defenderName,
      defenderEmail,
      defenderPhoneNumber,
      lawsBroken,
      legalBasis,
      caseFacts,
      legalArguments,
      comments,
      caseFilesComments,
      prosecutor: makeProsecutor(),
      creatingProsecutor: makeProsecutor(),
      requestedCourtDate: '2020-09-20T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    cy.stubAPIResponses()
    cy.visit('/domur/rannsoknarheimild/yfirlit/test_id')

    intercept(caseDataAddition)
  })

  it('should display information about the case in an info card', () => {
    cy.getByTestid('infoCard').contains(
      `${investigationCaseAccusedName}, kt. 000000-0000, ${investigationCaseAccusedAddress}`,
    )
    cy.getByTestid('infoCard').contains(
      `${defenderName}, ${defenderEmail}, s. ${defenderPhoneNumber}`,
    )
    cy.getByTestid('infoCard').contains('007-2021-202000') // Police case number
    cy.getByTestid('infoCard').contains('16.09.2020') // Created
    cy.getByTestid('infoCard').contains('Lögreglan á Höfuðborgarsvæðinu') // Institution
    cy.getByTestid('infoCard').contains(
      'Sunnud. 20. september 2020 eftir kl. 19:50',
    ) // Requested court date
    cy.getByTestid('infoCard').contains('Áki Ákærandi aðstoðarsaksóknari') // Prosecutor
    cy.getByTestid('infoCard').contains('Upplýsingar um vefnotkun') // Type
  })

  it('should display the demands, laws broken and legal basis, case facts, legal arguments, comments and case files comments', () => {
    cy.contains(demands)
    cy.contains(lawsBroken)
    cy.contains(legalBasis)
    cy.contains(caseFacts)
    cy.contains(legalArguments)
    cy.contains(comments)
    cy.contains(caseFilesComments)
  })

  it('should display a button to view request as PDF', () => {
    cy.getByTestid('requestPDFButton').should('exist')
  })

  it('should require a valid case id', () => {
    cy.getByTestid('courtCaseNumber').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('courtCaseNumber').type('R-X/2021')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('courtCaseNumber').type('R-X/2021')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/rannsoknarheimild/fyrirtaka')
  })
})
