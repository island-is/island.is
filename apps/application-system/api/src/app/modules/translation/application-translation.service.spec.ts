import {
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { Test } from '@nestjs/testing'
import type { User } from '@island.is/auth-nest-tools'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import {
  CONTENTFUL_MANAGEMENT_CLIENT,
  DEFAULT_LOCALE,
  ENGLISH_LOCALE,
  type NamespaceEntryFields,
} from '@island.is/application/api/core'

import { ApplicationTranslationService } from './application-translation.service'

const buildEntry = (
  fields: NamespaceEntryFields,
  overrides: Partial<{
    id: string
    contentTypeId: string
    createdAt: string
    updatedAt: string
    publishedVersion: number
  }> = {},
) => ({
  sys: {
    id: overrides.id ?? 'test.ns',
    version: 3,
    publishedVersion: overrides.publishedVersion,
    contentType: { sys: { id: overrides.contentTypeId ?? 'namespace' } },
    createdAt: overrides.createdAt ?? '2026-01-01T00:00:00.000Z',
    updatedAt: overrides.updatedAt ?? '2026-01-02T00:00:00.000Z',
  },
  fields,
})

const buildPublishSnapshot = (fields: NamespaceEntryFields) => ({
  sys: { snapshotType: 'publish', createdAt: '2026-01-01T12:00:00.000Z' },
  snapshot: { fields },
})

const buildLatestPublishSnapshotItem = (
  id: string,
  createdAt = '2026-02-01T10:00:00.000Z',
) => ({
  sys: { id, snapshotType: 'publish', createdAt },
})

describe('ApplicationTranslationService', () => {
  let service: ApplicationTranslationService
  let managementEntryGetSpy: jest.Mock
  let managementEntryGetManySpy: jest.Mock
  let managementEntryUpdateSpy: jest.Mock
  let managementEntryPublishSpy: jest.Mock
  let managementSnapshotGetManyForEntrySpy: jest.Mock
  let managementSnapshotGetForEntrySpy: jest.Mock
  let featureFlagGetValueSpy: jest.Mock

  const user: User = {
    nationalId: '0101302989',
    scope: [],
    authorization: '',
    client: 'test',
  }

  beforeEach(async () => {
    managementEntryGetSpy = jest.fn()
    managementEntryGetManySpy = jest.fn()
    managementEntryUpdateSpy = jest.fn()
    managementEntryPublishSpy = jest.fn()
    managementSnapshotGetManyForEntrySpy = jest
      .fn()
      .mockResolvedValue({ items: [] })
    managementSnapshotGetForEntrySpy = jest.fn()
    featureFlagGetValueSpy = jest.fn().mockResolvedValue(false)

    const module = await Test.createTestingModule({
      providers: [
        ApplicationTranslationService,
        {
          provide: CONTENTFUL_MANAGEMENT_CLIENT,
          useValue: {
            entry: {
              get: managementEntryGetSpy,
              getMany: managementEntryGetManySpy,
              update: managementEntryUpdateSpy,
              publish: managementEntryPublishSpy,
            },
            snapshot: {
              getManyForEntry: managementSnapshotGetManyForEntrySpy,
              getForEntry: managementSnapshotGetForEntrySpy,
            },
          },
        },
        {
          provide: FeatureFlagService,
          useValue: { getValue: featureFlagGetValueSpy },
        },
      ],
    }).compile()

    service = module.get<ApplicationTranslationService>(
      ApplicationTranslationService,
    )
  })

  describe('getTranslationsByNamespace', () => {
    it('throws a BadRequestException when the CMA entry does not exist at all', async () => {
      managementEntryGetSpy.mockRejectedValue({ name: 'NotFound' })
      managementEntryGetManySpy.mockResolvedValue({ items: [] })

      await expect(
        service.getTranslationsByNamespace('missing.ns'),
      ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('treats an unpublished namespace as empty published values, not an error', async () => {
      managementEntryGetSpy.mockResolvedValue(
        buildEntry({
          namespace: { [DEFAULT_LOCALE]: 'test.ns' },
          strings: {
            [DEFAULT_LOCALE]: { 'test.ns:key.one': 'Draft value' },
            [ENGLISH_LOCALE]: {},
          },
        }),
      )

      const rows = await service.getTranslationsByNamespace('test.ns')

      expect(rows).toEqual([
        expect.objectContaining({
          messageKey: 'test.ns:key.one',
          valueIs: '',
          draftValueIs: 'Draft value',
        }),
      ])
      expect(managementSnapshotGetManyForEntrySpy).not.toHaveBeenCalled()
    })

    it('does not mark a key as draft when it matches the published value', async () => {
      managementEntryGetSpy.mockResolvedValue(
        buildEntry(
          {
            namespace: { [DEFAULT_LOCALE]: 'test.ns' },
            strings: {
              [DEFAULT_LOCALE]: { 'test.ns:key.one': 'Same value' },
              [ENGLISH_LOCALE]: {},
            },
          },
          { publishedVersion: 2 },
        ),
      )
      managementSnapshotGetManyForEntrySpy.mockResolvedValue({
        items: [
          buildPublishSnapshot({
            strings: {
              [DEFAULT_LOCALE]: { 'test.ns:key.one': 'Same value' },
              [ENGLISH_LOCALE]: {},
            },
          }),
        ],
      })

      const rows = await service.getTranslationsByNamespace('test.ns')

      expect(rows).toEqual([
        expect.objectContaining({
          messageKey: 'test.ns:key.one',
          valueIs: 'Same value',
          draftValueIs: null,
        }),
      ])
    })

    it('includes a key that only has an English value', async () => {
      managementEntryGetSpy.mockResolvedValue(
        buildEntry({
          namespace: { [DEFAULT_LOCALE]: 'test.ns' },
          strings: {
            [DEFAULT_LOCALE]: {},
            [ENGLISH_LOCALE]: { 'test.ns:key.en-only': 'English only' },
          },
        }),
      )

      const rows = await service.getTranslationsByNamespace('test.ns')

      expect(rows).toEqual([
        expect.objectContaining({
          messageKey: 'test.ns:key.en-only',
          draftValueEn: 'English only',
        }),
      ])
    })

    it('resolves via the fields.namespace fallback when the direct lookup 404s', async () => {
      managementEntryGetSpy.mockRejectedValue({ name: 'NotFound' })
      managementEntryGetManySpy.mockResolvedValue({
        items: [
          buildEntry({
            namespace: { [DEFAULT_LOCALE]: 'test.ns' },
            strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
          }),
        ],
      })

      await expect(
        service.getTranslationsByNamespace('test.ns'),
      ).resolves.toEqual([])

      expect(managementEntryGetManySpy).toHaveBeenCalledWith({
        query: {
          content_type: 'namespace',
          'fields.namespace': 'test.ns',
          limit: 2,
        },
      })
    })

    it('throws when the fallback search matches more than one entry', async () => {
      managementEntryGetSpy.mockRejectedValue({ name: 'NotFound' })
      managementEntryGetManySpy.mockResolvedValue({
        items: [buildEntry({}), buildEntry({})],
      })

      await expect(
        service.getTranslationsByNamespace('test.ns'),
      ).rejects.toThrow(/Multiple Contentful namespace entries/)
    })
  })

  describe('bulkUpsertTranslations', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('throws a ServiceUnavailableException without writing when writes are disabled', async () => {
      featureFlagGetValueSpy.mockResolvedValue(true)

      await expect(
        service.bulkUpsertTranslations(
          [
            {
              namespace: 'test.ns',
              messageKey: 'test.ns:key.one',
              valueIs: 'x',
            },
          ],
          user,
        ),
      ).rejects.toBeInstanceOf(ServiceUnavailableException)

      expect(managementEntryGetSpy).not.toHaveBeenCalled()
    })

    it('returns a non-empty array even when the merge is a no-op', async () => {
      managementEntryGetSpy.mockResolvedValue(
        buildEntry({
          namespace: { [DEFAULT_LOCALE]: 'test.ns' },
          strings: {
            [DEFAULT_LOCALE]: { 'test.ns:key.one': 'Same' },
            [ENGLISH_LOCALE]: {},
          },
        }),
      )

      const resultPromise = service.bulkUpsertTranslations(
        [
          {
            namespace: 'test.ns',
            messageKey: 'test.ns:key.one',
            valueIs: 'Same',
          },
        ],
        user,
      )
      await jest.advanceTimersByTimeAsync(3000)
      const rows = await resultPromise

      expect(managementEntryUpdateSpy).not.toHaveBeenCalled()
      expect(rows).toHaveLength(1)
      expect(rows[0].messageKey).toBe('test.ns:key.one')
    })

    it('merges only the changed keys and calls entry.update with the merged strings', async () => {
      const preMergeEntry = buildEntry({
        namespace: { [DEFAULT_LOCALE]: 'test.ns' },
        strings: {
          [DEFAULT_LOCALE]: {
            'test.ns:key.one': 'Old',
            'test.ns:key.two': 'Unchanged',
          },
          [ENGLISH_LOCALE]: {},
        },
      })
      const postMergeEntry = buildEntry({
        namespace: { [DEFAULT_LOCALE]: 'test.ns' },
        strings: {
          [DEFAULT_LOCALE]: {
            'test.ns:key.one': 'New',
            'test.ns:key.two': 'Unchanged',
          },
          [ENGLISH_LOCALE]: {},
        },
      })

      managementEntryGetSpy
        .mockResolvedValueOnce(preMergeEntry)
        .mockResolvedValueOnce(postMergeEntry)
      managementEntryUpdateSpy.mockResolvedValue(postMergeEntry)

      const resultPromise = service.bulkUpsertTranslations(
        [
          {
            namespace: 'test.ns',
            messageKey: 'test.ns:key.one',
            valueIs: 'New',
          },
        ],
        user,
      )
      await jest.advanceTimersByTimeAsync(3000)
      const rows = await resultPromise

      expect(managementEntryUpdateSpy).toHaveBeenCalledWith(
        { entryId: 'test.ns' },
        expect.objectContaining({
          fields: expect.objectContaining({
            strings: expect.objectContaining({
              [DEFAULT_LOCALE]: {
                'test.ns:key.one': 'New',
                'test.ns:key.two': 'Unchanged',
              },
            }),
          }),
        }),
      )
      expect(rows).toEqual([
        expect.objectContaining({
          messageKey: 'test.ns:key.one',
          draftValueIs: 'New',
        }),
      ])
    })

    it('coalesces two calls for the same namespace within the window into one write', async () => {
      managementEntryGetSpy.mockResolvedValue(
        buildEntry({
          namespace: { [DEFAULT_LOCALE]: 'test.ns' },
          strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
        }),
      )
      managementEntryUpdateSpy.mockResolvedValue(
        buildEntry({
          namespace: { [DEFAULT_LOCALE]: 'test.ns' },
          strings: {
            [DEFAULT_LOCALE]: {
              'test.ns:key.one': 'A',
              'test.ns:key.two': 'B',
            },
            [ENGLISH_LOCALE]: {},
          },
        }),
      )

      const first = service.bulkUpsertTranslations(
        [{ namespace: 'test.ns', messageKey: 'test.ns:key.one', valueIs: 'A' }],
        user,
      )
      const second = service.bulkUpsertTranslations(
        [{ namespace: 'test.ns', messageKey: 'test.ns:key.two', valueIs: 'B' }],
        user,
      )

      await jest.advanceTimersByTimeAsync(3000)
      await Promise.all([first, second])

      expect(managementEntryUpdateSpy).toHaveBeenCalledTimes(1)
      expect(managementEntryUpdateSpy).toHaveBeenCalledWith(
        { entryId: 'test.ns' },
        expect.objectContaining({
          fields: expect.objectContaining({
            strings: expect.objectContaining({
              [DEFAULT_LOCALE]: {
                'test.ns:key.one': 'A',
                'test.ns:key.two': 'B',
              },
            }),
          }),
        }),
      )
    })

    it('throws a BadRequestException naming the namespace when the resolved entry does not match it', async () => {
      managementEntryGetSpy.mockResolvedValue(
        buildEntry({
          namespace: { [DEFAULT_LOCALE]: 'wrong.ns' },
          strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
        }),
      )

      const resultPromise = service.bulkUpsertTranslations(
        [
          {
            namespace: 'test.ns',
            messageKey: 'test.ns:key.one',
            valueIs: 'x',
          },
        ],
        user,
      )
      const expectation = expect(resultPromise).rejects.toThrow(
        /Failed to save translations for namespace\(s\): test\.ns/,
      )
      await jest.advanceTimersByTimeAsync(3000)
      await expectation

      expect(managementEntryUpdateSpy).not.toHaveBeenCalled()
    })

    it('still attempts and saves the other namespaces when one namespace fails', async () => {
      managementEntryGetSpy.mockImplementation(({ entryId }) =>
        Promise.resolve(
          entryId === 'bad.ns'
            ? buildEntry(
                {
                  namespace: { [DEFAULT_LOCALE]: 'wrong.ns' },
                  strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
                },
                { id: 'bad.ns' },
              )
            : buildEntry(
                {
                  namespace: { [DEFAULT_LOCALE]: 'good.ns' },
                  strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
                },
                { id: 'good.ns' },
              ),
        ),
      )
      managementEntryUpdateSpy.mockResolvedValue(
        buildEntry(
          {
            namespace: { [DEFAULT_LOCALE]: 'good.ns' },
            strings: {
              [DEFAULT_LOCALE]: { 'good.ns:key.one': 'x' },
              [ENGLISH_LOCALE]: {},
            },
          },
          { id: 'good.ns' },
        ),
      )

      const resultPromise = service.bulkUpsertTranslations(
        [
          { namespace: 'bad.ns', messageKey: 'bad.ns:key.one', valueIs: 'x' },
          {
            namespace: 'good.ns',
            messageKey: 'good.ns:key.one',
            valueIs: 'x',
          },
        ],
        user,
      )
      const expectation =
        expect(resultPromise).rejects.toBeInstanceOf(BadRequestException)
      await jest.advanceTimersByTimeAsync(3000)
      await jest.advanceTimersByTimeAsync(3000)
      await expectation

      expect(managementEntryUpdateSpy).toHaveBeenCalledWith(
        { entryId: 'good.ns' },
        expect.anything(),
      )
    })
  })

  describe('publishTranslations', () => {
    it('throws a ServiceUnavailableException without publishing when writes are disabled', async () => {
      featureFlagGetValueSpy.mockResolvedValue(true)

      await expect(
        service.publishTranslations('test.ns', user),
      ).rejects.toBeInstanceOf(ServiceUnavailableException)

      expect(managementEntryGetSpy).not.toHaveBeenCalled()
    })

    it('throws a BadRequestException when the entry does not exist', async () => {
      managementEntryGetSpy.mockRejectedValue({ name: 'NotFound' })
      managementEntryGetManySpy.mockResolvedValue({ items: [] })

      await expect(
        service.publishTranslations('missing.ns', user),
      ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('publishes the current entry and derives the result from the newest publish snapshot', async () => {
      const entry = buildEntry({
        namespace: { [DEFAULT_LOCALE]: 'test.ns' },
        strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
      })
      managementEntryGetSpy.mockResolvedValue(entry)
      managementEntryPublishSpy.mockResolvedValue(
        buildEntry(entry.fields, { publishedVersion: 4 }),
      )
      managementSnapshotGetManyForEntrySpy.mockResolvedValue({
        items: [buildLatestPublishSnapshotItem('snap-4')],
      })

      const result = await service.publishTranslations('test.ns', user)

      expect(managementEntryPublishSpy).toHaveBeenCalledWith(
        { entryId: 'test.ns' },
        entry,
      )
      expect(managementSnapshotGetManyForEntrySpy).toHaveBeenCalledWith({
        entryId: 'test.ns',
        query: { select: 'sys', limit: 5 },
      })
      expect(result).toEqual({
        id: 'snap-4',
        namespace: 'test.ns',
        publishedAt: new Date('2026-02-01T10:00:00.000Z'),
      })
    })

    it('retries on VersionMismatch by re-reading and re-publishing', async () => {
      const entry = buildEntry({
        namespace: { [DEFAULT_LOCALE]: 'test.ns' },
        strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
      })
      managementEntryGetSpy.mockResolvedValue(entry)
      managementEntryPublishSpy
        .mockRejectedValueOnce(
          Object.assign(new Error('conflict'), { name: 'VersionMismatch' }),
        )
        .mockResolvedValueOnce(
          buildEntry(entry.fields, { publishedVersion: 1 }),
        )
      managementSnapshotGetManyForEntrySpy.mockResolvedValue({
        items: [buildLatestPublishSnapshotItem('snap-1')],
      })

      const result = await service.publishTranslations('test.ns', user)

      expect(managementEntryGetSpy).toHaveBeenCalledTimes(2)
      expect(managementEntryPublishSpy).toHaveBeenCalledTimes(2)
      expect(result.id).toBe('snap-1')
    })

    it('picks the newest publish snapshot even when Contentful returns them out of order', async () => {
      const entry = buildEntry({
        namespace: { [DEFAULT_LOCALE]: 'test.ns' },
        strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
      })
      managementEntryGetSpy.mockResolvedValue(entry)
      managementEntryPublishSpy.mockResolvedValue(
        buildEntry(entry.fields, { publishedVersion: 4 }),
      )
      managementSnapshotGetManyForEntrySpy.mockResolvedValue({
        items: [
          buildLatestPublishSnapshotItem(
            'snap-older',
            '2026-01-01T00:00:00.000Z',
          ),
          buildLatestPublishSnapshotItem(
            'snap-newest',
            '2026-03-01T00:00:00.000Z',
          ),
          buildLatestPublishSnapshotItem(
            'snap-middle',
            '2026-02-01T00:00:00.000Z',
          ),
        ],
      })

      const result = await service.publishTranslations('test.ns', user)

      expect(result.id).toBe('snap-newest')
    })

    it('throws when no publish snapshot can be found immediately after publishing', async () => {
      const entry = buildEntry({
        namespace: { [DEFAULT_LOCALE]: 'test.ns' },
        strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
      })
      managementEntryGetSpy.mockResolvedValue(entry)
      managementEntryPublishSpy.mockResolvedValue(entry)
      managementSnapshotGetManyForEntrySpy.mockResolvedValue({ items: [] })

      await expect(
        service.publishTranslations('test.ns', user),
      ).rejects.toThrow(/No publish snapshot found/)
    })
  })

  describe('getPublishHistory', () => {
    it('returns publish-type snapshots, newest first, requesting select: sys', async () => {
      managementSnapshotGetManyForEntrySpy.mockResolvedValue({
        items: [
          {
            sys: {
              id: 'snap-old',
              snapshotType: 'publish',
              createdAt: '2026-01-01T00:00:00.000Z',
            },
          },
          {
            sys: {
              id: 'snap-new',
              snapshotType: 'publish',
              createdAt: '2026-02-01T00:00:00.000Z',
            },
          },
          {
            sys: {
              id: 'snap-other',
              snapshotType: 'archive',
              createdAt: '2026-01-15T00:00:00.000Z',
            },
          },
        ],
      })

      const history = await service.getPublishHistory('test.ns')

      expect(managementSnapshotGetManyForEntrySpy).toHaveBeenCalledWith({
        entryId: 'test.ns',
        query: { select: 'sys', limit: 100, skip: 0 },
      })
      expect(history.map((h) => h.id)).toEqual(['snap-new', 'snap-old'])
    })

    it('pages through multiple snapshot pages until a short page is seen', async () => {
      const page = (id: string) => ({
        sys: {
          id,
          snapshotType: 'publish',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      })
      managementSnapshotGetManyForEntrySpy
        .mockResolvedValueOnce({
          items: Array.from({ length: 100 }, (_, i) => page(`snap-${i}`)),
        })
        .mockResolvedValueOnce({ items: [page('snap-last')] })

      const history = await service.getPublishHistory('test.ns')

      expect(managementSnapshotGetManyForEntrySpy).toHaveBeenCalledTimes(2)
      expect(managementSnapshotGetManyForEntrySpy).toHaveBeenNthCalledWith(2, {
        entryId: 'test.ns',
        query: { select: 'sys', limit: 100, skip: 100 },
      })
      expect(history).toHaveLength(101)
    })
  })

  describe('rollbackToPublish', () => {
    it('returns null when the target snapshot does not exist', async () => {
      managementSnapshotGetForEntrySpy.mockRejectedValue({ name: 'NotFound' })

      await expect(
        service.rollbackToPublish('missing-snap', 'test.ns', user),
      ).resolves.toBeNull()

      expect(managementEntryGetSpy).not.toHaveBeenCalled()
    })

    it('throws a ServiceUnavailableException without reading the entry when writes are disabled', async () => {
      featureFlagGetValueSpy.mockResolvedValue(true)

      await expect(
        service.rollbackToPublish('snap-id', 'test.ns', user),
      ).rejects.toBeInstanceOf(ServiceUnavailableException)

      expect(managementSnapshotGetForEntrySpy).not.toHaveBeenCalled()
    })

    it('restores target values and blanks keys absent from the target, without removing them', async () => {
      managementSnapshotGetForEntrySpy.mockResolvedValue({
        snapshot: {
          fields: {
            strings: {
              [DEFAULT_LOCALE]: { 'test.ns:key.one': 'Old value' },
              [ENGLISH_LOCALE]: { 'test.ns:key.one': 'Old value en' },
            },
          },
        },
      })
      const currentEntry = buildEntry({
        namespace: { [DEFAULT_LOCALE]: 'test.ns' },
        strings: {
          [DEFAULT_LOCALE]: {
            'test.ns:key.one': 'New value',
            'test.ns:key.two': 'Added after the snapshot',
          },
          [ENGLISH_LOCALE]: {},
        },
      })
      managementEntryGetSpy.mockResolvedValue(currentEntry)
      const updatedEntry = buildEntry(currentEntry.fields)
      managementEntryUpdateSpy.mockResolvedValue(updatedEntry)
      managementEntryPublishSpy.mockResolvedValue(
        buildEntry(currentEntry.fields, { publishedVersion: 7 }),
      )
      managementSnapshotGetManyForEntrySpy.mockResolvedValue({
        items: [buildLatestPublishSnapshotItem('snap-7')],
      })

      const result = await service.rollbackToPublish('snap-id', 'test.ns', user)

      expect(managementEntryUpdateSpy).toHaveBeenCalledWith(
        { entryId: 'test.ns' },
        expect.objectContaining({
          fields: expect.objectContaining({
            strings: {
              [DEFAULT_LOCALE]: {
                'test.ns:key.one': 'Old value',
                'test.ns:key.two': '',
              },
              [ENGLISH_LOCALE]: {
                'test.ns:key.one': 'Old value en',
                'test.ns:key.two': '',
              },
            },
          }),
        }),
      )
      expect(managementEntryPublishSpy).toHaveBeenCalledWith(
        { entryId: 'test.ns' },
        updatedEntry,
      )
      expect(result).toEqual({
        id: 'snap-7',
        namespace: 'test.ns',
        publishedAt: new Date('2026-02-01T10:00:00.000Z'),
      })
    })
  })
})
