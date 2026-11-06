import { Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { AppealEventType, UserRole } from '@island.is/judicial-system/types'

import { AppealEventLog } from '../models/appealEventLog.model'
import { AppealEventLogRepositoryService } from '../services/appealEventLogRepository.service'

describe('AppealEventLogRepositoryService', () => {
  const transaction = {} as Transaction
  let service: AppealEventLogRepositoryService
  let model: { findAll: jest.Mock; create: jest.Mock; destroy: jest.Mock }

  beforeEach(async () => {
    model = {
      findAll: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({ id: 'some-event-log-id' }),
      destroy: jest.fn().mockResolvedValue(0),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(AppealEventLog), useValue: model },
        AppealEventLogRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(AppealEventLogRepositoryService)
  })

  describe('findAllForAppealCase', () => {
    it('reads every event of the appeal case in the given transaction', async () => {
      const events = [{ id: 'some-event-log-id' }]
      model.findAll.mockResolvedValueOnce(events)

      const result = await service.findAllForAppealCase('some-appeal-case-id', {
        transaction,
      })

      expect(model.findAll).toHaveBeenCalledWith({
        where: { appealCaseId: 'some-appeal-case-id' },
        transaction,
      })
      expect(result).toBe(events)
    })

    it('rethrows when the read fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(
        service.findAllForAppealCase('some-appeal-case-id', { transaction }),
      ).rejects.toThrow(error)
    })
  })

  describe('findAppealedEventsForAppealCase', () => {
    it('reads only the APPEALED events of the appeal case in the given transaction', async () => {
      const events = [{ id: 'some-event-log-id' }]
      model.findAll.mockResolvedValueOnce(events)

      const result = await service.findAppealedEventsForAppealCase(
        'some-appeal-case-id',
        { transaction },
      )

      expect(model.findAll).toHaveBeenCalledWith({
        where: {
          appealCaseId: 'some-appeal-case-id',
          eventType: AppealEventType.APPEALED,
        },
        transaction,
      })
      expect(result).toBe(events)
    })

    it('rethrows when the read fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(
        service.findAppealedEventsForAppealCase('some-appeal-case-id', {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })

  describe('create', () => {
    it('creates the event log in the given transaction', async () => {
      const data = {
        appealCaseId: 'some-appeal-case-id',
        eventType: AppealEventType.APPEALED,
        userRole: UserRole.PROSECUTOR,
      }

      const result = await service.create(data, { transaction })

      expect(model.create).toHaveBeenCalledWith(data, { transaction })
      expect(result).toEqual({ id: 'some-event-log-id' })
    })
  })

  describe('deleteByAppealCaseId', () => {
    it('deletes every event of the appeal case in the given transaction', async () => {
      model.destroy.mockResolvedValueOnce(2)

      const result = await service.deleteByAppealCaseId('some-appeal-case-id', {
        transaction,
      })

      expect(model.destroy).toHaveBeenCalledWith({
        where: { appealCaseId: 'some-appeal-case-id' },
        transaction,
      })
      expect(result).toBe(2)
    })
  })

  describe('deleteByIds', () => {
    it('deletes the given events in the given transaction', async () => {
      model.destroy.mockResolvedValueOnce(2)

      const result = await service.deleteByIds(
        ['some-event-log-id', 'another-event-log-id'],
        { transaction },
      )

      expect(model.destroy).toHaveBeenCalledWith({
        where: { id: ['some-event-log-id', 'another-event-log-id'] },
        transaction,
      })
      expect(result).toBe(2)
    })

    it('does not touch the database when there is nothing to delete', async () => {
      const result = await service.deleteByIds([], { transaction })

      expect(model.destroy).not.toHaveBeenCalled()
      expect(result).toBe(0)
    })
  })
})
