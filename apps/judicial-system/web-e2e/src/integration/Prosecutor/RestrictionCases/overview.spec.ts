import faker from 'faker'

import { Case, CaseState, Defendant } from '@island.is/judicial-system/types'
import { STEP_SIX_ROUTE } from '@island.is/judicial-system/consts'

import {
  makeRestrictionCase,
  makeCourt,
  makeProsecutor,
  intercept,
  Operation,
} from '../../../utils'

describe(`${STEP_SIX_ROUTE}/:id`, () => {
  const caseData = makeRestrictionCase()
  const defenderName = faker.name.findName()
  const defenderEmail = faker.internet.email()
  const defenderPhoneNumber = faker.phone.phoneNumber()

  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit(`${STEP_SIX_ROUTE}/test_id_stadfesta`)
  })

  it('should let the user know if the assigned defender has viewed the case', () => {
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      seenByDefender: '2020-09-16T19:50:08.033Z',
    }

    intercept(caseDataAddition)

    cy.getByTestid('alertMessage').should('not.match', ':empty')
  })

  it('should have a info panel about how to resend a case if the case has been received', () => {
    const caseDataAddition: Case = {
      ...caseData,
      state: CaseState.RECEIVED,
    }

    intercept(caseDataAddition)

    cy.getByTestid('rc-overview-info-panel').should('exist')
  })

  it('should have an overview of the current case', () => {
    const caseDataAddition: Case = {
      ...caseData,
      defendants: [
        {
          name: 'Donald Duck',
          address: 'Batcave 1337',
          nationalId: '000000-0000',
        } as Defendant,
      ],
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      arrestDate: '2020-09-16T19:50:08.033Z',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
      court: makeCourt(),
      creatingProsecutor: makeProsecutor(),
      prosecutor: makeProsecutor(),
      defenderName,
      defenderEmail,
      defenderPhoneNumber,
    }

    intercept(caseDataAddition)

    cy.getByTestid('infoCard').contains(
      'Donald Duck, kt. 000000-0000, Batcave 1337',
    )
    cy.getByTestid('infoCard').contains(
      `${defenderName}, ${defenderEmail}, s. ${defenderPhoneNumber}`,
    )
    cy.getByTestid('infoCardDataContainer1').contains('Héraðsdómur Reykjavíkur')
    cy.getByTestid('infoCardDataContainer2').contains(
      'Lögreglan á Höfuðborgarsvæðinu',
    )
    cy.getByTestid('infoCardDataContainer3').contains(
      'Miðvikud. 16. september 2020 eftir kl. 19:50',
    )
    cy.getByTestid('infoCardDataContainer4').contains('Áki Ákærandi')
    cy.getByTestid('infoCardDataContainer5').contains(
      'Miðvikud. 16. september 2020 kl. 19:50',
    )
    cy.getByTestid('demands').contains(
      'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    )
  })

  it('should have a button that links to a pdf of the case', () => {
    intercept(caseData)

    cy.contains('button', 'Krafa - PDF')
  })

  it.skip('should navigate to /krofur on successful confirmation', () => {
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('contain', '/krofur')

    /**
     * This is practically considered bad(ish) practice since we're not testing
     * the overview in isolation anymore. Leaving this here until a better
     * way presents itself.
     */
    cy.getByTestid('tdTag').should('contain', 'Krafa móttekin')
  })

  it('should show an error message if sending a notification failed', () => {
    const caseData = makeRestrictionCase()
    const caseDataAddition = {
      ...caseData,
      prosecutor: makeProsecutor(),
      court: makeCourt(),
    }
    const forceFail = Operation.SendNotificationMutation

    intercept(caseDataAddition, forceFail)

    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalErrorMessage').should('exist')
  })
})
