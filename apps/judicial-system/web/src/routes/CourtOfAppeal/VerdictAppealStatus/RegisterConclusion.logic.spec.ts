import {
  AppealCaseRulingDecision,
  AppealRulingType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  appealRulingDecisionOptions,
  getAppealRulingTypeWording,
} from './RegisterConclusion.logic'

describe('appealRulingDecisionOptions', () => {
  it('offers every outcome a ruling appeal can end in', () => {
    expect(
      appealRulingDecisionOptions.map((option) => option.decision).sort(),
    ).toEqual(Object.values(AppealCaseRulingDecision).sort())
  })
})

describe('getAppealRulingTypeWording', () => {
  it('words a verdict', () => {
    expect(getAppealRulingTypeWording(AppealRulingType.VERDICT)).toEqual({
      conclusion: 'Dómsorð',
      conclusionPlaceholder: 'Hvert er dómsorð Landsréttar?',
      courtConclusion: 'Dómsorð Landsréttar',
      document: 'Dómur Landsréttar',
    })
  })

  it('words a ruling', () => {
    expect(getAppealRulingTypeWording(AppealRulingType.RULING)).toEqual({
      conclusion: 'Úrskurðarorð',
      conclusionPlaceholder: 'Hvert er úrskurðarorð Landsréttar?',
      courtConclusion: 'Úrskurðarorð Landsréttar',
      document: 'Úrskurður Landsréttar',
    })
  })

  // What the form shows before the court has picked an outcome.
  it.each([null, undefined])('words %s as a verdict', (appealRulingType) => {
    expect(getAppealRulingTypeWording(appealRulingType)).toEqual(
      getAppealRulingTypeWording(AppealRulingType.VERDICT),
    )
  })
})
