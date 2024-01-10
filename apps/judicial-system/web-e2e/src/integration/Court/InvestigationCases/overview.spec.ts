import faker from 'faker'

import {
  Case,
  CaseState,
  CaseType,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
  INVESTIGATION_CASE_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'

import {
  mockCase,
  makeProsecutor,
  makeCaseFile,
  intercept,
  mockName,
  mockAddress,
} from '../../../utils'

describe(`${INVESTIGATION_CASE_OVERVIEW_ROUTE}/:id`, () => {
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
    cy.login(UserRole.DISTRICT_COURT_JUDGE)
    const caseData = mockCase(CaseType.INTERNET_USAGE)
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
      sessionArrangements: SessionArrangements.ALL_PRESENT,
      caseFiles: [{ ...makeCaseFile(), category: undefined }],
      openedByDefender: '2020-09-20T19:50:08.033Z',
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit('/domur/rannsoknarheimild/yfirlit/test_id')
  })

  it('should let the user know if the assigned defender has viewed the case', () => {
    cy.getByTestid('alertMessageOpenedByDefender').should('not.match', ':empty')
  })

  it('should display information about the case in an info card', () => {
    cy.getByTestid('infoCard').contains(
      `${mockName}, kt. 000000-0000, ${mockAddress}`,
    )
    cy.getByTestid('infoCard').contains('Verjandi')
    cy.getByTestid('infoCard').contains(
      `${defenderName}, ${defenderEmail}, s. ${defenderPhoneNumber}`,
    )
    cy.getByTestid('infoCard').contains('007-2021-202000') // Police case number
    cy.getByTestid('infoCard').contains('Lögreglan á Höfuðborgarsvæðinu') // Institution
    cy.getByTestid('infoCard').contains(
      'Sunnud. 20. september 2020 eftir kl. 19:50',
    ) // Requested court date
    cy.getByTestid('infoCard').contains('Áki Ákærandi') // Prosecutor
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

  it('should include button to draft conclusion in modal', () => {
    cy.getByTestid('draftConclusionButton').click()
    cy.getByTestid('modal')
      .getByTestid('ruling')
      .contains('héraðsdómari kveður upp úrskurð þennan.')
  })

  it('should upload files to court', () => {
    cy.get('button[aria-controls="caseFilesAccordionItem"]').click()
    cy.getByTestid('upload-to-court-button').click()

    cy.wait('@UploadFileToCourtMutation')

    cy.getByTestid('upload-state-message').should('be.visible')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('continueButton').click()
    cy.url().should(
      'include',
      INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
    )
  })
})
