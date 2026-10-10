import { randomUUID } from 'crypto'
import { QueryTypes, Sequelize, DataTypes } from 'sequelize'
import { collectNotificationMetrics } from '../src/metrics/collect'

const migration = require('../migrations/20260924120000-notification-read-metrics')
const indexes = require('../migrations/20260924120100-notification-metrics-indexes')

// Use a disposable PostgreSQL database. All fixtures live in a unique schema.
const databaseUrl = process.env.METRICS_TEST_DATABASE_URL
const describeDatabase = databaseUrl ? describe : describe.skip
describeDatabase('metrics PostgreSQL integration', () => {
  const schema = `metrics_test_${randomUUID().replace(/-/g, '')}`
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
      CREATE TABLE user_notification (id serial PRIMARY KEY, recipient text, created timestamptz NOT NULL, read boolean NOT NULL DEFAULT false);
      CREATE TABLE notification_delivery (id serial PRIMARY KEY, user_notification_id integer REFERENCES user_notification(id), channel text, created timestamptz NOT NULL);
    `)
    await migration.up(db.getQueryInterface(), DataTypes)
    await indexes.up(db.getQueryInterface())
  })
  afterAll(async () => {
    if (db) {
      await db.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
      await db.close()
    }
  })

  it('records first reads atomically, including bulk reads, and never overwrites them', async () => {
    await db.query(
      "INSERT INTO user_notification (id, recipient, created) VALUES (1, '0101901234', now()), (2, '0101901234', now())",
    )
    await db.query(
      'UPDATE user_notification SET read = true WHERE read = false',
    )
    const first = await db.query<{ id: number; read_at: Date }>(
      'SELECT id, read_at FROM user_notification ORDER BY id',
      { type: QueryTypes.SELECT },
    )
    expect(first.every((row) => row.read_at instanceof Date)).toBe(true)
    await db.query('UPDATE user_notification SET read = false, read_at = NULL')
    await db.query('UPDATE user_notification SET read = true')
    const second = await db.query(
      'SELECT id, read_at FROM user_notification ORDER BY id',
      { type: QueryTypes.SELECT },
    )
    expect(second).toEqual(first)
  })

  it('counts real deliveries by the owning company without multiplying destinations', async () => {
    await db.query(`INSERT INTO user_notification (id, recipient, created) VALUES (3, '4101901234', now()), (4, '0101901234', now()), (5, 'bad-id', now());
      INSERT INTO notification_delivery (user_notification_id, channel, created) VALUES
      (3, 'push', '2026-09-23T00:00:00Z'), (3, 'push', '2026-09-23T23:59:59Z'),
      (3, 'email', '2026-09-23T12:00:00Z'), (3, 'sms', '2026-09-24T00:00:00Z'),
      (4, 'push', '2026-09-23T12:00:00Z'), (5, 'push', '2026-09-23T12:00:00Z')`)
    const metrics = await collectNotificationMetrics(
      db,
      new Date('2026-09-24T12:00:00Z'),
    )
    expect(
      metrics
        .filter((m) => m.name === 'company.deliveries_previous_day')
        .map((m) => m.value),
    ).toEqual([2, 1, 0])
  })

  it('counts never-read and late-read notifications, but not reads on the deadline', async () => {
    // Fixture timestamps are synthetic: disable the trigger only in this private schema.
    await db.query(`ALTER TABLE user_notification DISABLE TRIGGER notification_first_read;
      INSERT INTO user_notification (id, recipient, created, read, read_at) VALUES
      (10, '0101901234', '2026-09-16T12:00:00Z', false, NULL),
      (11, '0101901234', '2026-09-16T12:00:00Z', true, '2026-09-23T12:00:01Z'),
      (12, '0101901234', '2026-09-16T12:00:00Z', true, '2026-09-23T12:00:00Z'),
      (13, '0101901234', '2026-09-16T12:00:00Z', false, '2026-09-17T12:00:00Z');
      ALTER TABLE user_notification ENABLE TRIGGER notification_first_read;
      UPDATE notification_metrics_coverage SET started_at = '2026-09-15T00:00:00Z'`)
    const metrics = await collectNotificationMetrics(
      db,
      new Date('2026-09-24T12:00:00Z'),
    )
    expect(metrics.find((m) => m.name === 'unread_7d.total')?.value).toBe(4)
    expect(metrics.find((m) => m.name === 'unread_7d.unread')?.value).toBe(2)
  })

  it('rolls back the new database objects', async () => {
    await indexes.down(db.getQueryInterface())
    await migration.down(db.getQueryInterface())
    const columns = await db
      .getQueryInterface()
      .describeTable('user_notification')
    expect(columns.read_at).toBeUndefined()
  })
})
