/// <reference path="../../../support/index.d.ts" />
import { Case, CaseDecision, CaseType } from '@island.is/judicial-system/types'
import {
  COURT_RECORD_ROUTE,
  RULING_ROUTE,
} from '@island.is/judicial-system/consts'

import { makeCustodyCase, intercept } from '../../../utils'

describe(`${RULING_ROUTE}/:id`, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
  })

  it('should format conclusion for a rejected case', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.REJECTING,
    }

    cy.visit(`${RULING_ROUTE}/conclusion_rejected`)

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kröfu um að kærði, Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi er hafnað.',
    )
  })

  it('should format conclusion for an accepted case without isolation', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      validToDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit(`${RULING_ROUTE}/conclusion_accepted_without_isolation`)

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for an accepted case with isolation', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      isCustodyIsolation: true,
      validToDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit(`${RULING_ROUTE}/conclusion_accepted_with_isolation`)

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23. Kærði skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.',
    )
  })

  it('should format conclusion for an accepted case with isolation and the isolation ends before the custody does', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      isCustodyIsolation: true,
      validToDate: '2020-12-22T11:23:00.000Z',
      isolationToDate: '2020-12-20T15:39:00.000Z',
    }

    cy.visit(
      `${RULING_ROUTE}/conclusion_accepted_with_isolation_isolation_ends_before_custody`,
    )

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23. Kærði skal sæta einangrun ekki lengur en til sunnudagsins 20. desember 2020, kl. 15:39.',
    )
  })

  it('should format conclusion for a case where custody is rejected, but alternative travel ban accepted', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      validToDate: '2021-01-29T13:03:03.000Z',
    }

    cy.visit(`${RULING_ROUTE}/conclusion_rejected_with_alternative_travel_ban`)

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta farbanni, þó ekki lengur en til föstudagsins 29. janúar 2021, kl. 13:03.',
    )
  })

  it('should format conclusion for rejected extension', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.REJECTING,
      parentCase: {
        ...makeCustodyCase(),
        decision: CaseDecision.ACCEPTING,
      },
    }

    cy.visit(`${RULING_ROUTE}/conclusion_rejected_extension`)

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kröfu um að kærði, Donald Duck, kt. 000000-0000, sæti áframhaldandi gæsluvarðhaldi er hafnað.',
    )
  })

  it('should format conclusion for rejected extension when previous ruling was travel ban', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.REJECTING,
      parentCase: {
        ...makeCustodyCase(),
        decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      },
    }

    cy.visit(
      `${RULING_ROUTE}/conclusion_rejected_extension_previous_decision_travel_ban`,
    )

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kröfu um að kærði, Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi er hafnað.',
    )
  })

  it('should format conclusion for accepted extension', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      parentCase: {
        ...makeCustodyCase(),
        decision: CaseDecision.ACCEPTING,
      },
      validToDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit(`${RULING_ROUTE}/conclusion_accepted_extension`)

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta áframhaldandi gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for accepted extension when previous ruling was travel ban', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      parentCase: {
        ...makeCustodyCase(),
        decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      },
      validToDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit(
      `${RULING_ROUTE}/conclusion_accepted_extension_previous_decision_travel_ban`,
    )

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for rejected extension when alternative travel ban accepted', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      parentCase: {
        ...makeCustodyCase(),
        decision: CaseDecision.ACCEPTING,
      },
      validToDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit(
      `${RULING_ROUTE}/conclusion_rejected_extension_accepted_alternative_travel_ban`,
    )

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for a rejected travel ban', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.TRAVEL_BAN,
      decision: CaseDecision.REJECTING,
    }

    cy.visit(`${RULING_ROUTE}/conclusion_rejected_travel_ban`)

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kröfu um að kærði, Donald Duck, kt. 000000-0000, sæti farbanni er hafnað.',
    )
  })

  it('should format conclusion for an accepted travel ban', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.TRAVEL_BAN,
      decision: CaseDecision.ACCEPTING,
      validToDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit(`${RULING_ROUTE}/conclusion_accepted_travel_ban`)

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should autofill prosecutor demands', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }
    cy.visit(`${RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('prosecutorDemands').contains(
      'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    )
  })

  it('should require a valid introduction', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      courtDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit(`${RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.wait('@gqlCaseQuery')
    cy.getByTestid('introduction')
      .contains('Mál þetta var tekið til úrskurðar 22. desember 2020.')
      .clear()
    cy.clickOutside()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('introduction').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should require a valid ruling', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }
    cy.visit(`${RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.wait('@gqlCaseQuery')
    cy.getByTestid('ruling')
      .contains('héraðsdómari kveður upp úrskurð þennan.')
      .clear()
    cy.clickOutside()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('ruling').type('lorem')
    cy.getByTestid('inputErrorMessage').should('not.exist')
  })

  it('should show appropriate valid to dates based on decision', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }
    cy.visit(`${RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('caseDecisionSection').should('not.exist')
    cy.get('#case-decision-accepting').check()
    cy.getByTestid('caseDecisionSection').should('exist')
    cy.get('#case-decision-rejecting').check()
    cy.getByTestid('caseDecisionSection').should('not.exist')
    cy.get('#case-decision-accepting-partially').check()
    cy.getByTestid('caseDecisionSection').should('exist')
  })

  it('should have a disabled isolationTo datepicker if isolation is nor selected and not if it is', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      isCustodyIsolation: true,
    }
    cy.visit(`${RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.get('#isolationToDate').should('not.have.attr', 'disabled')
    cy.get('[name="isCustodyIsolation"]').uncheck()
    cy.get('#isolationToDate').should('have.attr', 'disabled')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }
    cy.visit(`${RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('ruling').type('lorem')
    cy.get('#case-decision-accepting').check()
    cy.getByTestid('continueButton').click()
    cy.url().should('include', COURT_RECORD_ROUTE)
  })
})
