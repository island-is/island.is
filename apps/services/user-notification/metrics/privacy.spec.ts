import { Sequelize } from 'sequelize'
import {
  DogStatsD,
  publishSnapshot,
  SnapshotMetric,
} from '@island.is/infra-metrics'
// This shared metrics test suite checks both services at the publishing boundary.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { collectProfileMetrics } from '../../user-profile/src/metrics/collect'
import { collectNotificationMetrics } from '../src/metrics/collect'
import { externalSnapshot } from '../src/metrics/external'

// Synthetic canaries only. These tests cover direct disclosure at the publisher
// boundary, not anonymity against small-cohort or time-series inference.
const privateFields = {
  national_id: '0101901234',
  recipient: '4101901234',
  email: 'privacy-canary@example.invalid',
  phone: '+3545550199',
  device_token: 'private-device-canary',
  notification_id: 'private-notification-canary',
  name: 'Private Person Canary',
  body: 'Private notification content canary',
  read_at: '2026-09-17T12:34:56.789Z',
}
const now = new Date('2026-09-24T12:00:00Z')
const day = new Date('2026-09-16T00:00:00Z')

const client = () => ({
  gauge: jest.fn(
    (
      _name: string,
      _value: number,
      _tags: Record<string, string>,
      callback: () => void,
    ) => callback(),
  ),
  close: jest.fn((callback: () => void) => callback()),
})

const publish = async (
  source: string,
  collect: () => Promise<SnapshotMetric[]>,
) => {
  const sink = client()
  await publishSnapshot(source, collect, sink as unknown as DogStatsD)
  const sent = sink.gauge.mock.calls.map(([name, value, tags]) => ({
    name,
    value,
    tags,
  }))
  const serialized = JSON.stringify(sent)
  for (const canary of Object.values(privateFields)) {
    expect(serialized).not.toContain(canary)
  }
  for (const metric of sent) {
    expect(Number.isFinite(metric.value)).toBe(true)
  }
  expect(
    sent.filter((metric) => metric.name.startsWith('collection.')),
  ).toEqual([
    {
      name: 'collection.duration_ms',
      value: expect.any(Number),
      tags: { source },
    },
    { name: 'collection.success', value: 1, tags: { source } },
    {
      name: 'collection.last_success',
      value: expect.any(Number),
      tags: { source },
    },
  ])
  expect(sink.close).toHaveBeenCalledTimes(1)
  return sent.filter((metric) => !metric.name.startsWith('collection.'))
}

