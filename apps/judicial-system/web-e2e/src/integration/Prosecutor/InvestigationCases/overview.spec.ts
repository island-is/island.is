import faker from 'faker'

import {
  Case,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'
import { INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE } from '@island.is/judicial-system/consts'

import {
  mockCase,
  makeProsecutor,
  intercept,
  mockName,
  mockAddress,
  hasOperationName,
  Operation,
} from '../../../utils'

describe(`${INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE}/:id`, () => {
  const demands = faker.lorem.paragraph()
  const defenderName = faker.name.findName()
  const defenderEmail = faker.internet.email()
  const defenderPhoneNumber = faker.phone.phoneNumber()
  const caseData = mockCase(CaseType.INTERNET_USAGE)

  const caseDataAddition: Case = {
    ...caseData,
    defenderNationalId: '0000000000',
    defenderName,
    defenderEmail,
    defenderPhoneNumber,
    demands,
    openedByDefender: '2020-09-16T19:50:08.033Z',
    state: CaseState.SUBMITTED,
    prosecutor: makeProsecutor(),
    creatingProsecutor: makeProsecutor(),
    requestedCourtDate: '2020-09-20T19:50:08.033Z',
  }

  beforeEach(() => {
    cy.login(UserRole.PROSECUTOR)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE}/test_id`)
  })

  it('should let the user know if the assigned defender has viewed the case', () => {
    cy.getByTestid('alertMessageOpenedByDefender').should('not.match', ':empty')
  })

  it('should display information about the case in an info card', () => {
    cy.getByTestid('infoCard').contains(
      `${mockName}, kt. 000000-0000, ${mockAddress}`,
    )
    cy.getByTestid('infoCard').contains(
      `${defenderName}, ${defenderEmail}, s. ${defenderPhoneNumber}`,
    )
    cy.getByTestid('infoCard').contains('007-2021-202000') // Police case number
    cy.getByTestid('infoCard').contains('Lögreglan á Höfuðborgarsvæðinu') // Institution
    cy.getByTestid('infoCard').contains('Héraðsdómur Reykjavíkur') // Court
    cy.getByTestid('infoCard').contains(
      'Sunnud. 20. september 2020 eftir kl. 19:50',
    ) // Requested court date
    cy.getByTestid('infoCard').contains('Áki Ákærandi') // Prosecutor
    cy.getByTestid('infoCard').contains('Upplýsingar um vefnotkun') // Type
  })

  it('should display the demands', () => {
    cy.contains(demands)
  })

  it('should display a button to view request as PDF', () => {
    cy.getByTestid('requestPDFButton').should('exist')
  })

  it('should navigate to /krofur on successful confirmation', () => {
    cy.intercept('POST', '**/api/graphql', (req) => {
      if (hasOperationName(req, Operation.CaseListQuery)) {
        req.reply({
          fixture: 'cases',
        })
      }
    })

    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('contain', '/krofur')

    /**
     * This is practically considered bad(ish) practice since we're not testing
     * the overview in isolation anymore. Leaving this here until a better
     * way presents itself.
     */
    cy.getByTestid('tdTag').should('contain', 'Móttekið')
  })
})
