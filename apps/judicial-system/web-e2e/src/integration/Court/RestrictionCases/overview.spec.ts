import faker from 'faker'

import {
  Case,
  CaseLegalProvisions,
  CaseCustodyRestrictions,
  CaseState,
  SessionArrangements,
  CaseType,
} from '@island.is/judicial-system/types'
import {
  RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
  RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'

import { makeProsecutor, intercept, mockCase } from '../../../utils'

describe(`${RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/:id`, () => {
  const caseData = mockCase(CaseType.CUSTODY)
  const demands = faker.lorem.paragraph()
  const lawsBroken = faker.lorem.words(5)
  const legalBasis = faker.lorem.words(5)
  const defenderName = faker.name.findName()
  const defenderEmail = faker.internet.email()
  const defenderPhoneNumber = faker.phone.phoneNumber()

  beforeEach(() => {
    const caseDataAddition: Case = {
      ...caseData,
      creatingProsecutor: makeProsecutor(),
      prosecutor: makeProsecutor(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      arrestDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
      demands,
      lawsBroken,
      legalBasis,
      legalProvisions: [CaseLegalProvisions._95_1_A],
      requestedCustodyRestrictions: [
        CaseCustodyRestrictions.ISOLATION,
        CaseCustodyRestrictions.MEDIA,
      ],
      defenderName,
      defenderEmail,
      defenderPhoneNumber,
      sessionArrangements: SessionArrangements.ALL_PRESENT_SPOKESPERSON,
      openedByDefender: '2020-09-16T19:50:08.033Z',
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/test_id_stadfest`)
  })

  it('should let the user know if the assigned defender has viewed the case', () => {
    cy.getByTestid('alertMessageOpenedByDefender').should('not.match', ':empty')
  })

  it('should have an overview of the current case', () => {
    cy.getByTestid('infoCard').contains(
      `${caseData.defendants[0].name}, kt. ${caseData.defendants[0].nationalId}, ${caseData.defendants[0].address}`,
    )

    cy.getByTestid('infoCard').contains('Talsmaður')
    cy.getByTestid('infoCard').contains(
      `${defenderName}, ${defenderEmail}, s. ${defenderPhoneNumber}`,
    )
    cy.getByTestid('infoCardDataContainer0').contains(
      'Lögreglan á Höfuðborgarsvæðinu',
    )
    cy.getByTestid('infoCardDataContainer1').contains(
      'Miðvikud. 16. september 2020 eftir kl. 19:50',
    )
    cy.getByTestid('infoCardDataContainer2').contains('Áki Ákærandi')
    cy.getByTestid('infoCardDataContainer3').contains(
      'Miðvikud. 16. september 2020 kl. 19:50',
    )
  })

  it('should display the correct demands, laws broken, legal provisions, and requested custody restriction', () => {
    cy.contains(demands)
    cy.contains(lawsBroken)
    cy.contains('a-lið 1. mgr. 95. gr. sml.')
    cy.contains(legalBasis)
    cy.contains('E - Fjölmiðlabann')
    cy.contains('B - Einangrun')
  })

  it('should have a button to a PDF of the case', () => {
    cy.contains('button', 'Krafa - PDF')
  })

  it('should include button to draft conclusion in modal', () => {
    cy.getByTestid('draftConclusionButton').click()
    cy.getByTestid('modal')
      .getByTestid('ruling')
      .contains('héraðsdómari kveður upp úrskurð þennan.')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('continueButton').click()
    cy.url().should(
      'include',
      RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
    )
  })
})
