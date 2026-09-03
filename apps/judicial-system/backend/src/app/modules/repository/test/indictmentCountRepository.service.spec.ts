import { Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { IndictmentCount } from '../models/indictmentCount.model'
import { Offense } from '../models/offense.model'
import { IndictmentCountRepositoryService } from '../services/indictmentCountRepository.service'

describe('IndictmentCountRepositoryService', () => {
  const caseId = 'some-case-id'
  const indictmentCountId = 'some-indictment-count-id'
  const transaction = {} as Transaction

  // An indictment count is only addressable within its own case, so the
  // by-id methods must carry both keys.
  const expectedWhere = { id: indictmentCountId, caseId }

  let service: IndictmentCountRepositoryService
  let model: {
    findByPk: jest.Mock
    max: jest.Mock
    findAll: jest.Mock
    create: jest.Mock
    update: jest.Mock
    destroy: jest.Mock
  }

  beforeEach(async () => {
    model = {
      findByPk: jest.fn().mockResolvedValue(null),
      max: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue([0, []]),
      destroy: jest.fn().mockResolvedValue(0),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(IndictmentCount), useValue: model },
        IndictmentCountRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(IndictmentCountRepositoryService)
  })

  describe('findByIdWithOffenses', () => {
    it('loads the count by primary key with its offenses in creation order', async () => {
      const indictmentCount = { id: indictmentCountId }
      model.findByPk.mockResolvedValueOnce(indictmentCount)

      const result = await service.findByIdWithOffenses(indictmentCountId)

      expect(model.findByPk).toHaveBeenCalledWith(indictmentCountId, {
        include: [
          {
            model: Offense,
            as: 'offenses',
            required: false,
            separate: true,
            order: [['created', 'ASC']],
          },
        ],
      })
      expect(result).toBe(indictmentCount)
    })

    it('returns null when there is no such count', async () => {
      expect(await service.findByIdWithOffenses(indictmentCountId)).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findByPk.mockRejectedValueOnce(error)

      await expect(
        service.findByIdWithOffenses(indictmentCountId),
      ).rejects.toThrow(error)
    })
  })

  describe('getMaxDisplayOrderForCase', () => {
    it('reads the maximum display order of the case in the caller transaction', async () => {
      model.max.mockResolvedValueOnce(4)

      const result = await service.getMaxDisplayOrderForCase(caseId, {
        transaction,
      })

      expect(model.max).toHaveBeenCalledWith('displayOrder', {
        where: { caseId },
        transaction,
      })
      expect(result).toBe(4)
    })

    it('returns zero as a number, not as a missing value', async () => {
      model.max.mockResolvedValueOnce(0)

      expect(
        await service.getMaxDisplayOrderForCase(caseId, { transaction }),
      ).toBe(0)
    })

    it('returns null when the case has no counts', async () => {
      expect(
        await service.getMaxDisplayOrderForCase(caseId, { transaction }),
      ).toBeNull()
    })

    it('rethrows when the aggregate fails', async () => {
      const error = new Error('Some error')
      model.max.mockRejectedValueOnce(error)

      await expect(
        service.getMaxDisplayOrderForCase(caseId, { transaction }),
      ).rejects.toThrow(error)
    })
  })

  describe('findAllForCaseOrdered', () => {
    it('lists the counts of the case by display order, then creation, in the caller transaction', async () => {
      const indictmentCounts = [{ id: indictmentCountId }]
      model.findAll.mockResolvedValueOnce(indictmentCounts)

      const result = await service.findAllForCaseOrdered(caseId, {
        transaction,
      })

      expect(model.findAll).toHaveBeenCalledWith({
        where: { caseId },
        order: [
          ['displayOrder', 'ASC'],
          ['created', 'ASC'],
        ],
        transaction,
      })
      expect(result).toBe(indictmentCounts)
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(
        service.findAllForCaseOrdered(caseId, { transaction }),
      ).rejects.toThrow(error)
    })
  })

  describe('create', () => {
    it('creates the count against the case in the caller transaction', async () => {
      const created = { id: indictmentCountId, caseId }
      model.create.mockResolvedValueOnce(created)

      const result = await service.create(
        caseId,
        { displayOrder: 3 },
        { transaction },
      )

      expect(model.create).toHaveBeenCalledWith(
        { caseId, displayOrder: 3 },
        { transaction },
      )
      expect(result).toBe(created)
    })

    it('carries an optional police case number', async () => {
      await service.create(
        caseId,
        { displayOrder: 0, policeCaseNumber: '007-2024-1' },
        { transaction },
      )

      expect(model.create).toHaveBeenCalledWith(
        { caseId, displayOrder: 0, policeCaseNumber: '007-2024-1' },
        { transaction },
      )
    })

    it('rethrows when the creation fails', async () => {
      const error = new Error('Some error')
      model.create.mockRejectedValueOnce(error)

      await expect(
        service.create(caseId, { displayOrder: 0 }, { transaction }),
      ).rejects.toThrow(error)
    })
  })

  describe('updateByIdAndCase', () => {
    it('scopes the update to the row id and the case, returning the rows, in the caller transaction', async () => {
      const indictmentCount = { id: indictmentCountId, displayOrder: 1 }
      model.update.mockResolvedValueOnce([1, [indictmentCount]])

      const result = await service.updateByIdAndCase(
        indictmentCountId,
        caseId,
        { displayOrder: 1 },
        { transaction },
      )

      expect(model.update).toHaveBeenCalledWith(
        { displayOrder: 1 },
        { where: expectedWhere, returning: true, transaction },
      )
      expect(result).toEqual({
        numberOfAffectedRows: 1,
        indictmentCounts: [indictmentCount],
      })
    })

    it('reports zero rows when nothing matched', async () => {
      const result = await service.updateByIdAndCase(
        indictmentCountId,
        caseId,
        { policeCaseNumber: null },
        { transaction },
      )

      expect(result).toEqual({ numberOfAffectedRows: 0, indictmentCounts: [] })
    })

    it('rethrows when the update fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.updateByIdAndCase(
          indictmentCountId,
          caseId,
          {},
          { transaction },
        ),
      ).rejects.toThrow(error)
    })
  })

  describe('deleteByIdAndCase', () => {
    it('scopes the delete to the row id and the case in the caller transaction and reports the row count', async () => {
      model.destroy.mockResolvedValueOnce(1)

      const result = await service.deleteByIdAndCase(
        indictmentCountId,
        caseId,
        {
          transaction,
        },
      )

      expect(model.destroy).toHaveBeenCalledWith({
        where: expectedWhere,
        transaction,
      })
      expect(result).toBe(1)
    })

    it('rethrows when the delete fails', async () => {
      const error = new Error('Some error')
      model.destroy.mockRejectedValueOnce(error)

      await expect(
        service.deleteByIdAndCase(indictmentCountId, caseId, { transaction }),
      ).rejects.toThrow(error)
    })
  })
})
