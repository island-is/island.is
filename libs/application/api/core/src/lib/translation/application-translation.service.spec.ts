import { BadRequestException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import { Sequelize } from 'sequelize-typescript'
import { UniqueConstraintError } from 'sequelize'
import type { User } from '@island.is/auth-nest-tools'

import { ApplicationTranslationService } from './application-translation.service'
import { ApplicationTranslation } from './application-translation.model'
import { ApplicationTranslationLog } from './application-translation-log.model'
import { ApplicationTranslationPublish } from './application-translation-publish.model'
import { ApplicationTranslationPublishSnapshot } from './application-translation-publish-snapshot.model'
import { CONTENTFUL_MANAGEMENT_CLIENT } from './contentful/contentful-translation.constants'
import {
  DEFAULT_LOCALE,
  ENGLISH_LOCALE,
  NamespaceEntryFields,
} from './contentful/contentful-translation.types'
import {
  TranslationContentfulEntryMismatchException,
  TranslationContentfulMigrationGuardException,
  TranslationNamespaceNotExtractedException,
} from './translation-contentful.exceptions'

const mockTransaction = { LOCK: { UPDATE: 'UPDATE' } }

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

describe('ApplicationTranslationService', () => {
  let service: ApplicationTranslationService
  let findOneSpy: jest.Mock
  let createTranslationSpy: jest.Mock
  let findAllTranslationsSpy: jest.Mock
  let createLogSpy: jest.Mock
  let createPublishSpy: jest.Mock
  let findByPkPublishSpy: jest.Mock
  let bulkCreateSnapshotSpy: jest.Mock
  let sequelizeTransactionSpy: jest.Mock
  let managementEntryGetSpy: jest.Mock
  let managementEntryGetManySpy: jest.Mock
  let managementEntryUpdateSpy: jest.Mock
  let managementSnapshotGetManyForEntrySpy: jest.Mock

  const user: User = {
    nationalId: '0101302989',
    scope: [],
    authorization: '',
    client: 'test',
  }

  const applyUpdate = (row: Record<string, unknown>) =>
    jest.fn(async (updates: Record<string, unknown>) => {
      Object.assign(row, updates)
    })

  beforeEach(async () => {
    findOneSpy = jest.fn()
    createTranslationSpy = jest.fn()
    findAllTranslationsSpy = jest.fn()
    createLogSpy = jest.fn()
    createPublishSpy = jest.fn()
    findByPkPublishSpy = jest.fn()
    bulkCreateSnapshotSpy = jest.fn()
    sequelizeTransactionSpy = jest.fn(
      async (callback: (t: typeof mockTransaction) => unknown) =>
        callback(mockTransaction),
    )
    managementEntryGetSpy = jest.fn()
    managementEntryGetManySpy = jest.fn()
    managementEntryUpdateSpy = jest.fn()
    managementSnapshotGetManyForEntrySpy = jest
      .fn()
      .mockResolvedValue({ items: [] })

    const module = await Test.createTestingModule({
      providers: [
        ApplicationTranslationService,
        {
          provide: getModelToken(ApplicationTranslation),
          useValue: {
            findOne: findOneSpy,
            create: createTranslationSpy,
            findAll: findAllTranslationsSpy,
            findByPk: jest.fn(),
          },
        },
        {
          provide: getModelToken(ApplicationTranslationLog),
          useValue: { create: createLogSpy },
        },
        {
          provide: getModelToken(ApplicationTranslationPublish),
          useValue: {
            create: createPublishSpy,
            findAll: jest.fn(),
            findByPk: findByPkPublishSpy,
          },
        },
        {
          provide: getModelToken(ApplicationTranslationPublishSnapshot),
          useValue: { bulkCreate: bulkCreateSnapshotSpy },
        },
        {
          provide: Sequelize,
          useValue: {
            transaction: sequelizeTransactionSpy,
            fn: jest.fn((name: string) => name),
            col: jest.fn((name: string) => name),
            literal: jest.fn((sql: string) => sql),
          },
        },
        {
          provide: CONTENTFUL_MANAGEMENT_CLIENT,
          useValue: {
            entry: {
              get: managementEntryGetSpy,
              getMany: managementEntryGetManySpy,
              update: managementEntryUpdateSpy,
            },
            snapshot: {
              getManyForEntry: managementSnapshotGetManyForEntrySpy,
            },
          },
        },
      ],
    }).compile()

    service = module.get<ApplicationTranslationService>(
      ApplicationTranslationService,
    )
  })

  describe('getTranslationsForAllLocales', () => {
    it('returns published Icelandic and English strings in one pass', async () => {
      findAllTranslationsSpy.mockResolvedValue([
        {
          messageKey: 'test.ns:key.both',
          valueIs: 'Íslenska',
          valueEn: 'English',
        },
        {
          messageKey: 'test.ns:key.fallback',
          valueIs: 'Aðeins íslenska',
          valueEn: null,
        },
        {
          messageKey: 'test.ns:key.empty',
          valueIs: '',
          valueEn: '',
        },
        {
          messageKey: 'test.ns:key.clearedEn',
          valueIs: 'Íslenska',
          valueEn: '',
        },
      ])

      await expect(
        service.getTranslationsForAllLocales('test.ns'),
      ).resolves.toEqual({
        is: {
          'test.ns:key.both': 'Íslenska',
          'test.ns:key.fallback': 'Aðeins íslenska',
          'test.ns:key.clearedEn': 'Íslenska',
        },
        en: {
          'test.ns:key.both': 'English',
          'test.ns:key.fallback': 'Aðeins íslenska',
          'test.ns:key.clearedEn': 'Íslenska',
        },
      })

      expect(findAllTranslationsSpy).toHaveBeenCalledWith({
        where: { namespace: 'test.ns' },
        attributes: ['messageKey', 'valueIs', 'valueEn'],
      })
    })
  })

  describe('getTranslationsForNamespace', () => {
    it('returns a single locale from the bilingual result', async () => {
      findAllTranslationsSpy.mockResolvedValue([
        {
          messageKey: 'test.ns:key.both',
          valueIs: 'Íslenska',
          valueEn: 'English',
        },
      ])

      await expect(
        service.getTranslationsForNamespace('test.ns', 'en'),
      ).resolves.toEqual({
        'test.ns:key.both': 'English',
      })
    })
  })

  describe('upsertTranslation', () => {
    it('rejects message keys outside the authorized namespace', async () => {
      await expect(
        service.upsertTranslation(
          {
            namespace: 'ra.application',
            messageKey: 'application.system:button.next',
            valueEn: 'Hijack',
          },
          user,
        ),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(findOneSpy).not.toHaveBeenCalled()
      expect(createTranslationSpy).not.toHaveBeenCalled()
    })

    it('creates a row with empty published valueIs and draft content only', async () => {
      findOneSpy.mockResolvedValue(null)
      createTranslationSpy.mockResolvedValue({ id: 'new-id' })

      await service.upsertTranslation(
        {
          namespace: 'test.ns',
          messageKey: 'test.ns:key.one',
          valueIs: 'Draft Icelandic',
          valueEn: 'Draft English',
        },
        user,
      )

      expect(createTranslationSpy).toHaveBeenCalledWith({
        namespace: 'test.ns',
        messageKey: 'test.ns:key.one',
        valueIs: '',
        draftValueIs: 'Draft Icelandic',
        draftValueEn: 'Draft English',
        translatedBy: '0101302989',
        isReviewed: false,
      })

      expect(createLogSpy).toHaveBeenCalledWith({
        translationId: 'new-id',
        newValue: 'Draft Icelandic',
        changedBy: '0101302989',
        action: 'create',
      })
    })

    it('updates only draft columns on existing rows', async () => {
      const existing: Record<string, unknown> = {
        id: 'existing-id',
        valueIs: 'Published Icelandic',
        valueEn: 'Published English',
        draftValueIs: undefined,
        draftValueEn: undefined,
      }
      existing.update = applyUpdate(existing)
      findOneSpy.mockResolvedValue(existing)

      await service.upsertTranslation(
        {
          namespace: 'test.ns',
          messageKey: 'test.ns:key.one',
          valueIs: 'Draft Icelandic',
        },
        user,
      )

      expect(existing.update).toHaveBeenCalledWith({
        draftValueIs: 'Draft Icelandic',
        translatedBy: '0101302989',
        isReviewed: false,
      })
      expect(createTranslationSpy).not.toHaveBeenCalled()
    })

    it('recovers from a unique-constraint race by updating the existing row', async () => {
      findOneSpy.mockResolvedValueOnce(null).mockResolvedValueOnce({
        id: 'raced-id',
        draftValueIs: undefined,
        draftValueEn: undefined,
        valueIs: '',
        valueEn: null,
        update: jest.fn().mockResolvedValue(undefined),
      })
      createTranslationSpy.mockRejectedValue(new UniqueConstraintError({}))

      const raced = await service.upsertTranslation(
        {
          namespace: 'test.ns',
          messageKey: 'test.ns:key.one',
          valueEn: 'Draft English',
        },
        user,
      )

      expect(raced.id).toBe('raced-id')
      expect(raced.update).toHaveBeenCalledWith({
        draftValueEn: 'Draft English',
        translatedBy: '0101302989',
        isReviewed: false,
      })
    })
  })

  describe('getTranslationsByNamespace', () => {
    it('throws TranslationNamespaceNotExtractedException when the CMA entry does not exist at all', async () => {
      managementEntryGetSpy.mockRejectedValue({ name: 'NotFound' })
      managementEntryGetManySpy.mockResolvedValue({ items: [] })

      await expect(
        service.getTranslationsByNamespace('missing.ns'),
      ).rejects.toBeInstanceOf(TranslationNamespaceNotExtractedException)
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

      const rows = await service.bulkUpsertTranslations(
        [
          {
            namespace: 'test.ns',
            messageKey: 'test.ns:key.one',
            valueIs: 'Same',
          },
        ],
        user,
      )

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

      const rows = await service.bulkUpsertTranslations(
        [
          {
            namespace: 'test.ns',
            messageKey: 'test.ns:key.one',
            valueIs: 'New',
          },
        ],
        user,
      )

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

    it('throws TranslationContentfulEntryMismatchException when the resolved entry does not match the namespace', async () => {
      managementEntryGetSpy.mockResolvedValue(
        buildEntry({
          namespace: { [DEFAULT_LOCALE]: 'wrong.ns' },
          strings: { [DEFAULT_LOCALE]: {}, [ENGLISH_LOCALE]: {} },
        }),
      )

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
      ).rejects.toBeInstanceOf(TranslationContentfulEntryMismatchException)

      expect(managementEntryUpdateSpy).not.toHaveBeenCalled()
    })
  })

  describe('publishTranslations', () => {
    it('is disabled and does not touch Postgres', async () => {
      await expect(
        service.publishTranslations('test.ns', user),
      ).rejects.toBeInstanceOf(TranslationContentfulMigrationGuardException)

      expect(sequelizeTransactionSpy).not.toHaveBeenCalled()
      expect(createPublishSpy).not.toHaveBeenCalled()
    })
  })

  describe('getPublishHistory', () => {
    it('is disabled', async () => {
      await expect(
        service.getPublishHistory('test.ns'),
      ).rejects.toBeInstanceOf(TranslationContentfulMigrationGuardException)
    })
  })

  describe('rollbackToPublish', () => {
    it('is disabled and does not touch Postgres', async () => {
      await expect(
        service.rollbackToPublish('publish-id', 'test.ns', user),
      ).rejects.toBeInstanceOf(TranslationContentfulMigrationGuardException)

      expect(sequelizeTransactionSpy).not.toHaveBeenCalled()
      expect(findByPkPublishSpy).not.toHaveBeenCalled()
    })
  })
})
