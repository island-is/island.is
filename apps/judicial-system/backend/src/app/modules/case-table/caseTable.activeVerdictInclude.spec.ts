import { Model, ModelCtor, Sequelize } from 'sequelize-typescript'

import { getOptions } from '@island.is/nest/sequelize'

import type { User } from '@island.is/judicial-system/types'
import {
  caseTables,
  CaseTableType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import * as repository from '../repository'
import { getAllIncludes } from './caseTable.utils'
import { caseTableWhereOptions } from './caseTable.whereOptions'

/**
 * Case-table columns that need a verdict (e.g. birtingarstaða) filter to the
 * active row via `subModelMap.verdicts.where`. Sequelize treats `where` on an
 * include as `required: true` unless we opt out, which would INNER JOIN and
 * drop cases whose defendants have no active verdict from the list.
 *
 * These tests assert the emitted SQL so that footgun cannot regress silently.
 */
describe('case tables keep inactive verdicts optional on the join', () => {
  const publicProsecutor = {
    id: 'ppo_id',
    role: UserRole.PROSECUTOR,
    institution: {
      id: 'ppo_institution_id',
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    },
  } as User

  beforeAll(() => {
    const models = Object.values(repository).filter(
      (exported) =>
        typeof exported === 'function' && exported.prototype instanceof Model,
    ) as unknown as ModelCtor[]

    new Sequelize({
      dialect: 'postgres',
      models,
      logging: false,
      define: getOptions().define,
    })
  })

  const sqlForTable = async (tableType: CaseTableType): Promise<string> => {
    const whereOptions = caseTableWhereOptions[tableType](publicProsecutor)
    const caseTableCellKeys = caseTables[tableType].columnKeys
    const [include, order] = getAllIncludes(
      whereOptions.includes ?? {},
      caseTableCellKeys,
      publicProsecutor,
    )

    const sequelize = repository.Case.sequelize as Sequelize
    const queries: string[] = []
    const querySpy = jest
      .spyOn(sequelize, 'query')
      .mockImplementation(async (sql) => {
        queries.push(typeof sql === 'string' ? sql : JSON.stringify(sql))
        return [[], {}]
      })

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
      querySpy.mockRestore()
    }

    return queries[0] ?? ''
  }

  it('left-joins active verdicts for public prosecution office in-review lists', async () => {
    const sql = await sqlForTable(
      CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW,
    )

    expect(sql).toMatch(/LEFT OUTER JOIN "verdict" AS "defendants->verdicts"/i)
    expect(sql).toMatch(
      /"defendants->verdicts"\."is_active" = true|"defendants->verdicts"\."is_active" IS true/i,
    )
    expect(sql).not.toMatch(/INNER JOIN "verdict" AS "defendants->verdicts"/i)
  })
})
