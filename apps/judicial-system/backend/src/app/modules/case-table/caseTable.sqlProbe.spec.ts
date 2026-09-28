import * as repository from '../repository'
import { captureSql, initCaseTableModels } from './caseTable.sqlProbe'

/**
 * The probe setup itself, which nothing else can check.
 *
 * Every spec that asserts generated SQL is only as good as this file: set the
 * models up differently from the app and those specs keep passing while
 * asserting against SQL the app never emits. That is a false negative, so it
 * announces itself nowhere. These tests are the announcement.
 */
describe('case table sql probe', () => {
  beforeAll(initCaseTableModels)

  // The reason `define` comes from the app's own options. Without
  // `underscored`, Sequelize renders attributes as they are named in
  // TypeScript, and an assertion written against a snake_case column would
  // fail - or worse, one written against the camelCase form would pass.
  it('renders column names the way the app does', async () => {
    const sql = await captureSql(() =>
      repository.Case.findAll({
        attributes: ['id'],
        where: { isArchived: false },
      }),
    )

    expect(sql).toContain('"is_archived"')
    expect(sql).not.toContain('"isArchived"')
  })

  // Association scopes are the other half: they are declared on the model, and
  // a probe that registered only some models would resolve them differently or
  // not at all.
  it('resolves associations across the repository models', async () => {
    const sql = await captureSql(() =>
      repository.Case.findAll({
        attributes: ['id'],
        include: [
          { model: repository.AppealCase, as: 'appealCase', attributes: ['id'] },
        ],
      }),
    )

    expect(sql).toContain('"appeal_case" AS "appealCase"')
    // The scope that tells a ruling appeal from the others, carried into the
    // join rather than stated by the caller.
    expect(sql).toContain('"appealCase"."appeal_type" = \'RULING\'')
  })

  it('puts the query layer back afterwards', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sequelize = repository.Case.sequelize as any
    const before = sequelize.query

    await captureSql(() => repository.Case.findAll({ attributes: ['id'] }))

    expect(sequelize.query).toBe(before)
  })

  // A query that never runs captures nothing, rather than throwing or hanging.
  it('returns an empty string when nothing was queried', async () => {
    expect(await captureSql(async () => undefined)).toBe('')
  })
})
