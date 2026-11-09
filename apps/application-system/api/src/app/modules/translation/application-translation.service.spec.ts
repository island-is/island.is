import {
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import type { User } from '@island.is/auth-nest-tools'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import {
  CONTENTFUL_MANAGEMENT_CLIENT,
  DEFAULT_LOCALE,
  ENGLISH_LOCALE,
  type NamespaceEntryFields,
} from '@island.is/application/api/core'

import { ApplicationTranslationService } from './application-translation.service'
import { ApplicationTranslationPublish } from './application-translation-publish.model'

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
  version = 3,
) => ({
  sys: { id, snapshotType: 'publish', createdAt },
  snapshot: { sys: { version } },
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
  let publishCreateSpy: jest.Mock
  let publishFindAllSpy: jest.Mock
  let userGetCurrentSpy: jest.Mock
  let userGetForSpaceSpy: jest.Mock

  const user: User = {
    nationalId: '0101302989',
    scope: [],
    authorization: '',
    client: 'test',
  }

  const actor = { actorName: 'Jóna Jónsdóttir', onBehalfOfName: 'Arctic 65' }

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
    publishCreateSpy = jest.fn().mockResolvedValue({})
    publishFindAllSpy = jest.fn().mockResolvedValue([])
    userGetCurrentSpy = jest
      .fn()
      .mockResolvedValue({ sys: { id: 'token-user' } })
    userGetForSpaceSpy = jest.fn()

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
            user: {
              getCurrent: userGetCurrentSpy,
              getForSpace: userGetForSpaceSpy,
            },
          },
        },
        {
          provide: getModelToken(ApplicationTranslationPublish),
          useValue: { create: publishCreateSpy, findAll: publishFindAllSpy },
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

      const error = await resultPromise.catch((e) => e)
      expect(error.getResponse()).toEqual(
        expect.objectContaining({
          failedNamespaces: ['bad.ns'],
          rows: [expect.objectContaining({ messageKey: 'good.ns:key.one' })],
        }),
      )
    })
  })

  describe('publishTranslations', () => {
    it('throws a ServiceUnavailableException without publishing when writes are disabled', async () => {
      featureFlagGetValueSpy.mockResolvedValue(true)

      await expect(
        service.publishTranslations('test.ns', user, actor),
      ).rejects.toBeInstanceOf(ServiceUnavailableException)

      expect(managementEntryGetSpy).not.toHaveBeenCalled()
    })

    it('throws a BadRequestException when the entry does not exist', async () => {
      managementEntryGetSpy.mockRejectedValue({ name: 'NotFound' })
      managementEntryGetManySpy.mockResolvedValue({ items: [] })

      await expect(
        service.publishTranslations('missing.ns', user, actor),
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

      const result = await service.publishTranslations('test.ns', user, actor)

      expect(managementEntryPublishSpy).toHaveBeenCalledWith(
        { entryId: 'test.ns' },
        entry,
      )
      expect(managementSnapshotGetManyForEntrySpy).toHaveBeenCalledWith({
        entryId: 'test.ns',
        query: { limit: 5 },
      })
      expect(result).toEqual({
        id: 'snap-4',
        namespace: 'test.ns',
        publishedAt: new Date('2026-02-01T10:00:00.000Z'),
        publishedByName: 'Jóna Jónsdóttir',
        onBehalfOfName: 'Arctic 65',
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

      const result = await service.publishTranslations('test.ns', user, actor)

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

      const result = await service.publishTranslations('test.ns', user, actor)

      expect(result.id).toBe('snap-newest')
    })

    it('still resolves, without a snapshot id, when the publish snapshot never appears', async () => {
      const entry = buildEntry({
        namespace: { [DEFAULT_LOCALE]: 'test.ns' },
        strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
      })
      const publishedEntry = buildEntry(entry.fields)
      publishedEntry.sys.publishedAt = '2026-02-01T10:00:00.000Z'
      managementEntryGetSpy.mockResolvedValue(entry)
      managementEntryPublishSpy.mockResolvedValue(publishedEntry)
      managementSnapshotGetManyForEntrySpy.mockResolvedValue({ items: [] })

      await expect(
        service.publishTranslations('test.ns', user, actor),
      ).resolves.toEqual({
        namespace: 'test.ns',
        publishedAt: new Date('2026-02-01T10:00:00.000Z'),
      })
    })

    it('still resolves when the snapshot lookup itself fails', async () => {
      const entry = buildEntry({
        namespace: { [DEFAULT_LOCALE]: 'test.ns' },
        strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
      })
      managementEntryGetSpy.mockResolvedValue(entry)
      managementEntryPublishSpy.mockResolvedValue(entry)
      managementSnapshotGetManyForEntrySpy.mockRejectedValue(
        new Error('timeout'),
      )

      const result = await service.publishTranslations('test.ns', user, actor)

      expect(result.id).toBeUndefined()
      expect(result.namespace).toBe('test.ns')
    })
  })

  describe('getPublishHistory', () => {
    it('returns publish-type snapshots, newest first, requesting select: sys', async () => {
      managementEntryGetSpy.mockResolvedValue(
        buildEntry({ namespace: { [DEFAULT_LOCALE]: 'test.ns' } }),
      )
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
        query: {
          select: 'sys',
          order: '-sys.createdAt',
          limit: 26,
          skip: 0,
        },
      })
      expect(history.items.map((h) => h.id)).toEqual(['snap-new', 'snap-old'])
      expect(history.nextSkip).toBeUndefined()
    })

    it('reads only the requested page, and offsets the next by raw snapshots', async () => {
      managementEntryGetSpy.mockResolvedValue(
        buildEntry({ namespace: { [DEFAULT_LOCALE]: 'test.ns' } }),
      )
      const snapshot = (
        id: string,
        createdAt: string,
        snapshotType: string,
      ) => ({
        sys: { id, snapshotType, createdAt },
      })
      managementSnapshotGetManyForEntrySpy.mockResolvedValue({
        items: [
          snapshot('snap-b', '2026-02-01T00:00:00.000Z', 'publish'),
          snapshot('snap-x', '2026-01-01T00:00:00.000Z', 'archive'),
          snapshot('snap-next', '2025-12-01T00:00:00.000Z', 'publish'),
        ],
      })

      const history = await service.getPublishHistory('test.ns', 2, 50)

      expect(managementSnapshotGetManyForEntrySpy).toHaveBeenCalledTimes(1)
      expect(managementSnapshotGetManyForEntrySpy).toHaveBeenCalledWith({
        entryId: 'test.ns',
        query: {
          select: 'sys',
          order: '-sys.createdAt',
          limit: 3,
          skip: 50,
        },
      })
      expect(history.items.map((h) => h.id)).toEqual(['snap-b'])
      expect(history.nextSkip).toBe(52)
    })
  })

  describe('rollbackToPublish', () => {
    it('returns null when the target snapshot does not exist', async () => {
      managementEntryGetSpy.mockResolvedValue(
        buildEntry({ namespace: { [DEFAULT_LOCALE]: 'test.ns' } }),
      )
      managementSnapshotGetForEntrySpy.mockRejectedValue({ name: 'NotFound' })

      await expect(
        service.rollbackToPublish('missing-snap', 'test.ns', user, actor),
      ).resolves.toBeNull()

      expect(managementEntryUpdateSpy).not.toHaveBeenCalled()
      expect(managementEntryPublishSpy).not.toHaveBeenCalled()
    })

    it('reads and writes the fallback entry by its sys.id, not the namespace', async () => {
      const entry = buildEntry(
        {
          namespace: { [DEFAULT_LOCALE]: 'test.ns' },
          strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
        },
        { id: 'other-id' },
      )
      managementEntryGetSpy.mockRejectedValue({ name: 'NotFound' })
      managementEntryGetManySpy.mockResolvedValue({ items: [entry] })
      managementSnapshotGetForEntrySpy.mockResolvedValue({
        sys: { createdAt: '2026-01-01T12:00:00.000Z' },
        snapshot: { fields: entry.fields },
      })
      managementEntryUpdateSpy.mockResolvedValue(entry)
      managementEntryPublishSpy.mockResolvedValue(entry)
      managementSnapshotGetManyForEntrySpy.mockResolvedValue({
        items: [buildLatestPublishSnapshotItem('snap-4')],
      })

      await service.rollbackToPublish('snap-1', 'test.ns', user, actor)

      expect(managementSnapshotGetForEntrySpy).toHaveBeenCalledWith({
        entryId: 'other-id',
        snapshotId: 'snap-1',
      })
      expect(managementEntryUpdateSpy).toHaveBeenCalledWith(
        { entryId: 'other-id' },
        expect.anything(),
      )
      expect(managementEntryPublishSpy).toHaveBeenCalledWith(
        { entryId: 'other-id' },
        entry,
      )
      expect(managementSnapshotGetManyForEntrySpy).toHaveBeenCalledWith({
        entryId: 'other-id',
        query: { limit: 5 },
      })
    })

    it('throws a ServiceUnavailableException without reading the entry when writes are disabled', async () => {
      featureFlagGetValueSpy.mockResolvedValue(true)

      await expect(
        service.rollbackToPublish('snap-id', 'test.ns', user, actor),
      ).rejects.toBeInstanceOf(ServiceUnavailableException)

      expect(managementSnapshotGetForEntrySpy).not.toHaveBeenCalled()
    })

    it('restores target values and blanks keys absent from the target, without removing them', async () => {
      managementSnapshotGetForEntrySpy.mockResolvedValue({
        sys: { createdAt: '2026-01-01T12:00:00.000Z' },
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

      const result = await service.rollbackToPublish(
        'snap-id',
        'test.ns',
        user,
        actor,
      )

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
        publishedByName: 'Jóna Jónsdóttir',
        onBehalfOfName: 'Arctic 65',
        rolledBackToPublishedAt: new Date('2026-01-01T12:00:00.000Z'),
      })
    })
  })

  describe('publish records', () => {
    const arrangePublish = () => {
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
    }

    it('records a publish against its snapshot with the actor names', async () => {
      arrangePublish()

      await service.publishTranslations('test.ns', user, actor)

      expect(publishCreateSpy).toHaveBeenCalledWith({
        namespace: 'test.ns',
        action: 'publish',
        contentfulSnapshotId: 'snap-4',
        actorName: 'Jóna Jónsdóttir',
        onBehalfOfName: 'Arctic 65',
        rolledBackToSnapshotId: undefined,
        rolledBackToPublishedAt: undefined,
      })
    })

    it('stores no on-behalf-of name when it is blank', async () => {
      arrangePublish()

      const result = await service.publishTranslations('test.ns', user, {
        actorName: 'Jóna Jónsdóttir',
        onBehalfOfName: '  ',
      })

      expect(publishCreateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ onBehalfOfName: undefined }),
      )
      expect(result.onBehalfOfName).toBeUndefined()
    })

    it('still resolves, without names, when the record cannot be written', async () => {
      arrangePublish()
      publishCreateSpy.mockRejectedValue(new Error('db down'))

      const result = await service.publishTranslations('test.ns', user, actor)

      expect(result.id).toBe('snap-4')
      expect(result.publishedByName).toBeUndefined()
    })

    it('records a rollback with the restored version and its date', async () => {
      const entry = buildEntry({
        namespace: { [DEFAULT_LOCALE]: 'test.ns' },
        strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
      })
      managementEntryGetSpy.mockResolvedValue(entry)
      managementSnapshotGetForEntrySpy.mockResolvedValue({
        sys: { createdAt: '2026-01-01T12:00:00.000Z' },
        snapshot: { fields: { strings: {} } },
      })
      managementEntryUpdateSpy.mockResolvedValue(entry)
      managementEntryPublishSpy.mockResolvedValue(
        buildEntry(entry.fields, { publishedVersion: 4 }),
      )
      managementSnapshotGetManyForEntrySpy.mockResolvedValue({
        items: [buildLatestPublishSnapshotItem('snap-7')],
      })

      await service.rollbackToPublish('snap-old', 'test.ns', user, actor)

      expect(publishCreateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'rollback',
          contentfulSnapshotId: 'snap-7',
          rolledBackToSnapshotId: 'snap-old',
          rolledBackToPublishedAt: new Date('2026-01-01T12:00:00.000Z'),
        }),
      )
    })

    describe('getPublishHistory names', () => {
      const historyItem = (
        id: string,
        createdAt: string,
        createdBy?: string,
      ) => ({
        sys: {
          id,
          snapshotType: 'publish',
          createdAt,
          ...(createdBy ? { createdBy: { sys: { id: createdBy } } } : {}),
        },
      })

      beforeEach(() => {
        managementEntryGetSpy.mockResolvedValue(
          buildEntry({ namespace: { [DEFAULT_LOCALE]: 'test.ns' } }),
        )
      })

      it('attaches names by snapshot id and leaves unrecorded snapshots bare', async () => {
        managementSnapshotGetManyForEntrySpy.mockResolvedValue({
          items: [
            historyItem('snap-old', '2026-01-01T00:00:00.000Z'),
            historyItem('snap-new', '2026-02-01T00:00:00.000Z'),
          ],
        })
        publishFindAllSpy.mockResolvedValue([
          {
            contentfulSnapshotId: 'snap-new',
            actorName: 'Jóna Jónsdóttir',
            onBehalfOfName: 'Arctic 65',
            rolledBackToPublishedAt: new Date('2026-01-01T00:00:00.000Z'),
          },
        ])

        const history = await service.getPublishHistory('test.ns')

        expect(history.items).toEqual([
          {
            id: 'snap-new',
            namespace: 'test.ns',
            publishedAt: new Date('2026-02-01T00:00:00.000Z'),
            publishedByName: 'Jóna Jónsdóttir',
            onBehalfOfName: 'Arctic 65',
            rolledBackToPublishedAt: new Date('2026-01-01T00:00:00.000Z'),
          },
          {
            id: 'snap-old',
            namespace: 'test.ns',
            publishedAt: new Date('2026-01-01T00:00:00.000Z'),
          },
        ])
      })

      it('names a publish made in Contentful, and flags one whose name is unavailable', async () => {
        managementSnapshotGetManyForEntrySpy.mockResolvedValue({
          items: [
            historyItem('snap-web', '2026-03-01T00:00:00.000Z', 'web-user'),
            historyItem('snap-token', '2026-02-01T00:00:00.000Z', 'token-user'),
            historyItem(
              'snap-denied',
              '2026-01-01T00:00:00.000Z',
              'denied-user',
            ),
          ],
        })
        userGetForSpaceSpy.mockImplementation(
          async ({ userId }: { userId: string }) => {
            if (userId === 'web-user') {
              return { firstName: 'Siggi', lastName: 'Sigurðsson' }
            }
            throw new Error('forbidden')
          },
        )

        const { items: history } = await service.getPublishHistory('test.ns')

        expect(history[0].publishedInContentfulByName).toBe('Siggi Sigurðsson')
        expect(history[1].publishedInContentfulByName).toBeUndefined()
        expect(history[1].publisherNameUnavailable).toBe(true)
        expect(history[2].publishedInContentfulByName).toBeUndefined()
        expect(history[2].publisherNameUnavailable).toBe(true)
        expect(userGetForSpaceSpy).not.toHaveBeenCalledWith({
          userId: 'token-user',
        })
      })
    })
  })
})
