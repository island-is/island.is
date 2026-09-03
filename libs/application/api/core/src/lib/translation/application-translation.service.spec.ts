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

const mockTransaction = { LOCK: { UPDATE: 'UPDATE' } }

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

  describe('bulkUpsertTranslations', () => {
    it('runs upserts inside a transaction', async () => {
      findOneSpy.mockResolvedValue(null)
      createTranslationSpy.mockResolvedValue({ id: 'new-id' })

      await service.bulkUpsertTranslations(
        [
          {
            namespace: 'test.ns',
            messageKey: 'test.ns:key.one',
            valueIs: 'Draft',
          },
        ],
        user,
      )

      expect(sequelizeTransactionSpy).toHaveBeenCalledTimes(1)
      expect(createTranslationSpy).toHaveBeenCalledWith(
        expect.objectContaining({ messageKey: 'test.ns:key.one' }),
        { transaction: mockTransaction },
      )
    })
  })

  describe('publishTranslations', () => {
    it('copies drafts to published columns, snapshots the published version, and logs pre-update values', async () => {
      const row: Record<string, unknown> = {
        id: 'row-id',
        messageKey: 'test.ns:key.one',
        valueIs: 'Old published',
        valueEn: 'Old English',
        draftValueIs: 'New published',
        draftValueEn: 'New English',
      }
      row.update = applyUpdate(row)

      findAllTranslationsSpy.mockResolvedValue([row])
      createPublishSpy.mockResolvedValue({ id: 'publish-id' })

      await service.publishTranslations('test.ns', user)

      expect(sequelizeTransactionSpy).toHaveBeenCalledTimes(1)
      expect(findAllTranslationsSpy).toHaveBeenCalledWith({
        where: { namespace: 'test.ns' },
        transaction: mockTransaction,
        lock: mockTransaction.LOCK.UPDATE,
      })
      expect(createPublishSpy).toHaveBeenCalledWith(
        expect.objectContaining({ namespace: 'test.ns' }),
        { transaction: mockTransaction },
      )
      expect(row.update).toHaveBeenCalledWith(
        {
          draftValueIs: null,
          draftValueEn: null,
          valueIs: 'New published',
          valueEn: 'New English',
        },
        { transaction: mockTransaction },
      )
      expect(bulkCreateSnapshotSpy).toHaveBeenCalledWith(
        [
          {
            publishId: 'publish-id',
            messageKey: 'test.ns:key.one',
            valueIs: 'New published',
            valueEn: 'New English',
          },
        ],
        { transaction: mockTransaction },
      )

      expect(createLogSpy).toHaveBeenCalledWith(
        {
          translationId: 'row-id',
          oldValue: 'Old published',
          newValue: 'New published',
          changedBy: '0101302989',
          action: 'publish',
        },
        { transaction: mockTransaction },
      )
    })

    it('skips no-op updates when there are no drafts', async () => {
      const updateSpy = jest.fn().mockResolvedValue(undefined)
      const row = {
        id: 'row-id',
        messageKey: 'test.ns:key.one',
        valueIs: 'Published',
        valueEn: null,
        draftValueIs: null,
        draftValueEn: null,
        update: updateSpy,
      }

      findAllTranslationsSpy.mockResolvedValue([row])
      createPublishSpy.mockResolvedValue({ id: 'publish-id' })

      await service.publishTranslations('test.ns', user)

      expect(updateSpy).not.toHaveBeenCalled()
      expect(createLogSpy).not.toHaveBeenCalled()
      expect(bulkCreateSnapshotSpy).toHaveBeenCalledWith(
        [
          {
            publishId: 'publish-id',
            messageKey: 'test.ns:key.one',
            valueIs: 'Published',
            valueEn: null,
          },
        ],
        { transaction: mockTransaction },
      )
    })

    it('rejects when a translation update fails so history is not committed', async () => {
      const firstUpdate = jest.fn().mockResolvedValue(undefined)
      const secondUpdate = jest
        .fn()
        .mockRejectedValue(new Error('update failed'))
      findAllTranslationsSpy.mockResolvedValue([
        {
          id: 'row-1',
          messageKey: 'test.ns:key.one',
          valueIs: 'Old 1',
          valueEn: 'Old En 1',
          draftValueIs: 'New 1',
          draftValueEn: 'New En 1',
          update: firstUpdate,
        },
        {
          id: 'row-2',
          messageKey: 'test.ns:key.two',
          valueIs: 'Old 2',
          valueEn: 'Old En 2',
          draftValueIs: 'New 2',
          draftValueEn: 'New En 2',
          update: secondUpdate,
        },
      ])
      createPublishSpy.mockResolvedValue({ id: 'publish-id' })

      await expect(
        service.publishTranslations('test.ns', user),
      ).rejects.toThrow('update failed')

      expect(createPublishSpy).toHaveBeenCalledWith(expect.anything(), {
        transaction: mockTransaction,
      })
      expect(firstUpdate).toHaveBeenCalledWith(expect.anything(), {
        transaction: mockTransaction,
      })
      expect(secondUpdate).toHaveBeenCalledWith(expect.anything(), {
        transaction: mockTransaction,
      })
    })

    it('rejects when an audit-log write fails so history is not committed', async () => {
      const row: Record<string, unknown> = {
        id: 'row-id',
        messageKey: 'test.ns:key.one',
        valueIs: 'Old published',
        valueEn: 'Old English',
        draftValueIs: 'New published',
        draftValueEn: 'New English',
      }
      row.update = applyUpdate(row)
      findAllTranslationsSpy.mockResolvedValue([row])
      createPublishSpy.mockResolvedValue({ id: 'publish-id' })
      createLogSpy.mockRejectedValue(new Error('log failed'))

      await expect(
        service.publishTranslations('test.ns', user),
      ).rejects.toThrow('log failed')

      expect(createLogSpy).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'publish' }),
        { transaction: mockTransaction },
      )
    })
  })

  describe('rollbackToPublish', () => {
    it('logs pre-rollback published values in audit log', async () => {
      findByPkPublishSpy.mockResolvedValue({
        id: 'publish-id',
        namespace: 'test.ns',
        publishedAt: new Date('2026-01-01T00:00:00.000Z'),
        snapshots: [
          {
            messageKey: 'test.ns:key.one',
            valueIs: 'Snapshot Icelandic',
            valueEn: 'Snapshot English',
          },
        ],
      })

      const row: Record<string, unknown> = {
        id: 'row-id',
        messageKey: 'test.ns:key.one',
        valueIs: 'Current published',
        valueEn: 'Current English',
      }
      row.update = applyUpdate(row)
      findAllTranslationsSpy.mockResolvedValue([row])
      createPublishSpy.mockResolvedValue({ id: 'rollback-publish-id' })

      await service.rollbackToPublish('publish-id', 'test.ns', user)

      expect(sequelizeTransactionSpy).toHaveBeenCalledTimes(1)
      expect(findByPkPublishSpy).toHaveBeenCalledWith('publish-id', {
        include: [ApplicationTranslationPublishSnapshot],
        transaction: mockTransaction,
      })
      expect(row.update).toHaveBeenCalledWith(
        {
          valueIs: 'Snapshot Icelandic',
          valueEn: 'Snapshot English',
          draftValueIs: null,
          draftValueEn: null,
        },
        { transaction: mockTransaction },
      )
      expect(createLogSpy).toHaveBeenCalledWith(
        {
          translationId: 'row-id',
          oldValue: 'Current published',
          newValue: 'Snapshot Icelandic',
          changedBy: '0101302989',
          action: 'rollback',
        },
        { transaction: mockTransaction },
      )
    })

    it('clears keys added after the restored publish', async () => {
      findByPkPublishSpy.mockResolvedValue({
        id: 'publish-id',
        namespace: 'test.ns',
        publishedAt: new Date('2026-01-01T00:00:00.000Z'),
        snapshots: [
          {
            messageKey: 'test.ns:key.one',
            valueIs: 'Snapshot Icelandic',
            valueEn: 'Snapshot English',
          },
        ],
      })

      const kept: Record<string, unknown> = {
        id: 'row-1',
        messageKey: 'test.ns:key.one',
        valueIs: 'Current 1',
        valueEn: 'Current En 1',
      }
      kept.update = applyUpdate(kept)
      const extra: Record<string, unknown> = {
        id: 'row-2',
        messageKey: 'test.ns:key.later',
        valueIs: 'Added later',
        valueEn: 'Added later EN',
        draftValueIs: 'Unsaved draft',
        draftValueEn: 'Unsaved EN',
      }
      extra.update = applyUpdate(extra)

      findAllTranslationsSpy.mockResolvedValue([kept, extra])
      createPublishSpy.mockResolvedValue({ id: 'rollback-publish-id' })

      await service.rollbackToPublish('publish-id', 'test.ns', user)

      expect(extra.update).toHaveBeenCalledWith(
        {
          valueIs: '',
          valueEn: null,
          draftValueIs: null,
          draftValueEn: null,
        },
        { transaction: mockTransaction },
      )
    })

    it('rejects when a translation update fails so history is not committed', async () => {
      findByPkPublishSpy.mockResolvedValue({
        id: 'publish-id',
        namespace: 'test.ns',
        publishedAt: new Date('2026-01-01T00:00:00.000Z'),
        snapshots: [
          {
            messageKey: 'test.ns:key.one',
            valueIs: 'Snapshot Icelandic',
            valueEn: 'Snapshot English',
          },
          {
            messageKey: 'test.ns:key.two',
            valueIs: 'Snapshot 2',
            valueEn: 'Snapshot En 2',
          },
        ],
      })

      const firstUpdate = jest.fn().mockResolvedValue(undefined)
      const secondUpdate = jest
        .fn()
        .mockRejectedValue(new Error('update failed'))
      findAllTranslationsSpy.mockResolvedValue([
        {
          id: 'row-1',
          messageKey: 'test.ns:key.one',
          valueIs: 'Current 1',
          valueEn: 'Current En 1',
          update: firstUpdate,
        },
        {
          id: 'row-2',
          messageKey: 'test.ns:key.two',
          valueIs: 'Current 2',
          valueEn: 'Current En 2',
          update: secondUpdate,
        },
      ])
      createPublishSpy.mockResolvedValue({ id: 'rollback-publish-id' })

      await expect(
        service.rollbackToPublish('publish-id', 'test.ns', user),
      ).rejects.toThrow('update failed')

      expect(createPublishSpy).toHaveBeenCalledWith(expect.anything(), {
        transaction: mockTransaction,
      })
      expect(firstUpdate).toHaveBeenCalledWith(expect.anything(), {
        transaction: mockTransaction,
      })
    })

    it('rejects when an audit-log write fails so history is not committed', async () => {
      findByPkPublishSpy.mockResolvedValue({
        id: 'publish-id',
        namespace: 'test.ns',
        publishedAt: new Date('2026-01-01T00:00:00.000Z'),
        snapshots: [
          {
            messageKey: 'test.ns:key.one',
            valueIs: 'Snapshot Icelandic',
            valueEn: 'Snapshot English',
          },
        ],
      })
      findAllTranslationsSpy.mockResolvedValue([
        {
          id: 'row-id',
          messageKey: 'test.ns:key.one',
          valueIs: 'Current published',
          valueEn: 'Current English',
          update: jest.fn().mockResolvedValue(undefined),
        },
      ])
      createPublishSpy.mockResolvedValue({ id: 'rollback-publish-id' })
      createLogSpy.mockRejectedValue(new Error('log failed'))

      await expect(
        service.rollbackToPublish('publish-id', 'test.ns', user),
      ).rejects.toThrow('log failed')

      expect(createLogSpy).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'rollback' }),
        { transaction: mockTransaction },
      )
    })
  })
})
