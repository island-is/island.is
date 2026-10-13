import { Op } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { RobotLog } from '../models/robotLog.model'
import { RobotLogRepositoryService } from '../services/robotLogRepository.service'

describe('RobotLogRepositoryService', () => {
  let service: RobotLogRepositoryService
  let model: { findOne: jest.Mock; create: jest.Mock; update: jest.Mock }

  beforeEach(async () => {
    model = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(RobotLog), useValue: model },
        RobotLogRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(RobotLogRepositoryService)
  })

  describe('existsForCaseTypeAndElements', () => {
    it('queries the given case, type and element ids', async () => {
      await service.existsForCaseTypeAndElements('case_id', 'SOME_TYPE', [
        'element_one',
        'element_two',
      ])

      expect(model.findOne).toHaveBeenCalledWith({
        where: {
          caseId: 'case_id',
          type: 'SOME_TYPE',
          elementId: { [Op.in]: ['element_one', 'element_two'] },
        },
      })
    })

    it('returns true when a matching log exists', async () => {
      model.findOne.mockResolvedValueOnce({ id: 'robot_log_id' })

      await expect(
        service.existsForCaseTypeAndElements('case_id', 'SOME_TYPE', [
          'element_one',
        ]),
      ).resolves.toBe(true)
    })

    it('returns false when no matching log exists', async () => {
      model.findOne.mockResolvedValueOnce(null)

      await expect(
        service.existsForCaseTypeAndElements('case_id', 'SOME_TYPE', [
          'element_one',
        ]),
      ).resolves.toBe(false)
    })

    it('rethrows when the query fails', async () => {
      model.findOne.mockRejectedValueOnce(new Error('Some error'))

      await expect(
        service.existsForCaseTypeAndElements('case_id', 'SOME_TYPE', []),
      ).rejects.toThrow('Some error')
    })
  })

  describe('create', () => {
    it('returns the id and sequence number of the created log', async () => {
      model.create.mockResolvedValueOnce({
        id: 'robot_log_id',
        seqNumber: 42,
        type: 'SOME_TYPE',
      })

      const result = await service.create({
        type: 'SOME_TYPE',
        caseId: 'case_id',
        elementId: 'element_one',
      })

      expect(model.create).toHaveBeenCalledWith({
        type: 'SOME_TYPE',
        caseId: 'case_id',
        elementId: 'element_one',
      })
      expect(result).toEqual({ id: 'robot_log_id', seqNumber: 42 })
    })

    it('rethrows when the create fails', async () => {
      model.create.mockRejectedValueOnce(new Error('Some error'))

      await expect(
        service.create({ type: 'SOME_TYPE', caseId: 'case_id' }),
      ).rejects.toThrow('Some error')
    })
  })

  describe('markDelivered', () => {
    it('marks the given log as delivered', async () => {
      await service.markDelivered('robot_log_id')

      expect(model.update).toHaveBeenCalledWith(
        { delivered: true },
        { where: { id: 'robot_log_id' } },
      )
    })

    it('rethrows when the update fails', async () => {
      model.update.mockRejectedValueOnce(new Error('Some error'))

      await expect(service.markDelivered('robot_log_id')).rejects.toThrow(
        'Some error',
      )
    })
  })
})
