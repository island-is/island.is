import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'
import {
  makeCustodyCase,
  makeCourt,
} from '@island.is/judicial-system/formatters'
import * as faker from 'faker'
import { intercept } from '../../../utils'

describe('/domur/krafa/fyrirtokutimi/:id', () => {
  beforeEach(() => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    cy.stubAPIResponses()

    intercept(caseDataAddition)
  })

  it('should display case comments', () => {
    const caseData = makeCustodyCase()
    const comment = faker.lorem.sentence(1)
    const caseDataAddition: Case = {
      ...caseData,
      comments: comment,
    }

    cy.visit('/domur/fyrirtokutimi/test_id_stadfest')
    intercept(caseDataAddition)

    cy.contains(comment)
  })

  it('should allow users to choose if they send COURT_DATE notification', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    cy.visit('/domur/fyrirtokutimi/test_id_stadfest')
    intercept(caseDataAddition)

    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()
    cy.getByTestid('select-registrar').click()
    cy.get('#react-select-registrar-option-0').click()
    cy.getByTestid('courtroom').type('1337')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modal').should('be.visible')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    cy.visit('/domur/fyrirtokutimi/test_id_stadfest')
    intercept(caseDataAddition)

    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()
    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('include', '/domur/thingbok/test_id_stadfest')
  })
})
