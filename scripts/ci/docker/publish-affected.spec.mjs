import { describe, expect, test } from '@jest/globals'
import { buildApps, buildRecord } from './publish-affected.mjs'

// Shape of /tmp/data.json rows (write-data.mjs output): one object per built
// app carrying imageName + imageTag (plus id/value/project/target we ignore).
const dataRows = [
  {
    id: 'api',
    value: 'build',
    project: 'api',
    target: 'output-express',
    imageName: 'api',
    imageTag: 'feat-x_91a1ea64bc_149561',
  },
  {
    id: 'web',
    value: 'build',
    project: 'web',
    target: 'output-next',
    imageName: 'web',
    imageTag: 'feat-x_91a1ea64bc_149561',
  },
]

describe('publish-affected.mjs', () => {
  describe('buildApps', () => {
    test('maps data.json rows to {name, imageTag}', () => {
      expect(buildApps(dataRows)).toEqual([
        { name: 'api', imageTag: 'feat-x_91a1ea64bc_149561' },
        { name: 'web', imageTag: 'feat-x_91a1ea64bc_149561' },
      ])
    })

    test('drops rows missing imageName or imageTag', () => {
      expect(
        buildApps([
          { imageName: 'api', imageTag: 't1' },
          { imageName: 'noTag' },
          { imageTag: 'noName' },
          null,
        ]),
      ).toEqual([{ name: 'api', imageTag: 't1' }])
    })

    test('returns [] for a non-array', () => {
      expect(buildApps(undefined)).toEqual([])
      expect(buildApps({})).toEqual([])
    })
  })

  describe('buildRecord', () => {
    const now = 1_700_000_000

    test('builds the versioned record with a computed ttl', () => {
      const rec = buildRecord(
        {
          repository: 'island-is/island.is',
          sha: '91a1ea64bc0011223344',
          branch: 'feat/x',
          rows: dataRows,
          ttlDays: 30,
        },
        now,
      )
      expect(rec).toEqual({
        repository: 'island-is/island.is',
        sha: '91a1ea64bc0011223344',
        branch: 'feat/x',
        apps: [
          { name: 'api', imageTag: 'feat-x_91a1ea64bc_149561' },
          { name: 'web', imageTag: 'feat-x_91a1ea64bc_149561' },
        ],
        version: 1,
        ttl: now + 30 * 24 * 60 * 60,
      })
    })

    test('omits branch when not provided', () => {
      const rec = buildRecord(
        { repository: 'r', sha: 'abcdef1', rows: [], ttlDays: 1 },
        now,
      )
      expect(rec).not.toHaveProperty('branch')
      expect(rec.ttl).toBe(now + 24 * 60 * 60)
    })

    test('defaults ttl to 30 days when ttlDays omitted', () => {
      const rec = buildRecord(
        { repository: 'r', sha: 'abcdef1', rows: [] },
        now,
      )
      expect(rec.ttl).toBe(now + 30 * 24 * 60 * 60)
    })
  })
})
