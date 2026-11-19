import type { User } from '@island.is/judicial-system/types'
import {
  CaseTableType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import * as repository from '../repository'
import { courtOfAppealsCasesAccessWhereOptions } from './whereOptions/access'
import { captureSql, initCaseTableModels } from './caseTable.sqlProbe'
import { getAccessIncludes, getGlobalIncludes } from './caseTable.utils'
import { caseTableWhereOptions } from './caseTable.whereOptions'

/**
 * A verdict appeal must not reach a case list built for ruling appeals.
 * Every such list joins the `appealCase` alias, whose association scope
 * carries the appeal type, so the isolation is enforced once on the model rather
 * than in each list's where options.
 *
 * These tests assert the actual SQL, because the guarantee lives in how Sequelize
 * combines an association scope with the include's own `where` - it ANDs them
 * into the join condition - and that is not visible in the include options the
 * where options build.
 */
describe('case tables keep verdict appeals out of ruling appeal lists', () => {
  const districtCourtJudge = {
    id: 'judge_id',
    role: UserRole.DISTRICT_COURT_JUDGE,
    institution: { id: 'court_id', type: InstitutionType.DISTRICT_COURT },
  } as User

  // The access rule now carries the joins it reads, so building it needs a user.
  const courtOfAppealsUserForAccess = {
    id: 'coa_user_id',
    role: UserRole.COURT_OF_APPEALS_JUDGE,
    institution: { id: 'coa_id', type: InstitutionType.COURT_OF_APPEALS },
  } as User

  const defenceUser = {
    id: 'defender_id',
    role: UserRole.DEFENDER,
    nationalId: '1111111111',
  } as User

  const prosecutionUser = {
    id: 'prosecutor_id',
    role: UserRole.PROSECUTOR,
    institution: {
      id: 'prosecutors_office_id',
      type: InstitutionType.DISTRICT_PROSECUTORS_OFFICE,
    },
  } as User

  beforeAll(initCaseTableModels)

  // Builds the query a case table runs and returns its SQL, without touching a
  // database.
  const sqlForTable = (
    tableType: CaseTableType,
    user: User,
  ): Promise<string> => {
    const whereOptions = caseTableWhereOptions[tableType](user)
    const [include, order] = getGlobalIncludes(
      whereOptions.includes ?? {},
      user,
    )

    return captureSql(() =>
      repository.Case.findAll({
        attributes: ['id'],
        include,
        where: whereOptions.where,
        order,
      }),
    )
  }

  // The access options on their own, with no table where options - which is what
  // searchCases applies.
  const sqlForAccessOptions = (): Promise<string> =>
    captureSql(() =>
      repository.Case.findAll({
        attributes: ['id'],
        include: getAccessIncludes(courtOfAppealsUserForAccess, []),
        where: courtOfAppealsCasesAccessWhereOptions().where,
      }),
    )

  // Every alias a query's WHERE names, other than the root. Sequelize emits a
  // reference to an association the query did not join without complaint, and
  // Postgres then rejects the whole query for a missing FROM-clause entry - so
  // an include that exists only to satisfy a shared predicate is load-bearing
  // and nothing else would notice it going.
  const referencedAliases = (sql: string): string[] => {
    const where = sql.slice(sql.indexOf(' WHERE '))

    return [
      ...new Set(
        [...where.matchAll(/"([A-Za-z][A-Za-z0-9]*)"\."/g)]
          .map((match) => match[1])
          .filter((alias) => alias !== 'Case'),
      ),
    ]
  }

  // The condition that a summons on the case's verdict appeal has been sent to
  // the court of appeals.
  const SENT_APPEAL_SUMMONS =
    /FROM "appeal_summons" s[\s\S]*?ac\."case_id" = "Case"\."id"[\s\S]*?ac\."appeal_type" = 'VERDICT'[\s\S]*?s\."sent_to_court_of_appeals_date" IS NOT NULL/

  const joinedAliases = (sql: string): string[] => [
    ...new Set(
      [...sql.matchAll(/ AS "([A-Za-z][A-Za-z0-9]*)"/g)].map((m) => m[1]),
    ),
  ]

  // The tab a verdict appeal in APPEALED would surface in if the type were not
  // filtered - the reason this isolation exists at all.
  it('filters the appeal type in the district court appealed request cases', async () => {
    const sql = await sqlForTable(
      CaseTableType.DISTRICT_COURT_REQUEST_CASES_APPEALED,
      districtCourtJudge,
    )

    expect(sql).toContain('appeal_state')
    expect(sql).toMatch(/appeal_type.{0,20}'RULING'/)
  })

  it('filters the appeal type in the defence appealed indictments', async () => {
    const sql = await sqlForTable(
      CaseTableType.DEFENCE_INDICTMENTS_APPEALED,
      defenceUser,
    )

    expect(sql).toMatch(/appeal_type.{0,20}'RULING'/)
  })

  it('filters the appeal type in the prosecution appealed request cases', async () => {
    const sql = await sqlForTable(
      CaseTableType.PROSECUTION_REQUEST_CASES_APPEALED,
      prosecutionUser,
    )

    expect(sql).toMatch(/appeal_type.{0,20}'RULING'/)
  })

  // The isolation has to hold in both directions: the court of appeals' own
  // ruling appeal lists must not pick up verdict appeals, and its verdict
  // appeal lists must not pick up ruling appeals.
  describe('the court of appeals lists', () => {
    const courtOfAppealsUser = {
      id: 'judge_id',
      role: UserRole.COURT_OF_APPEALS_JUDGE,
      institution: {
        id: 'court_of_appeals_id',
        type: InstitutionType.COURT_OF_APPEALS,
      },
    } as User

    it.each([
      CaseTableType.COURT_OF_APPEALS_CASES_IN_PROGRESS,
      CaseTableType.COURT_OF_APPEALS_CASES_COMPLETED,
    ])('keeps verdict appeals out of %s', async (tableType) => {
      const sql = await sqlForTable(tableType, courtOfAppealsUser)

      expect(sql).toMatch(/appeal_type.{0,20}'RULING'/)

      // The access rule admits a verdict appeal through a correlated EXISTS of
      // its own, so these lists have no reason to join the verdict appeal at
      // all - and a list that did would be selecting on it.
      expect(sql).not.toMatch(/ AS "verdictAppealCase"/)
    })

    // The selection is driven by the verdict appeal: an inner join on the
    // alias scoped to VERDICT, so a case without one cannot appear whatever
    // the access options admit. The ruling appeal is joined too, because the
    // access options reference it, which is why this cannot simply assert that
    // 'RULING' is absent.
    it.each([
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS,
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED,
    ])('selects only verdict appeals in %s', async (tableType) => {
      const sql = await sqlForTable(tableType, courtOfAppealsUser)

      expect(sql).toMatch(
        /INNER JOIN "appeal_case" AS "verdictAppealCase"[\s\S]*?"verdictAppealCase"\."appeal_type" = 'VERDICT'/,
      )
      expect(sql).not.toMatch(/INNER JOIN "appeal_case" AS "appealCase"/)
    })

    // The access options admit a case, not an appeal: a case the court reaches
    // through a ruling appeal passes them while its verdict appeal has no
    // summons sent. So the lists have to require the sent summons outside the
    // access options' OR - with those options taken out of the predicate, the
    // condition must still be there.
    it.each([
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS,
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED,
    ])('requires a sent appeal summons in %s itself', async (tableType) => {
      const sql = await sqlForTable(tableType, courtOfAppealsUser)
      const accessSql = await sqlForAccessOptions()

      const predicate = sql.slice(sql.indexOf(' WHERE ') + ' WHERE '.length)
      const accessPredicate = accessSql
        .slice(accessSql.indexOf(' WHERE ') + ' WHERE '.length)
        .replace(/;$/, '')

      expect(predicate).toContain(accessPredicate)
      expect(predicate.replace(accessPredicate, '')).toMatch(
        SENT_APPEAL_SUMMONS,
      )
    })

    // The access options name the ruling appeal by alias, so every list that
    // applies them has to join it - including the verdict appeal lists, which
    // otherwise have no use for it. Removing that include leaves SQL Postgres
    // will not run.
    it.each([
      CaseTableType.COURT_OF_APPEALS_CASES_IN_PROGRESS,
      CaseTableType.COURT_OF_APPEALS_CASES_COMPLETED,
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS,
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED,
    ])('joins every association %s filters on', async (tableType) => {
      const sql = await sqlForTable(tableType, courtOfAppealsUser)

      expect(sql).not.toBe('')
      expect(joinedAliases(sql)).toEqual(
        expect.arrayContaining(referencedAliases(sql)),
      )
    })

    // The access options are the whole guard for search, which applies no table
    // where options of its own. An arm that admits indictment cases without
    // requiring an appeal would hand the court of appeals every indictment in
    // the system.
    it('admits an indictment case only when it carries an appeal', async () => {
      const sql = await sqlForAccessOptions()

      expect(sql).toMatch(/appeal_type" = 'VERDICT'/)

      // A verdict appeal is the court's only once an appeal summons has been
      // sent to it. Without the send date the court would see every appeal
      // the public prosecution is still preparing.
      const verdictArm = sql
        .split(' OR ')
        .find((arm) => arm.includes(`"appeal_type" = 'VERDICT'`))

      expect(verdictArm).toMatch(SENT_APPEAL_SUMMONS)

      const indictmentArms = sql
        .split(' OR ')
        .filter((arm) => arm.includes('INDICTMENT'))

      for (const arm of indictmentArms) {
        expect(arm).toMatch(/appeal/i)
      }
    })
  })
})
