import {
  IC_HEARING_ARRANGEMENTS_ROUTE,
  IC_POLICE_DEMANDS_ROUTE,
} from '@island.is/judicial-system/consts'

import {
  makeCourt,
  makeInvestigationCase,
  makeProsecutor,
  intercept,
  Operation,
} from '../../../utils'

describe(`${IC_HEARING_ARRANGEMENTS_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = makeInvestigationCase()
    const caseDataAddition = {
      ...caseData,
      prosecutor: makeProsecutor(),
      court: makeCourt(),
    }

    cy.setCookie('judicial-system.csrf', 'test')
    cy.stubAPIResponses()
    cy.visit(`${IC_HEARING_ARRANGEMENTS_ROUTE}/test_id`)

    intercept(caseDataAddition)
  })

  it('should require a valid requested court date time', () => {
    cy.getByTestid('datepicker').last().click()
    cy.getByTestid('datepickerIncreaseMonth').dblclick()
    cy.contains('15').click()
    cy.getByTestid('reqCourtDate-time').type('13:').blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 12:34 eða 1:23')
    cy.getByTestid('reqCourtDate-time').clear().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('reqCourtDate-time').clear().type('1333')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should have a info bubble that explains the what the requested court date means', () => {
    cy.getByTestid('requested-court-date-tooltip').trigger('mouseover')
    cy.contains(
      'Dómstóll hefur þennan tíma til hliðsjónar þegar fyrirtökutíma er úthlutað og mun leitast við að taka málið fyrir í tæka tíð en ekki fyrir þennan tíma.',
    )
  })

  it('should have a info bubble that explains the what setting a prosecutor does', () => {
    cy.getByTestid('prosecutor-tooltip').trigger('mouseover')
    cy.contains(
      'Sá ákærandi sem valinn er hér er skráður fyrir kröfunni í öllum upplýsingaskeytum og skjölum sem tengjast kröfunni, og flytur málið fyrir dómstólum fyrir hönd síns embættis.',
    )
  })

  it('should set the default court as Héraðsdómur Reykjavíkur when a case is created', () => {
    cy.getByTestid('select-court').contains('Héraðsdómur Reykjavíkur')
  })

  it('should show an error message if sending a notification failed', () => {
    const caseData = makeInvestigationCase()
    const caseDataAddition = {
      ...caseData,
      prosecutor: makeProsecutor(),
      court: makeCourt(),
    }
    const forceFail = Operation.SendNotificationMutation

    intercept(caseDataAddition, forceFail)

    cy.getByTestid('datepicker').type('01.01.2020')
    cy.getByTestid('datepickerIncreaseMonth').dblclick()
    cy.contains('15').click()
    cy.getByTestid('reqCourtDate-time').clear().type('1333')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalPrimaryButton').click()
    cy.getByTestid('modalErrorMessage').should('exist')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('datepicker').type('01.01.2020')
    cy.getByTestid('datepickerIncreaseMonth').dblclick()
    cy.contains('15').click()
    cy.getByTestid('reqCourtDate-time').clear().type('1333')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('include', IC_POLICE_DEMANDS_ROUTE)
  })
})
