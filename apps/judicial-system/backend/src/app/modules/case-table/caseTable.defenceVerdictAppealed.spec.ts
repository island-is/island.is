import type { User } from '@island.is/judicial-system/types'
import {
  caseTables,
  CaseTableType,
  UserRole,
} from '@island.is/judicial-system/types'

import * as repository from '../repository'
import type { StringGroupValue } from './dto/caseTable.response'
import { caseTableCellGenerators } from './caseTable.cellGenerators'
import { captureSql, initCaseTableModels } from './caseTable.sqlProbe'
import { getAllIncludes, getAttributes } from './caseTable.utils'
import { caseTableWhereOptions } from './caseTable.whereOptions'

/**
 * The defence list of appealed verdicts.
 *
 * What makes a case belong here is not visible in the access options: they
 * admit the district court advocate too, and that advocate keeps the case
 * among their completed cases only. So the list has to ask on its own account
 * who holds the appeal at the court of appeals, and these tests read the SQL
 * to see that it does.
 */
describe('defence appealed verdicts case list', () => {
  const defenceUser = {
    id: 'defender_id',
    role: UserRole.DEFENDER,
    nationalId: '111111-1111',
  } as User

  beforeAll(initCaseTableModels)

  // The raw literals carry their own indentation, so collapse whitespace
  // before matching across a clause boundary.
  const flat = (sql: string) => sql.replace(/\s+/g, ' ')
  const occurrences = (sql: string, needle: string) =>
    sql.split(needle).length - 1

  // The query the service runs for the rows: the columns' includes merged in on
  // top of the where options'.
  const sqlForTableRows = async (tableType: CaseTableType) => {
    const columnKeys = caseTables[tableType].columnKeys
    const whereOptions = caseTableWhereOptions[tableType](defenceUser)
    const [include, order] = getAllIncludes(
      whereOptions.includes ?? {},
      columnKeys,
      defenceUser,
    )

    return flat(
      await captureSql(() =>
        repository.Case.findAll({
          attributes: getAttributes(columnKeys, defenceUser),
          include,
          where: whereOptions.where,
          order,
        }),
      ),
    )
  }

  const APPEAL_DEFENDER = `defendant.appeal_defender_national_id = '1111111111' AND defendant.is_appeal_defender_confirmed = true`
  const APPEAL_SPOKESPERSON = `civil_claimant.appeal_spokesperson_national_id = '1111111111' AND civil_claimant.is_appeal_spokesperson_confirmed = true`

  // Once in the access options, where it is one of four ways in, and once more
  // as the list's own rule. A single occurrence would mean the district court
  // advocate's cases are listed as well.
  it('asks again for the advocates confirmed at the court of appeals', async () => {
    const appealed = await sqlForTableRows(
      CaseTableType.DEFENCE_INDICTMENTS_VERDICT_APPEALED,
    )
    const completed = await sqlForTableRows(
      CaseTableType.DEFENCE_INDICTMENTS_COMPLETED,
    )

    expect(occurrences(completed, APPEAL_DEFENDER)).toBe(1)
    expect(occurrences(completed, APPEAL_SPOKESPERSON)).toBe(1)
    expect(occurrences(appealed, APPEAL_DEFENDER)).toBe(2)
    expect(occurrences(appealed, APPEAL_SPOKESPERSON)).toBe(2)
  })

  it('requires a verdict appeal that is still being heard', async () => {
    const sql = await sqlForTableRows(
      CaseTableType.DEFENCE_INDICTMENTS_VERDICT_APPEALED,
    )

    // An inner join on the verdict appeal alone: the association scope keeps
    // a ruling appeal on the same case from standing in for it.
    // A confirmed appeal is still on the list: outside the court of appeals it
    // reads as under advisement until it is completed.
    expect(sql).toContain(
      `INNER JOIN "appeal_case" AS "verdictAppealCase" ON "Case"."id" = "verdictAppealCase"."case_id" AND ("verdictAppealCase"."appeal_state" IN ('APPEALED', 'RECEIVED', 'READY_TO_COMPLETE') AND "verdictAppealCase"."appeal_type" = 'VERDICT')`,
    )
    expect(sql).not.toContain(`'READY_TO_COMPLETE', 'COMPLETED'`)
  })

  // The advocate is found with subqueries, so the defendants column still
  // names everyone on the case rather than only this user's clients.
  it('leaves the defendants join unfiltered', async () => {
    const sql = await sqlForTableRows(
      CaseTableType.DEFENCE_INDICTMENTS_VERDICT_APPEALED,
    )

    expect(sql).toContain(
      'LEFT OUTER JOIN "defendant" AS "defendants" ON "Case"."id" = "defendants"."case_id"',
    )
    expect(sql).not.toContain('"defendants"."case_id" AND')
  })

  it('gives each case a single row, about its verdict appeal', () => {
    const { displayCases } =
      caseTableWhereOptions[CaseTableType.DEFENCE_INDICTMENTS_VERDICT_APPEALED](
        defenceUser,
      )
    const theCase = {
      toJSON: () => ({
        id: 'case_id',
        defendants: [{ id: 'defendant_a' }, { id: 'defendant_b' }],
        appealCase: { id: 'ruling_appeal_id' },
        verdictAppealCase: { id: 'verdict_appeal_id' },
      }),
    } as unknown as repository.Case

    const rows = displayCases?.([theCase])

    expect(rows).toHaveLength(1)
    expect(rows?.[0].appeal?.id).toBe('verdict_appeal_id')
    expect(rows?.[0].appealSource).toBe('verdictAppealCase')
  })

  // The same case stays among the completed ones while it is appealed, and has
  // to be known by the same number there.
  describe('the completed indictments list', () => {
    const rowFor = (json: Record<string, unknown>) => {
      const { displayCases } =
        caseTableWhereOptions[CaseTableType.DEFENCE_INDICTMENTS_COMPLETED](
          defenceUser,
        )
      const theCase = {
        ...json,
        toJSON: () => json,
      } as unknown as repository.Case
      const rows = displayCases?.([theCase]) ?? []

      expect(rows).toHaveLength(1)

      return rows[0]
    }
    const numbersFor = (json: Record<string, unknown>) =>
      (
        caseTableCellGenerators.latestAppealCaseNumber.generate(
          rowFor({ policeCaseNumbers: ['007-2020-1'], ...json }),
          defenceUser,
        ).value as StringGroupValue | undefined
      )?.strList

    it('joins both case-level appeals for their numbers', async () => {
      const sql = await sqlForTableRows(
        CaseTableType.DEFENCE_INDICTMENTS_COMPLETED,
      )

      expect(sql).toContain(
        '"verdictAppealCase"."appeal_case_number" AS "verdictAppealCase.appealCaseNumber"',
      )
      expect(sql).toContain(
        '"appealCase"."appeal_case_number" AS "appealCase.appealCaseNumber"',
      )
      // A case that was never appealed is still a completed case.
      expect(sql).toContain(
        'LEFT OUTER JOIN "appeal_case" AS "verdictAppealCase"',
      )
    })

    it('shows the number of the verdict appeal', () => {
      expect(
        numbersFor({
          verdictAppealCase: { appealCaseNumber: '526/2026' },
        })?.[0],
      ).toBe('526/2026')
    })

    it('still shows the number of an appealed ruling', () => {
      expect(
        numbersFor({ appealCase: { appealCaseNumber: '12/2026' } })?.[0],
      ).toBe('12/2026')
    })

    // A dismissal repealed on appeal can end in a judgment that is appealed in
    // turn; the verdict appeal is then the later of the two.
    it('prefers the verdict appeal where the case has both', () => {
      const json = {
        appealCase: { appealCaseNumber: '12/2026' },
        verdictAppealCase: { appealCaseNumber: '526/2026' },
      }

      expect(numbersFor(json)?.[0]).toBe('526/2026')
      expect(rowFor(json).appealSource).toBe('verdictAppealCase')
    })

    it('leaves the number blank for a case that was not appealed', () => {
      expect(numbersFor({})?.[0]).toBe('')
      expect(rowFor({}).appealSource).toBe('appealCase')
    })
  })
})
