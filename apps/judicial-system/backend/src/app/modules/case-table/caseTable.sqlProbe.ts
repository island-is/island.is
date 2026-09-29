import { Sequelize } from 'sequelize-typescript'

import { getOptions } from '@island.is/nest/sequelize'

import * as repository from '../repository'
import { repositoryModels } from '../repository/repositoryModels'

/**
 * Shared setup for the specs that assert the SQL a case table query builds.
 *
 * Both halves used to be copied into each of those specs, along with a comment
 * explaining the parts that are load-bearing. That is the wrong place for it:
 * a copy that drifts does not fail, it keeps passing while asserting against
 * SQL the app never emits.
 */

/**
 * Registers the repository models so queries can be built without a database.
 *
 * The array is the one RepositoryModule registers with Sequelize, not a list
 * assembled here - every model, not only the ones a given spec asks about,
 * because association resolution fails on an unrelated model otherwise.
 *
 * `define` comes from the app's own options. Without `underscored` an attribute
 * renders as "appealType" where production emits "appeal_type", so a spec set
 * up without it asserts against column names that never reach the database -
 * and passes.
 */
export const initCaseTableModels = () => {
  new Sequelize({
    dialect: 'postgres',
    models: repositoryModels,
    logging: false,
    define: getOptions().define,
  })
}

/**
 * Runs `run` with the query layer stubbed out and returns the SQL of the first
 * query it built, unformatted.
 *
 * Nothing reaches a database. The stub answers with rows Sequelize cannot map,
 * so `run` is expected to throw; the throw is swallowed because building the
 * query is the subject here and running it is not.
 */
export const captureSql = async (
  run: () => Promise<unknown>,
): Promise<string> => {
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
