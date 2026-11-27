import { IncludeOptions } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  captureSql,
  initCaseTableModels,
} from '../../case-table/caseTable.sqlProbe'
import { Case } from '../models/case.model'
import {
  caseInclude,
  getLimitedAccessCaseInclude,
  mergeCaseAttributes,
} from '../types/caseRepository.types'

// The node of an include graph that reads a given association
const included = (include: unknown, as: string): IncludeOptions | undefined =>
  (include as IncludeOptions[]).find((node) => node.as === as)

// The columns of the case a case is merged into, as they appear in the select
// list of the query that reads the case
const mergeCaseColumns = (sql: string): string[] => [
  ...new Set(
    [...sql.matchAll(/"mergeCase"\."(\w+)" AS "mergeCase\.\w+"/g)].map(
      (match) => match[1],
    ),
  ),
]

// The case a case is merged into is served as part of the case that points at
// it, so what is read of it is pinned here against the SQL the read builds -
// an attribute list that is dropped, or an association added under it, shows
// up as a column or a join that was not there before.
describe('CaseRepositoryService - merge case columns', () => {
  const expectedColumns = [
    'id',
    'type',
    'state',
    'court_case_number',
    'with_court_sessions',
  ]

  beforeAll(() => {
    initCaseTableModels()
  })

  describe.each([
    ['whole case graph', () => caseInclude],
    ['limited access case graph', () => getLimitedAccessCaseInclude()],
    [
      'limited access case graph of a defence user',
      () => getLimitedAccessCaseInclude('0101302989'),
    ],
  ])('%s', (_name, getInclude) => {
    let sql: string

    beforeAll(async () => {
      sql = await captureSql(() =>
        Case.findOne({ include: getInclude(), where: { id: uuid() } }),
      )
    })

    it('should read the merge case', () => {
      expect(sql).toContain('AS "mergeCase"')
    })

    it('should only select the listed columns of the merge case', () => {
      expect(mergeCaseColumns(sql).sort()).toEqual([...expectedColumns].sort())
    })

    it('should only read the parties under the merge case', () => {
      const mergeCase = included(getInclude(), 'mergeCase')

      expect(mergeCase?.attributes).toEqual(mergeCaseAttributes)
      expect(
        (mergeCase?.include as IncludeOptions[]).map((node) => node.as).sort(),
      ).toEqual(['civilClaimants', 'defendants'])
    })
  })
})
