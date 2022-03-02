import faker from 'faker'

import {
  Case,
  CaseType,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import {
  makeInvestigationCase,
  makeProsecutor,
} from '@island.is/judicial-system/formatters'
import {
  IC_COURT_RECORD_ROUTE,
  IC_RULING_ROUTE,
} from '@island.is/judicial-system/consts'

import { intercept } from '../../../utils'

describe(`${IC_COURT_RECORD_ROUTE}/:id`, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
  })

  it('should autofill court attendees', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
    }

    cy.stubAPIResponses()
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('courtAttendees').should('not.match', ':empty')
  })

  it('should autofill sessionBookings in restraining order cases', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.RESTRAINING_ORDER,
      prosecutor: makeProsecutor(),
    }

    cy.stubAPIResponses()
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('sessionBookings').should('not.match', ':empty')
  })

  it('should autofill sessionBookings in autopsy cases', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.AUTOPSY,
      prosecutor: makeProsecutor(),
    }

    cy.stubAPIResponses()
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('sessionBookings').should('not.match', ':empty')
  })

  it('should autofill sessionBookings when defendant is present in court', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
      prosecutor: makeProsecutor(),
      sessionArrangements: SessionArrangements.ALL_PRESENT,
    }

    cy.stubAPIResponses()
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('sessionBookings').should('not.match', ':empty')
  })

  it('should autofill sessionBookings when a spokesperson is present in court', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
      prosecutor: makeProsecutor(),
      sessionArrangements: SessionArrangements.ALL_PRESENT_SPOKESPERSON,
      defenderIsSpokesperson: true,
    }

    cy.stubAPIResponses()
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('sessionBookings').should('not.match', ':empty')
  })

  it('should autofill sessionBookings when a prosecutor is present in court', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
      prosecutor: makeProsecutor(),
      sessionArrangements: SessionArrangements.PROSECUTOR_PRESENT,
    }

    cy.stubAPIResponses()
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('sessionBookings').should('not.match', ':empty')
  })

  it.skip('should require a valid court location', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      courtDate: '2021-12-16T10:50:04.033Z',
    }

    cy.stubAPIResponses()
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.clock()
    cy.tick(1000)
    cy.getByTestid('courtLocation').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('courtLocation').type(faker.lorem.word())
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it.skip('should require valid session bookings', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      courtDate: '2021-12-16T10:50:04.033Z',
    }

    cy.stubAPIResponses()
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.clock()
    cy.tick(1000)
    cy.getByTestid('sessionBookings').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('sessionBookings').type(faker.lorem.words(5))
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      courtDate: '2021-12-16T10:50:04.033Z',
    }

    cy.stubAPIResponses()
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('sessionBookings').type(faker.lorem.words(5))
    cy.getByTestid('continueButton').click()
    cy.url().should('include', IC_RULING_ROUTE)
  })
})
