import { MAX_COMPLETED_VERDICT_APPEALS } from '@island.is/judicial-system/types'
import type {
  CaseTableCell,
  CaseTableRow,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { CaseActionType } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  formatCaseCountDative,
  formatCaseNumberList,
  getAppealCaseIds,
  getCellDisplayText,
  getCellText,
  getColumnWidth,
  getFutureRulingDateWarning,
  getMoveAnnouncement,
  getRowActionLabel,
  getRowCaseNumber,
  getRowId,
  getRowLabel,
  getRowsWithFutureRulingDate,
  getRulingDate,
  getStageRefusal,
  getStageRefusalMessage,
  partitionRows,
  RULING_DATE_COLUMN_INDEX,
  stageCase,
  unstageCase,
} from './BulkCompleteCases.logic'

const row = (caseId: string, cells: CaseTableCell[]): CaseTableRow => ({
  caseId,
  cells,
  actionOnRowClick: CaseActionType.OPEN_APPEAL_CASE,
  contextMenuActions: [],
  isMyCase: false,
})

const caseRow = (caseId: string, caseNumber: string) =>
  row(caseId, [
    {
      sortValue: `sort-${caseNumber}`,
      value: { __typename: 'StringValue', str: caseNumber },
    },
    {
      sortValue: 'jon jonsson',
      value: { __typename: 'StringValue', str: 'Jón Jónsson' },
    },
  ])

const rows = [
  caseRow('a', 'S-1/2026'),
  caseRow('b', 'S-2/2026'),
  caseRow('c', 'S-3/2026'),
]

const appealRow = (caseId: string, appealCaseId: string): CaseTableRow => ({
  ...caseRow(caseId, 'S-9/2026'),
  appealCaseId,
})

describe('getRowId', () => {
  it('is the appeal case id when the row has one', () => {
    expect(getRowId(appealRow('a', 'a-appeal'))).toBe('a-appeal')
  })

  it('is the case id when the row has no appeal case', () => {
    expect(getRowId(caseRow('a', 'S-1/2026'))).toBe('a')
  })
})

describe('stageCase', () => {
  const appealRows = [appealRow('a', 'a'), appealRow('b', 'b')]

  it('adds a case to the end', () => {
    expect(stageCase(['b'], appealRows, 'a')).toEqual(['b', 'a'])
  })

  it('does not stage a case twice', () => {
    const staged = ['a']

    expect(stageCase(staged, appealRows, 'a')).toBe(staged)
  })

  it('ignores a case that is not among the rows', () => {
    const staged = ['a']

    expect(stageCase(staged, appealRows, 'unknown')).toBe(staged)
  })

  // Appeals are completed by their appeal case id.
  it('does not stage a row without an appeal case', () => {
    const staged: string[] = []

    expect(stageCase(staged, rows, 'a')).toBe(staged)
  })

  it('stages no more than the most that can be completed at once', () => {
    const manyRows = Array.from(
      { length: MAX_COMPLETED_VERDICT_APPEALS + 1 },
      (_, i) => appealRow(`case-${i}`, `appeal-${i}`),
    )
    const full = manyRows
      .slice(0, MAX_COMPLETED_VERDICT_APPEALS)
      .map((r) => getRowId(r))
    const lastId = getRowId(manyRows[MAX_COMPLETED_VERDICT_APPEALS])

    expect(stageCase(full.slice(1), manyRows, full[0])).toHaveLength(
      MAX_COMPLETED_VERDICT_APPEALS,
    )
    expect(stageCase(full, manyRows, lastId)).toBe(full)
  })
})

describe('getStageRefusal', () => {
  it('refuses a row without an appeal case', () => {
    expect(getStageRefusal([], rows, 'a')).toBe('noAppealCase')
  })

  it('refuses a row once the most that can be completed are staged', () => {
    const staged = Array.from(
      { length: MAX_COMPLETED_VERDICT_APPEALS },
      (_, i) => `appeal-${i}`,
    )

    expect(
      getStageRefusal(staged, [appealRow('x', 'x-appeal')], 'x-appeal'),
    ).toBe('limitReached')
    expect(
      getStageRefusal(
        staged.slice(1),
        [appealRow('x', 'x-appeal')],
        'x-appeal',
      ),
    ).toBeUndefined()
  })

  it('refuses nothing that staging would leave alone anyway', () => {
    expect(getStageRefusal([], rows, 'unknown')).toBeUndefined()
    expect(getStageRefusal(['a'], rows, 'a')).toBeUndefined()
  })

  it('says how many can be completed at once', () => {
    expect(getStageRefusalMessage('limitReached')).toBe(
      `Hægt er að ljúka að hámarki ${MAX_COMPLETED_VERDICT_APPEALS} málum í einu.`,
    )
  })
})

