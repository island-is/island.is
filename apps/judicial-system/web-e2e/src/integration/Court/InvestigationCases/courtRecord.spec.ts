import faker from 'faker'

import { Case } from '@island.is/judicial-system/types'
import {
  makeInvestigationCase,
  makeProsecutor,
} from '@island.is/judicial-system/formatters'
import {
  IC_COURT_RECORD_ROUTE,
  IC_RULING_STEP_ONE_ROUTE,
} from '@island.is/judicial-system/consts'

import { intercept } from '../../../utils'

describe(`${IC_COURT_RECORD_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = makeInvestigationCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      courtDate: '2021-12-16T10:50:04.033Z',
    }

    cy.stubAPIResponses()
    cy.visit(`${IC_COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)
  })

  it('should autofill court attendees', () => {
    cy.getByTestid('courtAttendees').should('not.be.empty')
  })

  it.skip('should require a valid court location', () => {
    cy.clock()
    cy.tick(1000)
    cy.getByTestid('courtLocation').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('courtLocation').type(faker.lorem.word())
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it.skip('should require valid session bookings', () => {
    cy.clock()
    cy.tick(1000)
    cy.getByTestid('sessionBookings').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('sessionBookings').type(faker.lorem.words(5))
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('sessionBookings').type(faker.lorem.words(5))
    cy.getByTestid('continueButton').click()
    cy.url().should('include', IC_RULING_STEP_ONE_ROUTE)
  })
})
