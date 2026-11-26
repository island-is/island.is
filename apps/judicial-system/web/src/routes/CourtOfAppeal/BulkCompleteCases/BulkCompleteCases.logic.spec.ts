import type {
  CaseTableCell,
  CaseTableRow,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { CaseActionType } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  formatCaseCountDative,
  formatCaseNumberList,
  getCellText,
  getColumnWidth,
  getMoveAnnouncement,
  getRowActionLabel,
  getRowCaseNumber,
  getRowId,
  getRowLabel,
  partitionRows,
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
  it('adds a case to the end', () => {
    expect(stageCase(['b'], rows, 'a')).toEqual(['b', 'a'])
  })

  it('does not stage a case twice', () => {
    const staged = ['a']

    expect(stageCase(staged, rows, 'a')).toBe(staged)
  })

  it('ignores a case that is not among the rows', () => {
    const staged = ['a']

    expect(stageCase(staged, rows, 'unknown')).toBe(staged)
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
