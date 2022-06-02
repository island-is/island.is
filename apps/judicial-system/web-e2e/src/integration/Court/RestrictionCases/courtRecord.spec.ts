import faker from 'faker'

import { Case, CaseDecision, CaseType } from '@island.is/judicial-system/types'
import {
  CONFIRMATION_ROUTE,
  COURT_RECORD_ROUTE,
} from '@island.is/judicial-system/consts'

import { makeRestrictionCase, makeProsecutor, intercept } from '../../../utils'

describe(`${COURT_RECORD_ROUTE}/:id`, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
  })

  it('should autofill court attendees', () => {
    const caseData = makeRestrictionCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      decision: CaseDecision.ACCEPTING,
    }

    cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('courtAttendees').contains(
      'Áki Ákærandi aðstoðarsaksóknari Donald Duck kærði',
    )
  })

  it('should autofill sessionBookings in custody cases', () => {
    const caseData = makeRestrictionCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      decision: CaseDecision.ACCEPTING,
    }

    cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('sessionBookings').should('not.match', ':empty')
  })

  it('should autofill endOfSessionBookings in accepted custody cases', () => {
    const caseData = makeRestrictionCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      decision: CaseDecision.ACCEPTING,
    }

    cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('endOfSessionBookings').should('not.match', ':empty')
  })

  it('should autofill sessionBookings in travel ban cases', () => {
    const caseData = makeRestrictionCase()

    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.TRAVEL_BAN,
      prosecutor: makeProsecutor(),
      decision: CaseDecision.ACCEPTING,
    }

    cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('sessionBookings').should('not.match', ':empty')
  })

  it('should autofill endOfSessionBookings with requestedOtherRestrictions in accepted travel ban cases', () => {
    const caseData = makeRestrictionCase()

    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.TRAVEL_BAN,
      prosecutor: makeProsecutor(),
      decision: CaseDecision.ACCEPTING,
      requestedOtherRestrictions: 'other restrictions',
    }

    cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('endOfSessionBookings').contains('other restrictions')
  })

  it('should require a accused and prosecutor appeal decisions to be made', () => {
    const caseData = makeRestrictionCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      decision: CaseDecision.ACCEPTING,
      courtDate: '2020-09-16T19:50:08.033Z',
      conclusion: faker.lorem.words(5),
      ruling: faker.lorem.words(5),
    }

    cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('courtLocation').type('í Dúfnahólum 10')
    cy.getByTestid('sessionBookings').type('lorem')
    cy.get('#prosecutor-appeal').check()
    cy.get('#accused-appeal').check()
    cy.getByTestid('courtEndTime').type('11:00')
    cy.getByTestid('continueButton').should('not.be.disabled')
  })

  it('should not allow users to continue if conclusion is not set', () => {
    const caseData = makeRestrictionCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      courtDate: '2021-12-16T10:50:04.033Z',
      decision: CaseDecision.ACCEPTING,
      conclusion: undefined,
    }

    cy.stubAPIResponses()
    cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('formFooter')
      .children()
      .getByTestid('infobox')
      .should('exist')
  })

  it('should not allow users to continue if decision is not set', () => {
    const caseData = makeRestrictionCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      courtDate: '2021-12-16T10:50:04.033Z',
      conclusion: faker.lorem.words(5),
      decision: undefined,
    }

    cy.stubAPIResponses()
    cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('formFooter')
      .children()
      .getByTestid('infobox')
      .should('exist')
  })

  it('should not allow users to continue if ruling is not set', () => {
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      courtDate: '2021-12-16T10:50:04.033Z',
      conclusion: faker.lorem.words(5),
      decision: CaseDecision.ACCEPTING,
      ruling: undefined,
    }

    cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)
    intercept(caseDataAddition)

    cy.getByTestid('formFooter')
      .children()
      .getByTestid('infobox')
      .should('exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeRestrictionCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      decision: CaseDecision.ACCEPTING,
      courtDate: '2020-09-16T19:50:08.033Z',
      conclusion: faker.lorem.words(5),
      ruling: faker.lorem.words(5),
    }

    cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('courtLocation').type('í Dúfnahólum 10')
    cy.getByTestid('sessionBookings').type('lorem')
    cy.get('#prosecutor-appeal').check()
    cy.get('#accused-appeal').check()
    cy.getByTestid('courtEndTime').type('11:00')
    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', `${CONFIRMATION_ROUTE}/test_id_stadfest`)
  })
})
