import type {
  CaseTableCell,
  CaseTableRow,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { CaseActionType } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  formatCaseCountDative,
  formatCaseNumberList,
  getRowActionLabel,
  getRowCaseNumber,
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
      sortValue: caseNumber,
      value: { __typename: 'StringValue', str: caseNumber },
    },
    {
      sortValue: 'Jón Jónsson',
      value: { __typename: 'StringValue', str: 'Jón Jónsson' },
    },
  ])

const rows = [
  caseRow('a', 'S-1/2026'),
  caseRow('b', 'S-2/2026'),
  caseRow('c', 'S-3/2026'),
]

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

describe('formatCaseCountDative', () => {
  it('is singular for one case', () => {
    expect(formatCaseCountDative(1)).toBe('1 máli')
  })

  it('is plural for more than one case', () => {
    expect(formatCaseCountDative(2)).toBe('2 málum')
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
  it('joins the first two sort values', () => {
    expect(getRowLabel(caseRow('a', 'S-1/2026'))).toBe('S-1/2026, Jón Jónsson')
  })

  it('skips cells with no sort value', () => {
    expect(
      getRowLabel(
        row('a', [
          {},
          { sortValue: 'S-1/2026' },
          { sortValue: 'Jón Jónsson' },
          { sortValue: 'Áfrýjun' },
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