describe('metrics direct-disclosure regression tests', () => {
  it('publishes only fixed profile categories, even when rows contain identifying fields', async () => {
    const rows = ['individual', 'company', 'other'].map((recipientType) => ({
      ...privateFields,
      recipient_type: recipientType,
      disabled: '2',
      known: '10',
      unknown: '1',
    }))
    rows.push({
      ...privateFields,
      recipient_type: privateFields.email,
      disabled: '1',
      known: '1',
      unknown: '0',
    })
    const db = { query: jest.fn().mockResolvedValue(rows) }
    const sent = await publish('user-profile', () =>
      collectProfileMetrics(db as unknown as Sequelize),
    )
    expect(sent).toEqual(
      ['individual', 'company', 'other'].flatMap((recipientType) => [
        {
          name: 'push.disabled_users',
          value: 2,
          tags: { source: 'user-profile', recipient_type: recipientType },
        },
        {
          name: 'push.known_users',
          value: 10,
          tags: { source: 'user-profile', recipient_type: recipientType },
        },
        {
          name: 'push.unknown_users',
          value: 1,
          tags: { source: 'user-profile', recipient_type: recipientType },
        },
      ]),
    )
  })

  it('publishes notification aggregates and period boundaries without row identifiers or read times', async () => {
    const db = {
      query: jest
        .fn()
        .mockResolvedValueOnce([
          { ...privateFields, channel: 'push', total: '10' },
          { ...privateFields, channel: privateFields.email, total: '1' },
        ])
        .mockResolvedValueOnce([{ ...privateFields, started_at: day }])
        .mockResolvedValueOnce([
          { ...privateFields, total: '10', unread: '2' },
        ]),
    }
    const source = 'user-notification'
    const sent = await publish(source, () =>
      collectNotificationMetrics(db as unknown as Sequelize, now),
    )
    expect(sent).toEqual([
      ...['push', 'email', 'sms'].map((channel) => ({
        name: 'company.deliveries_previous_day',
        value: channel === 'push' ? 10 : 0,
        tags: { source, channel, recipient_type: 'company' },
      })),
      {
        name: 'company.period_end',
        value: new Date('2026-09-24').getTime() / 1000,
        tags: { source },
      },
      ...[
        ['unread_7d.available', 1],
        ['unread_7d.total', 10],
        ['unread_7d.unread', 2],
        ['unread_7d.cohort_end', new Date('2026-09-17').getTime() / 1000],
      ].map(([name, value]) => ({
        name,
        value,
        tags: { source, kind: 'notification' },
      })),
    ])
  })

  it.each(['firebase', 'mailbox'] as const)(
    'discards extra identifying fields from %s aggregates',
    async (source) => {
      const rows =
        source === 'firebase'
          ? ['android', 'ios'].map((platform) => ({
              platform,
              received: '10',
              opened: '2',
              complete: 'true',
            }))
          : [{ total: '10', unread: '2', complete: 'true' }]
      const clean = externalSnapshot(source, rows, day)
      const withPrivateFields = externalSnapshot(
        source,
        rows.map((row) => ({ ...privateFields, ...row })),
        day,
      )
      expect(withPrivateFields).toEqual(clean)
      const sent = await publish(source, async () => withPrivateFields)
      expect(sent).toEqual([
        { name: 'external.available', value: 1, tags: { source } },
        ...(source === 'firebase'
          ? ['android', 'ios'].flatMap((platform) => [
              { name: 'push.received', value: 10, tags: { source, platform } },
              { name: 'push.opened', value: 2, tags: { source, platform } },
            ])
          : [
              {
                name: 'unread_7d.total',
                value: 10,
                tags: { source, kind: 'document' },
              },
              {
                name: 'unread_7d.unread',
                value: 2,
                tags: { source, kind: 'document' },
              },
            ]),
        {
          name: 'external.period_start',
          value: day.getTime() / 1000,
          tags: { source },
        },
      ])
    },
  )

  it.each([
    {
      platform: privateFields.device_token,
      received: '10',
      opened: '2',
      complete: 'true',
    },
    {
      platform: 'android',
      received: privateFields.email,
      opened: '2',
      complete: 'true',
    },
  ])(
    'does not echo invalid external values in errors or metrics (%#)',
    async (row) => {
      const sink = client()
      let error: unknown
      try {
        await publishSnapshot(
          'firebase',
          async () => externalSnapshot('firebase', [row], day),
          sink as unknown as DogStatsD,
        )
      } catch (caught) {
        error = caught
      }
      expect(error).toBeInstanceOf(Error)
      for (const canary of Object.values(privateFields)) {
        expect(String(error)).not.toContain(canary)
      }
      expect(
        sink.gauge.mock.calls.map(([name, value, tags]) => ({
          name,
          value,
          tags,
        })),
      ).toEqual([
        { name: 'collection.success', value: 0, tags: { source: 'firebase' } },
      ])
      expect(sink.close).toHaveBeenCalledTimes(1)
    },
  )

  it('does not copy a database error containing personal data into failure metrics', async () => {
    const sink = client()
    const failure = new Error(JSON.stringify(privateFields))
    const db = { query: jest.fn().mockRejectedValue(failure) }
    // The error is deliberately rethrown for the entrypoint to handle; this test
    // only asserts that the metric transport does not receive its contents.
    await expect(
      publishSnapshot(
        'user-profile',
        () => collectProfileMetrics(db as unknown as Sequelize),
        sink as unknown as DogStatsD,
      ),
    ).rejects.toBe(failure)
    expect(
      sink.gauge.mock.calls.map(([name, value, tags]) => ({
        name,
        value,
        tags,
      })),
    ).toEqual([
      {
        name: 'collection.success',
        value: 0,
        tags: { source: 'user-profile' },
      },
    ])
  })
})
