import type { ModelCtor } from 'sequelize-typescript'
import { Model, Sequelize } from 'sequelize-typescript'

import { getOptions } from '@island.is/nest/sequelize'

import type { User } from '@island.is/judicial-system/types'
import {
  CaseTableType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import * as repository from '../repository'
import { courtOfAppealsCasesAccessWhereOptions } from './whereOptions/access'
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

  beforeAll(() => {
    const models = Object.values(repository).filter(
      (exported) =>
        typeof exported === 'function' && exported.prototype instanceof Model,
    ) as ModelCtor[]

    // The same define options the app runs with - `underscored` decides whether
    // the association scope names appeal_type or appealType, so a probe without
    // it would assert against column names production never emits.
    new Sequelize({
      dialect: 'postgres',
      models,
      logging: false,
      define: getOptions().define,
    })
  })

  // Builds the query a case table runs and returns its SQL, without touching a
  // database.
  const sqlForTable = async (
    tableType: CaseTableType,
    user: User,
  ): Promise<string> => {
    const whereOptions = caseTableWhereOptions[tableType](user)
    const [include, order] = getGlobalIncludes(
      whereOptions.includes ?? {},
      user,
    )

    const sequelize = repository.Case.sequelize as Sequelize
    const queries: string[] = []
    const stub = (sql: unknown) => {
      queries.push(typeof sql === 'string' ? sql : JSON.stringify(sql))
      return Promise.resolve([[], {}])
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anySequelize = sequelize as any
    const originalQuery = anySequelize.query
    const originalQueryRaw = anySequelize.queryRaw
    anySequelize.query = stub
    anySequelize.queryRaw = stub

    try {
      await repository.Case.findAll({
        attributes: ['id'],
        include,
        where: whereOptions.where,
        order,
      })
    } catch {
      // Building the query is the subject here; running it is not, and the
      // stubbed query layer answers with rows Sequelize cannot map.
    } finally {
      anySequelize.query = originalQuery
      anySequelize.queryRaw = originalQueryRaw
    }

    return queries[0] ?? ''
  }

  // The access options on their own, with no table where options - which is what
  // searchCases applies.
  const sqlForAccessOptions = async (): Promise<string> => {
    const sequelize = repository.Case.sequelize as Sequelize
    const queries: string[] = []
    const stub = (sql: unknown) => {
      queries.push(typeof sql === 'string' ? sql : JSON.stringify(sql))
      return Promise.resolve([[], {}])
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anySequelize = sequelize as any
    const originalQuery = anySequelize.query
    const originalQueryRaw = anySequelize.queryRaw
    anySequelize.query = stub
    anySequelize.queryRaw = stub

    try {
      await repository.Case.findAll({
        attributes: ['id'],
        include: getAccessIncludes(courtOfAppealsUserForAccess, []),
        where: courtOfAppealsCasesAccessWhereOptions().where,
      })
    } catch {
      // Building the query is the subject here, not running it.
    } finally {
      anySequelize.query = originalQuery
      anySequelize.queryRaw = originalQueryRaw
    }

    return queries[0] ?? ''
  }

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

      // The alias is present: the access rule reads it, and asks for the join
      // itself. What must not happen is the list selecting on it. So the join
      // stays outer - an inner one would narrow the list to verdict appeals -
      // and in the predicate the only column read is the id the access rule
      // tests for null. The join's own ON clause is excluded, since matching
      // the association scope is what a join is.
      expect(sql).not.toMatch(/INNER JOIN "appeal_case" AS "verdictAppealCase"/)

      const predicate = sql.slice(sql.indexOf(' WHERE '))

      expect(predicate).toContain('"verdictAppealCase"."id" IS NOT NULL')
      expect([
        ...new Set(
          [...predicate.matchAll(/"verdictAppealCase"\."(\w+)"/g)].map(
            (m) => m[1],
          ),
        ),
      ]).toEqual(['id'])
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

      const indictmentArms = sql
        .split(' OR ')
        .filter((arm) => arm.includes('INDICTMENT'))

      for (const arm of indictmentArms) {
        // Case insensitive: the verdict arm now requires the appeal through the
        // `verdictAppealCase` alias rather than a lower case column name.
        expect(arm).toMatch(/appeal/i)
      }
    })
  })
})
