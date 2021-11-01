import { Case, CaseDecision } from '@island.is/judicial-system/types'
import { makeCase } from '../../fixtures/testDataFactory'
import { intercept } from '../../utils'

describe('/domur/stadfesta/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/domur/stadfesta/test_id_stadfesting')
  })

  it('should display the ruling statement', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      conclusion:
        'Kærða, Donald Duck kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til miðvikudagsins 16. september 2020, kl. 19:50.',
      ruling:
        'Samkvæmt framangreindu og rannsóknargögnum málsins og með vísan til þess sem fram kemur í greinargerð sóknaraðila er fallist á það með lögreglustjóra að varnaraðili sé undir rökstuddum grun um saknæma aðild að háttsemi sem fangelsisrefsing er lögð við. Fyrir liggur að rannsókn málsins beinist að [..] óljóst er hversu margir aðilar kunni að tengjast. Telur dómurinn að fullnægt sé skilyrðum a-liðar 1. mgr. 95. gr. laga nr. 88/2008 um meðferð sakamála til þess að varnaraðila verði gert að sæta gæsluvarðhaldi. Þá þykja ekki efni til að marka gæsluvarðhaldi skemmri tíma en krafist er. Að virtum þeim rannsóknarhagsmunum sem málið varða samkvæmt framangreindu er fallist á að nauðsynlegt sé að varnaraðili sæti einangrun á meðan á gæsluvarðhaldsvistinni stendur, skv. 2. mgr. 98. gr., sbr. b-lið 99. gr. laga nr. 88/2008. Með vísan til þessa er fallist á kröfuna eins og nánar greinir í úrskurðarorði. Kristín Gunnarsdóttir héraðsdómari kveður upp úrskurðinn.',
    }

    intercept(caseDataAddition)

    cy.contains(
      'Kærða, Donald Duck kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til miðvikudagsins 16. september 2020, kl. 19:50.',
    )
  })

  it('should display the ruling', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      conclusion:
        'Kærða, Donald Duck kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til miðvikudagsins 16. september 2020, kl. 19:50.',
      ruling:
        'Samkvæmt framangreindu og rannsóknargögnum málsins og með vísan til þess sem fram kemur í greinargerð sóknaraðila er fallist á það með lögreglustjóra að varnaraðili sé undir rökstuddum grun um saknæma aðild að háttsemi sem fangelsisrefsing er lögð við. Fyrir liggur að rannsókn málsins beinist að [..] óljóst er hversu margir aðilar kunni að tengjast. Telur dómurinn að fullnægt sé skilyrðum a-liðar 1. mgr. 95. gr. laga nr. 88/2008 um meðferð sakamála til þess að varnaraðila verði gert að sæta gæsluvarðhaldi. Þá þykja ekki efni til að marka gæsluvarðhaldi skemmri tíma en krafist er. Að virtum þeim rannsóknarhagsmunum sem málið varða samkvæmt framangreindu er fallist á að nauðsynlegt sé að varnaraðili sæti einangrun á meðan á gæsluvarðhaldsvistinni stendur, skv. 2. mgr. 98. gr., sbr. b-lið 99. gr. laga nr. 88/2008. Með vísan til þessa er fallist á kröfuna eins og nánar greinir í úrskurðarorði. Kristín Gunnarsdóttir héraðsdómari kveður upp úrskurðinn.',
    }

    intercept(caseDataAddition)

    cy.contains(
      'Samkvæmt framangreindu og rannsóknargögnum málsins og með vísan til þess sem fram kemur í greinargerð sóknaraðila er fallist á það með lögreglustjóra að varnaraðili sé undir rökstuddum grun um saknæma aðild að háttsemi sem fangelsisrefsing er lögð við. Fyrir liggur að rannsókn málsins beinist að [..] óljóst er hversu margir aðilar kunni að tengjast. Telur dómurinn að fullnægt sé skilyrðum a-liðar 1. mgr. 95. gr. laga nr. 88/2008 um meðferð sakamála til þess að varnaraðila verði gert að sæta gæsluvarðhaldi. Þá þykja ekki efni til að marka gæsluvarðhaldi skemmri tíma en krafist er. Að virtum þeim rannsóknarhagsmunum sem málið varða samkvæmt framangreindu er fallist á að nauðsynlegt sé að varnaraðili sæti einangrun á meðan á gæsluvarðhaldsvistinni stendur, skv. 2. mgr. 98. gr., sbr. b-lið 99. gr. laga nr. 88/2008. Með vísan til þessa er fallist á kröfuna eins og nánar greinir í úrskurðarorði. Kristín Gunnarsdóttir héraðsdómari kveður upp úrskurðinn.',
    )
  })

  it('should have the correct "confirm" button if decision is "ACCEPTING" in custody and travel ban cases', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING,
    }
    intercept(caseDataAddition)

    cy.getByTestid('continueButton')
      .should('have.css', 'background-color', 'rgb(0, 97, 255)') // Blue400
      .children('svg')
      .should('have.attr', 'data-testid', 'icon-checkmark')
  })

  it('should have the correct "confirm" button if decision is "REJECTING" in custody and travel ban cases', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.REJECTING,
    }
    intercept(caseDataAddition)

    cy.getByTestid('continueButton')
      .should('have.css', 'background-color', 'rgb(179, 0, 56)') // Red600
      .children('svg')
      .should('have.attr', 'data-testid', 'icon-close')
  })

  it('should have the correct "confirm" button if decision is "DISMISSING" in custody and travel ban cases', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.DISMISSING,
    }
    intercept(caseDataAddition)

    cy.getByTestid('continueButton')
      .should('have.css', 'background-color', 'rgb(179, 0, 56)') // Red600
      .children('svg')
      .should('have.attr', 'data-testid', 'icon-close')
  })

  it('should have the correct "confirm" button if decision is "ACCEPTING_ALTERNATIVE_TRAVEL_BAN" in custody and travel ban cases', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
    }
    intercept(caseDataAddition)

    cy.getByTestid('continueButton')
      .should('have.css', 'background-color', 'rgb(0, 97, 255)') // Blue400
      .children('svg')
      .should('have.attr', 'data-testid', 'icon-checkmark')
  })

  /**
   * TODO: Test confirm button for investigation cases.
   *
   * That is currently not possible since the Confirmation step
   * in investigation cases uses React Context and our version
   * of Cypress has no way of faking React Context.
   */
})
