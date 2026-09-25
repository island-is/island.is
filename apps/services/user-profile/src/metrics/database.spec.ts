import { randomUUID } from 'crypto'
import { Sequelize } from 'sequelize'
import { collectProfileMetrics } from './collect'

const databaseUrl = process.env.METRICS_TEST_DATABASE_URL
const describeDatabase = databaseUrl ? describe : describe.skip

describeDatabase('profile metrics PostgreSQL integration', () => {
  const schema = `profile_metrics_test_${randomUUID().replace(/-/g, '')}`
  let db: Sequelize
  beforeAll(async () => {
    if (!databaseUrl) throw new Error('Missing test database URL')
    db = new Sequelize(databaseUrl, {
      logging: false,
      pool: { max: 1, min: 1 },
    })
    await db.query(`CREATE SCHEMA "${schema}"`)
    await db.query(`SET search_path TO "${schema}"`)
    await db.query(
      'CREATE TABLE user_profile (national_id text, document_notifications boolean)',
    )
  })
  afterAll(async () => {
    if (db) {
      await db.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
      await db.close()
    }
  })
  it('counts null preferences separately and classifies invalid identifiers safely', async () => {
    await db.query(
      `INSERT INTO user_profile VALUES ('0101901234', false), ('0201901234', true), ('0301901234', null), ('4101901234', false), ('invalid', false)`,
    )
    const metrics = await collectProfileMetrics(db)
    expect(
      metrics
        .filter((m) => m.tags?.recipient_type === 'individual')
        .map((m) => m.value),
    ).toEqual([1, 2, 1])
    expect(
      metrics
        .filter((m) => m.tags?.recipient_type === 'company')
        .map((m) => m.value),
    ).toEqual([1, 1, 0])
    expect(
      metrics
        .filter((m) => m.tags?.recipient_type === 'other')
        .map((m) => m.value),
    ).toEqual([1, 1, 0])
  })
})