describe('getAppealCaseIds', () => {
  it('takes the appeal case ids, not the case ids', () => {
    expect(
      getAppealCaseIds([
        appealRow('a', 'a-appeal'),
        appealRow('b', 'b-appeal'),
      ]),
    ).toEqual(['a-appeal', 'b-appeal'])
  })

  it('leaves out a row without an appeal case', () => {
    expect(getAppealCaseIds([caseRow('a', 'S-1/2026')])).toEqual([])
  })
})

describe('ruling date', () => {
  const now = new Date()
  const hoursFromNow = (hours: number) =>
    new Date(now.getTime() + hours * 60 * 60 * 1000)

  const rulingDateRow = (
    caseNumber: string,
    sortValue: string | undefined,
    lines: string[] = ['1.1.2026'],
  ): CaseTableRow => {
    const cells: CaseTableCell[] = [
      {
        sortValue: `sort-${caseNumber}`,
        value: { __typename: 'StringValue', str: caseNumber },
      },
      { sortValue: 'jon', value: { __typename: 'StringValue', str: 'Jón' } },
      { sortValue: 'tegund', value: { __typename: 'StringValue', str: 'Rán' } },
      {
        sortValue,
        value: { __typename: 'StringGroupValue', strList: lines },
      },
    ]

    return { ...row(caseNumber, cells), appealCaseId: `${caseNumber}-appeal` }
  }

  it('is read from the fourth column', () => {
    expect(RULING_DATE_COLUMN_INDEX).toBe(3)
  })

  it('reads the date-time of the ruling date cell', () => {
    const rulingDate = hoursFromNow(5)

    expect(
      getRulingDate(rulingDateRow('S-1/2026', rulingDate.toISOString())),
    ).toEqual(rulingDate)
  })

  it('reads no date from a value that is not a date-time', () => {
    expect(getRulingDate(rulingDateRow('S-1/2026', 'tomorrow'))).toBeUndefined()
    expect(getRulingDate(rulingDateRow('S-1/2026', '2026'))).toBeUndefined()
    expect(
      getRulingDate(rulingDateRow('S-1/2026', '2026-13-45T99:99:00.000Z')),
    ).toBeUndefined()
    expect(getRulingDate(rulingDateRow('S-1/2026', undefined))).toBeUndefined()
    expect(getRulingDate(caseRow('a', 'S-1/2026'))).toBeUndefined()
  })

  it('finds the rows whose ruling is later than now', () => {
    const future = rulingDateRow('S-1/2026', hoursFromNow(2).toISOString())
    const past = rulingDateRow('S-2/2026', hoursFromNow(-2).toISOString())
    const exactlyNow = rulingDateRow('S-3/2026', now.toISOString())
    const unparseable = rulingDateRow('S-4/2026', 'not a date')

    expect(
      getRowsWithFutureRulingDate([future, past, exactlyNow, unparseable], now),
    ).toEqual([future])
  })

  it('names each such case with its date and time as the row shows them', () => {
    const stagedRows = [
      rulingDateRow('S-1/2026', hoursFromNow(2).toISOString(), [
        '3.11.2026',
        'kl. 14:05',
      ]),
      rulingDateRow('S-2/2026', hoursFromNow(-2).toISOString(), ['1.1.2026']),
      rulingDateRow('S-3/2026', hoursFromNow(48).toISOString(), ['5.11.2026']),
    ]

    expect(getFutureRulingDateWarning(stagedRows, now)).toBe(
      'Dómsuppkvaðning er ekki hafin í eftirfarandi málum: S-1/2026 (3.11.2026 kl. 14:05), S-3/2026 (5.11.2026)',
    )
  })

  it('gives no warning when every ruling has come', () => {
    expect(
      getFutureRulingDateWarning(
        [rulingDateRow('S-1/2026', hoursFromNow(-1).toISOString())],
        now,
      ),
    ).toBeUndefined()
  })
})

