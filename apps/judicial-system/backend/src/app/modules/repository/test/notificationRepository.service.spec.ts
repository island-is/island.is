import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { TrackedNotificationType } from '@island.is/judicial-system/types'

import { Notification } from '../models/notification.model'
import { NotificationRepositoryService } from '../services/notificationRepository.service'

describe('NotificationRepositoryService', () => {
  const caseId = 'a5f7e3d1-0000-4000-8000-000000000001'
  const recipients = [{ address: 'recipient@example.com', success: true }]

  let service: NotificationRepositoryService
  let model: { create: jest.Mock }
  let logger: { debug: jest.Mock; error: jest.Mock }

  beforeEach(async () => {
    model = { create: jest.fn() }
    logger = { debug: jest.fn(), error: jest.fn() }

    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: LOGGER_PROVIDER, useValue: logger },
        { provide: getModelToken(Notification), useValue: model },
        NotificationRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(NotificationRepositoryService)
  })

  describe('create', () => {
    it('creates the notification and returns the created row', async () => {
      const createdNotification = { id: 'some id' } as Notification
      model.create.mockResolvedValueOnce(createdNotification)

      const result = await service.create({
        caseId,
        type: TrackedNotificationType.READY_FOR_COURT,
        recipients,
      })

      expect(model.create).toHaveBeenCalledWith({
        caseId,
        type: TrackedNotificationType.READY_FOR_COURT,
        recipients,
      })
      expect(result).toBe(createdNotification)
    })

    it('rethrows when the model fails', async () => {
      const error = new Error('Some error')
      model.create.mockRejectedValueOnce(error)

      await expect(
        service.create({
          caseId,
          type: TrackedNotificationType.READY_FOR_COURT,
          recipients,
        }),
      ).rejects.toBe(error)

      expect(logger.error).toHaveBeenCalled()
    })
  })
})
