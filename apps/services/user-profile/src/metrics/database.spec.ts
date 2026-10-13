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
    await db.query(`
      CREATE TABLE user_profile (
        document_notifications boolean,
        email_notifications boolean,
        sms_notifications boolean
      )
    `)
  })

  afterAll(async () => {
    if (db) {
      await db.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
      await db.close()
    }
  })

  it('counts false and null settings, excluding any true setting', async () => {
    await db.query(`
      INSERT INTO user_profile VALUES
        (false, false, false),
        (false, null, false),
        (null, null, null),
        (true, false, false),
        (false, true, null),
        (false, false, true)
    `)

    const metrics = await collectProfileMetrics(db)

    expect(metrics).toEqual([{ name: 'all_channels_disabled_users', value: 3 }])
  })
})
