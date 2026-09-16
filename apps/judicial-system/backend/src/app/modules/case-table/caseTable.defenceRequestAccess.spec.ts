import { Model, Sequelize } from 'sequelize-typescript'

import { getOptions } from '@island.is/nest/sequelize'

import type { User } from '@island.is/judicial-system/types'
import { CaseTableType, UserRole } from '@island.is/judicial-system/types'

import * as repository from '../repository'
import { getGlobalIncludes } from './caseTable.utils'
import { caseTableWhereOptions } from './caseTable.whereOptions'

/**
 * Defence request-case lists must match defenders via the defendant table
 * (target model after the dual-write migration).
 *
 * Asserting the generated SQL is the only way to see that the defendant
 * subquery lands in the WHERE clause — the where-options object alone does
 * not show what Sequelize emits for Op.in + literal.
 */
describe('defence request case access where options', () => {
  const defenceUser = {
    id: 'defender_id',
    role: UserRole.DEFENDER,
    nationalId: '111111-1111',
  } as User

  beforeAll(() => {
    const models = Object.values(repository).filter(
      (exported) =>
        typeof exported === 'function' && exported.prototype instanceof Model,
    ) as typeof Model[]

    new Sequelize({
      dialect: 'postgres',
      models,
      logging: false,
      define: getOptions().define,
    })
  })

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
      })
    } catch {
      // Building the query is the subject here; running it is not.
    } finally {
      anySequelize.query = originalQuery
      anySequelize.queryRaw = originalQueryRaw
    }

    return queries[0] ?? ''
  }

  it.each([
    CaseTableType.DEFENCE_REQUEST_CASES_IN_PROGRESS,
    CaseTableType.DEFENCE_REQUEST_CASES_APPEALED,
    CaseTableType.DEFENCE_REQUEST_CASES_COMPLETED,
  ])('matches defenders via defendant subquery (%s)', async (tableType) => {
    const sql = await sqlForTable(tableType, defenceUser)

    // Digits-only national id — dashes from the user record are stripped.
    expect(sql).toMatch(
      /FROM defendant[\s\S]*WHERE defender_national_id = '1111111111'/,
    )
    // Case-level column is no longer used for defender access.
    expect(sql).not.toContain(`"Case"."defender_national_id" = '1111111111'`)
  })
})
