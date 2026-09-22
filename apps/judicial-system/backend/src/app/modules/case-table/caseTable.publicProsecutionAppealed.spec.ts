import { Op } from 'sequelize'
import type { ModelCtor } from 'sequelize-typescript'
import { Model, Sequelize } from 'sequelize-typescript'

import { getOptions } from '@island.is/nest/sequelize'

import type { User } from '@island.is/judicial-system/types'
import {
  caseTables,
  CaseTableType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import * as repository from '../repository'
import { publicProsecutionIndictmentsAccessWhereOptions } from './whereOptions/access'
import {
  getAllIncludes,
  getAttributes,
  getGlobalIncludes,
} from './caseTable.utils'
import {
  caseTableWhereOptions,
  userAccessWhereOptions,
} from './caseTable.whereOptions'

/**
 * The appealed case list for prosecutors at the public prosecutor's office.
 *
 * Two things about it are invisible in the where options themselves and only
 * show up in the SQL: that it does not require this user to be the reviewer,
 * the way the two review lists do, and that it asks about appealing defendants
 * with a correlated EXISTS instead of putting a `where` on a defendants
 * include. The second matters because `setInclude` merges only attributes, so
 * an include-level `where` would survive into the row query and narrow the
 * defendants column to the appealing defendants.
 */
describe('public prosecution appealed case list', () => {
  const publicProsecutionUser = {
    id: 'public_prosecutor_id',
    role: UserRole.PROSECUTOR,
    institution: {
      id: 'public_prosecutors_office_id',
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    },
  } as User

  beforeAll(() => {
    const models = Object.values(repository).filter(
      (exported) =>
        typeof exported === 'function' && exported.prototype instanceof Model,
    ) as ModelCtor[]

    new Sequelize({
      dialect: 'postgres',
      models,
      logging: false,
      define: getOptions().define,
    })
  })

  const captureSql = async (run: () => Promise<unknown>): Promise<string> => {
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
      await run()
    } catch {
      // Building the query is the subject here; running it is not.
    } finally {
      anySequelize.query = originalQuery
      anySequelize.queryRaw = originalQueryRaw
    }

    return queries[0] ?? ''
  }

  // The query the service really runs for a row: the cell generators' includes
  // merged in on top of the where options'. `sqlForTable` below builds only the
  // membership query, which is the right shape for asserting where clauses but
  // says nothing about how the columns are fetched.
  const sqlForTableRows = (tableType: CaseTableType, user: User) => {
    const columnKeys = caseTables[tableType].columnKeys
    const whereOptions = caseTableWhereOptions[tableType](user)
    const [include, order] = getAllIncludes(
      whereOptions.includes ?? {},
      columnKeys,
      user,
    )

    return captureSql(() =>
      repository.Case.findAll({
        attributes: getAttributes(columnKeys, user),
        include,
        where: whereOptions.where,
        order,
      }),
    )
  }

  const sqlForTable = (tableType: CaseTableType, user: User) => {
    const whereOptions = caseTableWhereOptions[tableType](user)
    const [include, order] = getGlobalIncludes(whereOptions.includes ?? {})

    return captureSql(() =>
      repository.Case.findAll({
        attributes: ['id'],
        include,
        where: whereOptions.where,
        order,
      }),
    )
  }

  const reviewerClause = `"Case"."indictment_reviewer_id" = '${publicProsecutionUser.id}'`
  const occurrences = (sql: string, needle: string) =>
    sql.split(needle).length - 1
  // The raw literals carry their own indentation, so collapse whitespace
  // before matching across a clause boundary.
  const flat = (sql: string) => sql.replace(/\s+/g, ' ')

  // The reviewer restriction is the whole reason the list exists: a prosecutor
  // handed an appeal they did not review could not otherwise see the case.
  //
  // Both lists mention the reviewer once, as one branch of the access options'
  // OR - being the reviewer is one of the two ways a case is reachable at all.
  // What separates them is what each list then requires: the review list asks
  // for the reviewer a second time, as its own membership rule, and the
  // appealed list must not.
  it('does not require this user to be the reviewer, unlike the review lists', async () => {
    const appealed = await sqlForTable(
      CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED,
      publicProsecutionUser,
    )
    const inReview = await sqlForTable(
      CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW,
      publicProsecutionUser,
    )

    const reviewed = await sqlForTable(
      CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_REVIEWED,
      publicProsecutionUser,
    )

    expect(appealed).toContain(`${reviewerClause} OR`)
    expect(occurrences(appealed, reviewerClause)).toBe(1)
    // Both review lists, not just the first: each has to restate the reviewer
    // itself, and a regression in either one leaks another prosecutor's
    // appealed case into this user's review work.
    expect(occurrences(inReview, reviewerClause)).toBe(2)
    expect(occurrences(reviewed, reviewerClause)).toBe(2)
  })

  // A case the user did review is still theirs to see once it is appealed - the
  // two ways in are alternatives, not a partition.
  it('keeps the appeal branch independent of who reviewed the case', async () => {
    const appealed = await sqlForTable(
      CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED,
      publicProsecutionUser,
    )

    // The membership rule the table adds on top of the access options stands
    // alone: an appealed ruling, with nothing said about the reviewer.
    expect(flat(appealed)).toContain(
      `AND "Case"."indictment_ruling_decision" = 'RULING' AND EXISTS ( SELECT 1 FROM defendant`,
    )
  })

  it('asks for an appealing defendant with a correlated subquery', async () => {
    const sql = await sqlForTable(
      CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED,
      publicProsecutionUser,
    )

    expect(sql).toContain('FROM defendant')
    expect(sql).toContain('defendant.case_id = "Case".id')
    // The membership query joins nothing: the where options contribute no
    // defendants include of their own.
    expect(sql).not.toContain('JOIN "defendant"')
  })

  // The row query does join the defendants - the columns need them. The join
  // must stay unfiltered, or the defendants column would list only the ones who
  // appealed rather than everyone on the case.
  it('leaves the defendants join unfiltered in the row query', async () => {
    const sql = flat(
      await sqlForTableRows(
        CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED,
        publicProsecutionUser,
      ),
    )

    expect(sql).toContain(
      'LEFT OUTER JOIN "defendant" AS "defendants" ON "Case"."id" = "defendants"."case_id"',
    )
    expect(sql).not.toContain('"defendants"."case_id" AND')
  })

  // The access options already say RULING inside their appeal branch, so merely
  // finding that string proves nothing - it is there whether or not the table
  // restricts anything. What matters is that the table asks for it again on its
  // own account, which is what keeps a fine this user reviewed, appealed by
  // review decision, out of the list.
  it('counts only appeals of a ruling, not of a fine', async () => {
    const sql = await sqlForTable(
      CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED,
      publicProsecutionUser,
    )
    const rulingClause = `"Case"."indictment_ruling_decision" = 'RULING'`

    expect(occurrences(sql, rulingClause)).toBe(2)
  })

  // Heightened security narrows the appeal route, but only that route. Hoisting
  // the restriction to a term of its own would also gate the reviewer route,
  // taking a heightened case away from the very prosecutor it was assigned to -
  // which is why this asserts the shape of the predicate and not just that the
  // clause is present somewhere in it.
  it('applies heightened security to the appeal route and leaves the reviewer route alone', async () => {
    // The where options are typed for Sequelize, not for reading back, so the
    // symbol keys need a loose view to inspect.
    const access = publicProsecutionIndictmentsAccessWhereOptions(
      publicProsecutionUser,
    ) as unknown as Record<symbol, unknown[]>
    const terms = access[Op.and]

    // The predicate is the event log condition and the two routes, and nothing
    // else. A third term here is the restriction hoisted out of the appeal
    // route, where it would gate both routes instead of one.
    expect(terms).toHaveLength(2)

    const routes = (
      terms.find(
        (term) => typeof term === 'object' && term !== null && Op.or in term,
      ) as Record<symbol, unknown[]> | undefined
    )?.[Op.or]

    // Being the reviewer is the whole of that route - no further condition.
    expect(routes?.[0]).toEqual({
      indictment_reviewer_id: publicProsecutionUser.id,
    })

    const appealed = await sqlForTable(
      CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED,
      publicProsecutionUser,
    )

    expect(appealed).toContain('"is_heightened_security_level"')
    expect(appealed).toContain(
      `"creating_prosecutor_id" = '${publicProsecutionUser.id}'`,
    )
  })

  // One row per case, unlike the office's list of the same name.
  it('gives each case a single row', () => {
    expect(
      caseTableWhereOptions[
        CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED
      ](publicProsecutionUser).displayCases,
    ).toBeUndefined()
    expect(
      caseTableWhereOptions[
        CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEALED
      ](publicProsecutionUser).displayCases,
    ).toBeDefined()
  })

  // Search runs off the access options rather than the table's, so without
  // this a prosecutor could open a case from the list and still not find it
  // by name.
  it('lets search reach the same cases the list shows', async () => {
    const sql = await captureSql(() =>
      repository.Case.findAll({
        attributes: ['id'],
        where: userAccessWhereOptions(publicProsecutionUser),
      }),
    )

    expect(sql).toContain('verdict.appeal_date IS NOT NULL')
  })
})