describe('getCellDisplayText', () => {
  it('joins the lines of a string group', () => {
    expect(
      getCellDisplayText({
        value: {
          __typename: 'StringGroupValue',
          strList: ['3.11.2026', '', 'kl. 14:05'],
        },
      }),
    ).toBe('3.11.2026 kl. 14:05')
  })

  it('reads a string value', () => {
    expect(
      getCellDisplayText({ value: { __typename: 'StringValue', str: 'S-1' } }),
    ).toBe('S-1')
  })

  it('is empty for a cell without text', () => {
    expect(getCellDisplayText(undefined)).toBe('')
  })
})

describe('rows of one case', () => {
  const first = appealRow('a', 'a-appeal-1')
  const second = appealRow('a', 'a-appeal-2')
  const sameCaseRows = [first, second]

  it('stages and partitions each appeal on its own', () => {
    const stagedIds = stageCase([], sameCaseRows, getRowId(second))
    const { staged, source } = partitionRows(sameCaseRows, stagedIds)

    expect(staged).toEqual([second])
    expect(source).toEqual([first])
  })

  it('unstages only the appeal that is unstaged', () => {
    const stagedIds = unstageCase(['a-appeal-1', 'a-appeal-2'], 'a-appeal-1')

    expect(partitionRows(sameCaseRows, stagedIds).staged).toEqual([second])
  })
})

describe('unstageCase', () => {
  it('removes the case and keeps the order of the rest', () => {
    expect(unstageCase(['c', 'a', 'b'], 'a')).toEqual(['c', 'b'])
  })

  it('leaves the ids alone when the case is not staged', () => {
    expect(unstageCase(['a'], 'b')).toEqual(['a'])
  })
})

describe('partitionRows', () => {
  it('returns the staged rows in staged order and the rest in original order', () => {
    const { staged, source } = partitionRows(rows, ['c', 'a'])

    expect(staged.map((r) => r.caseId)).toEqual(['c', 'a'])
    expect(source.map((r) => r.caseId)).toEqual(['b'])
  })

  it('puts every row in the source when nothing is staged', () => {
    const { staged, source } = partitionRows(rows, [])

    expect(staged).toEqual([])
    expect(source.map((r) => r.caseId)).toEqual(['a', 'b', 'c'])
  })

  it('skips a staged id that is no longer among the rows', () => {
    const { staged, source } = partitionRows(rows, ['gone', 'b'])

    expect(staged.map((r) => r.caseId)).toEqual(['b'])
    expect(source.map((r) => r.caseId)).toEqual(['a', 'c'])
  })
})

describe('getRowCaseNumber', () => {
  it('reads a string value', () => {
    expect(getRowCaseNumber(caseRow('a', 'S-1/2026'))).toBe('S-1/2026')
  })

  it('reads the first non-empty string of a string group', () => {
    expect(
      getRowCaseNumber(
        row('a', [
          {
            value: {
              __typename: 'StringGroupValue',
              strList: ['', 'S-4/2026', 'R-5/2026'],
            },
          },
        ]),
      ),
    ).toBe('S-4/2026')
  })

  it('is empty when the first cell has no value', () => {
    expect(getRowCaseNumber(row('a', [{ sortValue: 'x' }]))).toBe('')
  })

  it('is empty when the row has no cells', () => {
    expect(getRowCaseNumber(row('a', []))).toBe('')
  })
})

describe('getCellText', () => {
  it('reads a string value', () => {
    expect(
      getCellText({ value: { __typename: 'StringValue', str: 'Jón Jónsson' } }),
    ).toBe('Jón Jónsson')
  })

  it('is empty for a tag', () => {
    expect(
      getCellText({
        sortValue: 'Dómur staðfestur',
        value: { __typename: 'TagValue', color: 'mint', text: 'Staðfest' },
      }),
    ).toBe('')
  })

  it('is empty when there is no cell', () => {
    expect(getCellText(undefined)).toBe('')
  })
})

