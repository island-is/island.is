import type { CaseTableGroup } from '@island.is/judicial-system/types'
import { CaseTableType, Feature } from '@island.is/judicial-system/types'

import { getVisibleCaseTableGroups } from './index'

describe('getVisibleCaseTableGroups', () => {
  const rulingAppeals: CaseTableGroup = {
    title: 'Kærð sakamál',
    tables: [
      {
        type: CaseTableType.COURT_OF_APPEALS_CASES_IN_PROGRESS,
        route: 'mal-i-vinnslu',
        title: 'Mál í vinnslu',
      },
    ],
  } as CaseTableGroup

  const verdictAppeals: CaseTableGroup = {
    title: 'Áfrýjuð sakamál',
    tables: [
      {
        type: CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS,
        route: 'afryjud-mal-i-vinnslu',
        title: 'Mál í vinnslu',
      },
      {
        type: CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED,
        route: 'afryjud-afgreidd-mal',
        title: 'Afgreidd mál',
      },
    ],
  } as CaseTableGroup

  const groups = [rulingAppeals, verdictAppeals]

  it('leaves out a group whose tables are all behind a hidden feature', () => {
    expect(getVisibleCaseTableGroups(groups, []).map((g) => g.title)).toEqual([
      'Kærð sakamál',
    ])
  })

  it('offers the group once the feature is on', () => {
    const visible = getVisibleCaseTableGroups(groups, [
      Feature.INDICTMENT_APPEAL,
    ])

    expect(visible.map((g) => g.title)).toEqual([
      'Kærð sakamál',
      'Áfrýjuð sakamál',
    ])
    expect(visible[1].tables.map((t) => t.route)).toEqual([
      'afryjud-mal-i-vinnslu',
      'afryjud-afgreidd-mal',
    ])
  })

  it('leaves groups with no gated tables alone', () => {
    expect(getVisibleCaseTableGroups([rulingAppeals], [])).toEqual([
      rulingAppeals,
    ])
  })
})
