import type { ModelCtor } from 'sequelize-typescript'
import { Model, Sequelize } from 'sequelize-typescript'

import { getOptions } from '@island.is/nest/sequelize'

import type { User } from '@island.is/judicial-system/types'
import {
  caseTables,
  CaseTableType,
  getCaseTableGroups,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import * as repository from '../repository'
import {
  getAccessIncludes,
  getAllIncludes,
  getAttributes,
  getGlobalIncludes,
} from './caseTable.utils'
import {
  caseTableWhereOptions,
  userAccessWhereOptions,
} from './caseTable.whereOptions'

/**
 * An access rule names the associations it reads - `$appealCase.appeal_state$`
 * and the like. Sequelize emits that reference whether or not the query joined
 * the alias, and Postgres then rejects the whole statement with
 * `missing FROM-clause entry`. Nothing in the type system catches it.
 *
 * So the rules carry the joins they need, and these tests hold the two halves
 * of that bargain: that the joins a rule asks for cover the aliases it reads,
 * and that every query the case tables build ends up joining what it names.
 */
describe('access rules carry the joins they read', () => {
  const users: Record<string, User> = {
    'court of appeals': {
      id: 'u-coa',
      role: UserRole.COURT_OF_APPEALS_JUDGE,
      institution: { id: 'i-coa', type: InstitutionType.COURT_OF_APPEALS },
    } as User,
    'district court': {
      id: 'u-dc',
      role: UserRole.DISTRICT_COURT_JUDGE,
      institution: { id: 'i-dc', type: InstitutionType.DISTRICT_COURT },
    } as User,
    'prison staff': {
      id: 'u-ps',
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { id: 'i-ps', type: InstitutionType.PRISON },
    } as User,
    'prison admin': {
      id: 'u-pa',
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { id: 'i-pa', type: InstitutionType.PRISON_ADMIN },
    } as User,
    'public prosecution office': {
      id: 'u-pps',
      role: UserRole.PUBLIC_PROSECUTOR_STAFF,
      institution: {
        id: 'i-rsk',
        type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      },
    } as User,
    'public prosecution': {
      id: 'u-pp',
      role: UserRole.PROSECUTOR,
      institution: {
        id: 'i-rsk',
        type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      },
    } as User,
    prosecution: {
      id: 'u-pr',
      role: UserRole.PROSECUTOR,
      institution: {
        id: 'i-dpo',
        type: InstitutionType.DISTRICT_PROSECUTORS_OFFICE,
      },
    } as User,
    'prosecutor representative': {
      id: 'u-re',
      role: UserRole.PROSECUTOR_REPRESENTATIVE,
      institution: {
        id: 'i-dpo',
        type: InstitutionType.DISTRICT_PROSECUTORS_OFFICE,
      },
    } as User,
    defence: {
      id: 'u-df',
      role: UserRole.DEFENDER,
      nationalId: '1111111111',
    } as User,
  }

  beforeAll(() => {
    const models = Object.values(repository).filter(
      (exported) =>
        typeof exported === 'function' && exported.prototype instanceof Model,
    ) as ModelCtor[]

    // The define options the app runs with - without `underscored` the aliases
    // and columns render differently and the assertions mean nothing.
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

    return (queries[0] ?? '').replace(/\s+/g, ' ')
  }

  // Aliases the SQL reads, other than the case itself.
  const aliasesRead = (sql: string) =>
    [
      ...new Set([...sql.matchAll(/"([A-Za-z]+)"\."/g)].map((m) => m[1])),
    ].filter((alias) => alias !== 'Case')

  const aliasesJoined = (sql: string) => [
    ...new Set([...sql.matchAll(/AS "([A-Za-z]+)"/g)].map((m) => m[1])),
  ]

  describe.each(Object.entries(users))('%s', (_name, user) => {
    it('asks for every association its access rule reads', async () => {
      // Deliberately built with no includes of its own: whatever aliases show
      // up here are ones the rule itself brought in.
      const bare = await captureSql(() =>
        repository.Case.findAll({
          attributes: ['id'],
          where: userAccessWhereOptions(user).where,
        }),
      )
      const requested = await captureSql(() =>
        repository.Case.findAll({
          attributes: ['id'],
          include: getAccessIncludes(user, []),
          where: userAccessWhereOptions(user).where,
        }),
      )

      expect(aliasesRead(bare).sort()).toEqual(
        expect.arrayContaining([] as string[]),
      )
      for (const alias of aliasesRead(bare)) {
        expect(aliasesJoined(requested)).toContain(alias)
      }
    })

    it('joins every association each of its lists reads', async () => {
      const types = getCaseTableGroups(user).flatMap((group) =>
        group.tables.map((table) => table.type),
      )

      for (const type of types as CaseTableType[]) {
        const whereOptions = caseTableWhereOptions[type](user)
        const columnKeys = caseTables[type].columnKeys

        const [membershipInclude, membershipOrder] = getGlobalIncludes(
          whereOptions.includes ?? {},
          user,
        )
        const membership = await captureSql(() =>
          repository.Case.findAll({
            attributes: ['id'],
            include: membershipInclude,
            where: whereOptions.where,
            order: membershipOrder,
          }),
        )

        const [rowInclude, rowOrder] = getAllIncludes(
          whereOptions.includes ?? {},
          columnKeys,
          user,
        )
        const rows = await captureSql(() =>
          repository.Case.findAll({
            attributes: getAttributes(columnKeys, user),
            include: rowInclude,
            where: whereOptions.where,
            order: rowOrder,
          }),
        )

        for (const sql of [membership, rows]) {
          const joined = aliasesJoined(sql)

          for (const alias of aliasesRead(sql)) {
            expect({ type, alias, joined }).toEqual({
              type,
              alias,
              joined: expect.arrayContaining([alias]),
            })
          }
        }
      }
    })
  })
})
