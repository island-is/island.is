import type { User } from '@island.is/judicial-system/types'
import {
  caseTables,
  CaseTableType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import * as repository from '../repository'
import { courtOfAppealsCasesAccessWhereOptions } from './whereOptions/access'
import { captureSql, initCaseTableModels } from './caseTable.sqlProbe'
import {
  getAccessIncludes,
  getAllIncludes,
  getAttributes,
} from './caseTable.utils'
import { caseTableWhereOptions } from './caseTable.whereOptions'

/**
 * The court of appeals' list of verdict appeals it has confirmed and has still
 * to complete. The court completes them from this list in bulk, by appeal case
 * id, so the list must hold confirmed verdict appeals and nothing else.
 */
describe('court of appeals verdict appeals ready to complete', () => {
  const tableType =
    CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_READY_TO_COMPLETE

  const courtOfAppealsUser = {
    id: 'coa_user_id',
    role: UserRole.COURT_OF_APPEALS_JUDGE,
    institution: { id: 'coa_id', type: InstitutionType.COURT_OF_APPEALS },
  } as User

  beforeAll(initCaseTableModels)

  const flat = (sql: string) => sql.replace(/\s+/g, ' ')

  // The query the service runs for the rows: the columns' includes merged in on
  // top of the where options'.
  const sqlForTableRows = async () => {
    const columnKeys = caseTables[tableType].columnKeys
    const whereOptions = caseTableWhereOptions[tableType](courtOfAppealsUser)
    const [include, order] = getAllIncludes(
      whereOptions.includes ?? {},
      columnKeys,
      courtOfAppealsUser,
    )

    return flat(
      await captureSql(() =>
        repository.Case.findAll({
          attributes: getAttributes(columnKeys, courtOfAppealsUser),
          include,
          where: whereOptions.where,
          order,
        }),
      ),
    )
  }

  const sqlForAccessOptions = async () =>
    flat(
      await captureSql(() =>
        repository.Case.findAll({
          attributes: ['id'],
          include: getAccessIncludes(courtOfAppealsUser, []),
          where: courtOfAppealsCasesAccessWhereOptions().where,
        }),
      ),
    )

  const predicateOf = (sql: string) =>
    sql.slice(sql.indexOf(' WHERE ') + ' WHERE '.length).replace(/;$/, '')

  const SENT_APPEAL_SUMMONS =
    /FROM "appeal_summons" s[\s\S]*?ac\."case_id" = "Case"\."id"[\s\S]*?ac\."appeal_type" = 'VERDICT'[\s\S]*?s\."sent_to_court_of_appeals_date" IS NOT NULL/

  // An inner join on the verdict appeal, scoped to the verdict type, so a ruling
  // appeal on the same case cannot stand in for it.
  it('joins only confirmed verdict appeals', async () => {
    const sql = await sqlForTableRows()

    expect(sql).toContain(
      `INNER JOIN "appeal_case" AS "verdictAppealCase" ON "Case"."id" = "verdictAppealCase"."case_id" AND ("verdictAppealCase"."appeal_state" = 'READY_TO_COMPLETE' AND "verdictAppealCase"."appeal_type" = 'VERDICT')`,
    )
    expect(sql).not.toMatch(/INNER JOIN "appeal_case" AS "appealCase"/)
  })

  // Every state test on the verdict appeal, in the join and in the predicate,
  // asks for a confirmed appeal and nothing else.
  it('selects no verdict appeal in any other state', async () => {
    const sql = await sqlForTableRows()
    const stateTests = [
      ...sql.matchAll(
        /"verdictAppealCase"\."appeal_state" (= '[A-Z_]+'|IN \([^)]*\))/g,
      ),
    ].map((match) => match[1])

    expect(stateTests).toEqual([
      "= 'READY_TO_COMPLETE'",
      "= 'READY_TO_COMPLETE'",
    ])
  })

  // The access options admit a case, not an appeal, so the list asks for the
  // sent summons outside them, as the other verdict appeal lists do.
  it('applies the access options and requires a sent appeal summons', async () => {
    const predicate = predicateOf(await sqlForTableRows())
    const accessPredicate = predicateOf(await sqlForAccessOptions())

    expect(predicate).toContain(accessPredicate)
    expect(predicate.replace(accessPredicate, '')).toMatch(SENT_APPEAL_SUMMONS)
  })

  // The bulk completion is sent with the appeal case ids the rows carry.
  it('presents the verdict appeal as the row appeal', () => {
    const { displayCases } =
      caseTableWhereOptions[tableType](courtOfAppealsUser)
    const theCase = {
      toJSON: () => ({
        id: 'case_id',
        appealCase: { id: 'ruling_appeal_id' },
        verdictAppealCase: { id: 'verdict_appeal_id' },
      }),
    } as unknown as repository.Case

    expect(displayCases).toBeDefined()

    const rows = displayCases ? displayCases([theCase]) : []

    expect(rows).toHaveLength(1)
    expect(rows[0].appeal?.id).toBe('verdict_appeal_id')
    expect(rows[0].appealSource).toBe('verdictAppealCase')
  })

  // The completed list keeps the confirmed appeals as well.
  it('leaves confirmed appeals on the completed list', () => {
    const whereOptions =
      caseTableWhereOptions[
        CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED
      ](courtOfAppealsUser)

    expect(whereOptions.includes?.verdictAppealCase?.where).toEqual({
      appeal_state: ['READY_TO_COMPLETE', 'COMPLETED', 'WITHDRAWN'],
    })
  })
})
