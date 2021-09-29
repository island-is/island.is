import {
  Case,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system/types'
import { makeCase } from '../../fixtures/caseFactory'
import { intercept } from '../../utils'

describe('/domur/urskurdarord/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
  })

  it('should format conclusion for a rejected case', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.REJECTING,
    }

    cy.visit('/domur/urskurdarord/conclusion_rejected')

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kröfu um að kærði, Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi er hafnað.',
    )
  })

  it('should format conclusion for an accepted case without isolation', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      validToDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit('/domur/urskurdarord/conclusion_accepted_without_isolation')

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for an accepted case with isolation', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      custodyRestrictions: [CaseCustodyRestrictions.ISOLATION],
      validToDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit('/domur/urskurdarord/conclusion_accepted_with_isolation')

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23. Kærði skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.',
    )
  })

  it('should format conclusion for an accepted case with isolation and the isolation ends before the custody does', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      custodyRestrictions: [CaseCustodyRestrictions.ISOLATION],
      validToDate: '2020-12-22T11:23:00.000Z',
      isolationToDate: '2020-12-20T15:39:00.000Z',
    }

    cy.visit(
      '/domur/urskurdarord/conclusion_accepted_with_isolation_isolation_ends_before_custody',
    )

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23. Kærði skal sæta einangrun ekki lengur en til sunnudagsins 20. desember 2020, kl. 15:39.',
    )
  })

  it('should format conclusion for a case where custody is rejected, but alternative travel ban accepted', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      validToDate: '2021-01-29T13:03T13:03:03.033Z',
    }

    cy.visit(
      '/domur/urskurdarord/conclusion_rejected_with_alternative_travel_ban',
    )

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta farbanni, þó ekki lengur en til föstudagsins 29. janúar 2021, kl. 13:03.',
    )
  })

  it('should format conclusion for rejected extension', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.REJECTING,
      parentCase: { ...makeCase(), decision: CaseDecision.ACCEPTING },
    }

    cy.visit('/domur/urskurdarord/conclusion_rejected_extension')

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kröfu um að kærði, Donald Duck, kt. 000000-0000, sæti áframhaldandi gæsluvarðhaldi er hafnað.',
    )
  })

  it('should format conclusion for rejected extension when previous ruling was travel ban', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.REJECTING,
      parentCase: {
        ...makeCase(),
        decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      },
    }

    cy.visit(
      '/domur/urskurdarord/conclusion_rejected_extension_previous_decision_travel_ban',
    )

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kröfu um að kærði, Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi er hafnað.',
    )
  })

  it('should format conclusion for accepted extension', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      parentCase: {
        ...makeCase(),
        decision: CaseDecision.ACCEPTING,
      },
      validToDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit('/domur/urskurdarord/conclusion_accepted_extension')

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta áframhaldandi gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for accepted extension when previous ruling was travel ban', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
      parentCase: {
        ...makeCase(),
        decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      },
      validToDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit(
      '/domur/urskurdarord/conclusion_accepted_extension_previous_decision_travel_ban',
    )

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for rejected extension when alternative travel ban accepted', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      parentCase: {
        ...makeCase(),
        decision: CaseDecision.ACCEPTING,
      },
      validToDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit(
      '/domur/urskurdarord/conclusion_rejected_extension_accepted_alternative_travel_ban',
    )

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for rejected extension when alternative travel ban accepted and previous ruling was travel ban', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      parentCase: {
        ...makeCase(),
        decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      },
      validToDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit(
      '/domur/urskurdarord/conclusion_rejected_extension_accepted_alternative_travel_ban_previous_decision_travel_ban',
    )

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta áframhaldandi farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for a rejected travel ban', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.TRAVEL_BAN,
      decision: CaseDecision.REJECTING,
    }

    cy.visit('/domur/urskurdarord/conclusion_rejected_travel_ban')

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kröfu um að kærði, Donald Duck, kt. 000000-0000, sæti farbanni er hafnað.',
    )
  })

  it('should format conclusion for an accepted travel ban', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      type: CaseType.TRAVEL_BAN,
      decision: CaseDecision.ACCEPTING,
      validToDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit('/domur/urskurdarord/conclusion_accepted_travel_ban')

    intercept(caseDataAddition)

    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Donald Duck, kt. 000000-0000, skal sæta farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should require a accused and prosecutor appeal decisions to be made', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      courtStartDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit('/domur/urskurdarord/test_id_stadfest')

    intercept(caseDataAddition)

    cy.getByTestid('continueButton').should('be.disabled')
    cy.get('#prosecutor-appeal').check()
    cy.get('#accused-appeal').check()
    cy.getByTestid('courtEndTime').type('11:00')
    cy.getByTestid('continueButton').should('not.be.disabled')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      courtStartDate: '2020-12-22T11:23:00.000Z',
    }

    cy.visit('/domur/urskurdarord/test_id_stadfest')

    intercept(caseDataAddition)

    cy.get('#prosecutor-appeal').check()
    cy.get('#accused-appeal').check()
    cy.getByTestid('courtEndTime').type('11:00')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/stadfesta/test_id_stadfest')
  })
})
