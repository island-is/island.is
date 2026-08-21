import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import type { User } from '@island.is/auth-nest-tools'

import { ApplicationTranslationService } from './application-translation.service'
import { ApplicationTranslation } from './application-translation.model'
import { ApplicationTranslationLog } from './application-translation-log.model'
import { ApplicationTranslationPublish } from './application-translation-publish.model'
import { ApplicationTranslationPublishSnapshot } from './application-translation-publish-snapshot.model'

describe('ApplicationTranslationService', () => {
  let service: ApplicationTranslationService
  let findOneSpy: jest.Mock
  let createTranslationSpy: jest.Mock
  let findAllTranslationsSpy: jest.Mock
  let createLogSpy: jest.Mock
  let createPublishSpy: jest.Mock
  let bulkCreateSnapshotSpy: jest.Mock

  const user = {
    nationalId: '0101302989',
    scope: [],
    authorization: '',
    client: 'test',
  } satisfies User

  beforeEach(async () => {
    findOneSpy = jest.fn()
    createTranslationSpy = jest.fn()
    findAllTranslationsSpy = jest.fn()
    createLogSpy = jest.fn()
    createPublishSpy = jest.fn()
    bulkCreateSnapshotSpy = jest.fn()

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
            findByPk: jest.fn(),
          },
        },
        {
          provide: getModelToken(ApplicationTranslationPublishSnapshot),
          useValue: { bulkCreate: bulkCreateSnapshotSpy },
        },
      ],
    }).compile()

    service = module.get<ApplicationTranslationService>(
      ApplicationTranslationService,
    )
  })

  describe('upsertTranslation', () => {
    it('creates a row with empty published valueIs and draft content only', async () => {
      findOneSpy.mockResolvedValue(null)
      createTranslationSpy.mockResolvedValue({ id: 'new-id' })

      await service.upsertTranslation(
        {
          namespace: 'test.ns',
          messageKey: 'key.one',
          valueIs: 'Draft Icelandic',
          valueEn: 'Draft English',
        },
        user,
      )

      expect(createTranslationSpy).toHaveBeenCalledWith({
        namespace: 'test.ns',
        messageKey: 'key.one',
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
      const updateSpy = jest.fn().mockResolvedValue(undefined)
      const existing = {
        id: 'existing-id',
        valueIs: 'Published Icelandic',
        valueEn: 'Published English',
        draftValueIs: undefined,
        draftValueEn: undefined,
        update: updateSpy,
      }
      findOneSpy.mockResolvedValue(existing)

      await service.upsertTranslation(
        {
          namespace: 'test.ns',
          messageKey: 'key.one',
          valueIs: 'Draft Icelandic',
        },
        user,
      )

      expect(updateSpy).toHaveBeenCalledWith({
        draftValueIs: 'Draft Icelandic',
        translatedBy: '0101302989',
        isReviewed: false,
      })
      expect(createTranslationSpy).not.toHaveBeenCalled()
    })
  })

  describe('publishTranslations', () => {
    it('copies drafts to published columns, clears drafts with null, and logs pre-update values', async () => {
      const updateSpy = jest.fn().mockResolvedValue(undefined)
      const row = {
        id: 'row-id',
        messageKey: 'key.one',
        valueIs: 'Old published',
        valueEn: 'Old English',
        draftValueIs: 'New published',
        draftValueEn: 'New English',
        update: updateSpy,
      }

      findAllTranslationsSpy.mockResolvedValue([row])
      createPublishSpy.mockResolvedValue({ id: 'publish-id' })

      await service.publishTranslations('test.ns', user)

      expect(updateSpy).toHaveBeenCalledWith({
        draftValueIs: null,
        draftValueEn: null,
        valueIs: 'New published',
        valueEn: 'New English',
      })

      expect(createLogSpy).toHaveBeenCalledWith({
        translationId: 'row-id',
        oldValue: 'Old published',
        newValue: 'New published',
        changedBy: '0101302989',
        action: 'publish',
      })
    })

    it('clears drafts with null even when there are no draft changes', async () => {
      const updateSpy = jest.fn().mockResolvedValue(undefined)
      const row = {
        id: 'row-id',
        messageKey: 'key.one',
        valueIs: 'Published',
        valueEn: null,
        draftValueIs: null,
        draftValueEn: null,
        update: updateSpy,
      }

      findAllTranslationsSpy.mockResolvedValue([row])
      createPublishSpy.mockResolvedValue({ id: 'publish-id' })

      await service.publishTranslations('test.ns', user)

      expect(updateSpy).toHaveBeenCalledWith({
        draftValueIs: null,
        draftValueEn: null,
      })
      expect(createLogSpy).not.toHaveBeenCalled()
    })
  })

  describe('rollbackToPublish', () => {
    it('logs pre-rollback published values in audit log', async () => {
      const findByPkSpy = jest.fn().mockResolvedValue({
        id: 'publish-id',
        namespace: 'test.ns',
        publishedAt: new Date('2026-01-01T00:00:00.000Z'),
        snapshots: [
          {
            messageKey: 'key.one',
            valueIs: 'Snapshot Icelandic',
            valueEn: 'Snapshot English',
          },
        ],
      })

      const updateSpy = jest.fn().mockResolvedValue(undefined)
      const row = {
        id: 'row-id',
        messageKey: 'key.one',
        valueIs: 'Current published',
        valueEn: 'Current English',
        update: updateSpy,
      }

      const module = await Test.createTestingModule({
        providers: [
          ApplicationTranslationService,
          {
            provide: getModelToken(ApplicationTranslation),
            useValue: {
              findOne: jest.fn(),
              create: jest.fn(),
              findAll: jest.fn().mockResolvedValue([row]),
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
              create: jest
                .fn()
                .mockResolvedValue({ id: 'rollback-publish-id' }),
              findAll: jest.fn(),
              findByPk: findByPkSpy,
            },
          },
          {
            provide: getModelToken(ApplicationTranslationPublishSnapshot),
            useValue: { bulkCreate: jest.fn() },
          },
        ],
      }).compile()

      const rollbackService = module.get<ApplicationTranslationService>(
        ApplicationTranslationService,
      )

      await rollbackService.rollbackToPublish('publish-id', 'test.ns', user)

      expect(createLogSpy).toHaveBeenCalledWith({
        translationId: 'row-id',
        oldValue: 'Current published',
        newValue: 'Snapshot Icelandic',
        changedBy: '0101302989',
        action: 'rollback',
      })
    })
  })
})