describe('formatCaseCountDative', () => {
  it.each([
    [1, '1 máli'],
    [2, '2 málum'],
    [11, '11 málum'],
    [21, '21 máli'],
    [101, '101 máli'],
    [111, '111 málum'],
  ])('declines %i', (count, expected) => {
    expect(formatCaseCountDative(count)).toBe(expected)
  })
})

describe('formatCaseNumberList', () => {
  it('names one case', () => {
    expect(formatCaseNumberList([rows[0]])).toBe('S-1/2026')
  })

  it('joins two cases with og', () => {
    expect(formatCaseNumberList([rows[0], rows[1]])).toBe(
      'S-1/2026 og S-2/2026',
    )
  })

  it('separates three cases with commas and og', () => {
    expect(formatCaseNumberList(rows)).toBe('S-1/2026, S-2/2026 og S-3/2026')
  })

  it('leaves out a row with no case number', () => {
    expect(formatCaseNumberList([rows[0], row('x', [])])).toBe('S-1/2026')
  })
})

describe('getRowLabel', () => {
  it('joins the text the first two cells show, not their sort values', () => {
    expect(getRowLabel(caseRow('a', 'S-1/2026'))).toBe('S-1/2026, Jón Jónsson')
  })

  it('reads the first non-empty string of a string group', () => {
    expect(
      getRowLabel(
        row('a', [
          {
            sortValue: '000004-2026',
            value: {
              __typename: 'StringGroupValue',
              strList: ['', '4/2026', 'S-4/2026'],
            },
          },
          {
            sortValue: 'jon jonsson',
            value: { __typename: 'StringValue', str: 'Jón Jónsson' },
          },
        ]),
      ),
    ).toBe('4/2026, Jón Jónsson')
  })

  it('skips cells that show no string', () => {
    expect(
      getRowLabel(
        row('a', [
          { sortValue: 'no-value' },
          {
            sortValue: 'Dómur staðfestur',
            value: { __typename: 'TagValue', color: 'mint', text: 'Staðfest' },
          },
          {
            sortValue: 'sort-S-1/2026',
            value: { __typename: 'StringValue', str: 'S-1/2026' },
          },
          {
            sortValue: 'jon jonsson',
            value: { __typename: 'StringValue', str: 'Jón Jónsson' },
          },
          {
            sortValue: 'afryjun',
            value: { __typename: 'StringValue', str: 'Áfrýjun' },
          },
        ]),
      ),
    ).toBe('S-1/2026, Jón Jónsson')
  })
})

describe('getRowActionLabel', () => {
  it.each([
    ['stage' as const, 'Velja mál S-1/2026 til að ljúka'],
    ['unstage' as const, 'Taka mál S-1/2026 af lista'],
    ['open' as const, 'Opna mál S-1/2026'],
  ])('describes the %s action', (action, expected) => {
    expect(getRowActionLabel(action, 'S-1/2026')).toBe(expected)
  })

  it('reads without a label', () => {
    expect(getRowActionLabel('stage', '')).toBe('Velja mál til að ljúka')
  })
})

describe('getMoveAnnouncement', () => {
  it('announces a staged case', () => {
    expect(getMoveAnnouncement('stage', 'S-1/2026, Jón Jónsson')).toBe(
      'Mál S-1/2026, Jón Jónsson valið til að ljúka',
    )
  })

  it('announces an unstaged case', () => {
    expect(getMoveAnnouncement('unstage', 'S-1/2026, Jón Jónsson')).toBe(
      'Mál S-1/2026, Jón Jónsson tekið af lista',
    )
  })
})

describe('getColumnWidth', () => {
  it('gives the six columns their share of the design width', () => {
    expect([0, 1, 2, 3, 4, 5].map((i) => getColumnWidth(i, 6))).toEqual([
      '14.14%',
      '17.11%',
      '14.88%',
      '17.11%',
      '16.37%',
      '15.63%',
    ])
  })

  it('gives no width past the sixth column', () => {
    expect(getColumnWidth(6, 6)).toBeUndefined()
  })

  it('gives no width when the table has another number of columns', () => {
    expect(getColumnWidth(0, 5)).toBeUndefined()
    expect(getColumnWidth(0, 7)).toBeUndefined()
  })
})
