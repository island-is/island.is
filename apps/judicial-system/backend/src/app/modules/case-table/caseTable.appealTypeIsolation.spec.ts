import { Model, Sequelize } from 'sequelize-typescript'

import { getOptions } from '@island.is/nest/sequelize'

import type { User } from '@island.is/judicial-system/types'
import {
  CaseTableType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import * as repository from '../repository'
import { caseTableWhereOptions } from './caseTable.whereOptions'
import { getGlobalIncludes } from './caseTable.utils'

/**
 * A verdict appeal (áfrýjun) must not reach a case list built for ruling appeals
 * (kæra). Every such list joins the `appealCase` alias, whose association scope
 * carries the appeal type, so the isolation is enforced once on the model rather
 * than in each list's where options.
 *
 * These tests assert the actual SQL, because the guarantee lives in how Sequelize
 * combines an association scope with the include's own `where` - it ANDs them
 * into the join condition - and that is not visible in the include options the
 * where options build.
 */
describe('case tables keep áfrýjun out of kæra lists', () => {
  const districtCourtJudge = {
    id: 'judge_id',
    role: UserRole.DISTRICT_COURT_JUDGE,
    institution: { id: 'court_id', type: InstitutionType.DISTRICT_COURT },
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
    ) as typeof Model[]

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
    const [include, order] = getGlobalIncludes(whereOptions.includes ?? {})

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
      }).catch(() => undefined)
    } finally {
      anySequelize.query = originalQuery
      anySequelize.queryRaw = originalQueryRaw
    }

    return queries[0] ?? ''
  }

  // The tab an áfrýjun in APPEALED would surface in if the type were not
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
})
