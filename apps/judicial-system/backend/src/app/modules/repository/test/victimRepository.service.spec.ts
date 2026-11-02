import { Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { RequestSharedWhen } from '@island.is/judicial-system/types'

import { Victim } from '../models/victim.model'
import { VictimRepositoryService } from '../services/victimRepository.service'

describe('VictimRepositoryService', () => {
  const victimId = 'some-victim-id'
  const caseId = 'some-case-id'
  const transaction = {} as Transaction

  let service: VictimRepositoryService
  let model: {
    findByPk: jest.Mock
    findAll: jest.Mock
    create: jest.Mock
    update: jest.Mock
    destroy: jest.Mock
  }

  beforeEach(async () => {
    model = {
      findByPk: jest.fn().mockResolvedValue(null),
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
        { provide: getModelToken(Victim), useValue: model },
        VictimRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(VictimRepositoryService)
  })

  describe('findById', () => {
    it('looks the victim up by primary key in the caller transaction', async () => {
      const victim = { id: victimId }
      model.findByPk.mockResolvedValueOnce(victim)

      const result = await service.findById(victimId, { transaction })

      expect(model.findByPk).toHaveBeenCalledWith(victimId, { transaction })
      expect(result).toBe(victim)
    })

    it('returns null when there is no such victim', async () => {
      expect(await service.findById(victimId, { transaction })).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findByPk.mockRejectedValueOnce(error)

      await expect(service.findById(victimId, { transaction })).rejects.toThrow(
        error,
      )
    })
  })

  describe('create', () => {
    it('creates the victim against the case in the caller transaction', async () => {
      const created = { id: victimId, caseId }
      model.create.mockResolvedValueOnce(created)

      const result = await service.create(
        caseId,
        { name: 'Jane Doe' },
        { transaction },
      )

      expect(model.create).toHaveBeenCalledWith(
        { name: 'Jane Doe', caseId },
        { transaction },
      )
      expect(result).toBe(created)
    })

    it('rethrows when the creation fails', async () => {
      const error = new Error('Some error')
      model.create.mockRejectedValueOnce(error)

      await expect(service.create(caseId, {}, { transaction })).rejects.toThrow(
        error,
      )
    })
  })

  describe('updateByIdAndCase', () => {
    it('scopes the update to the victim within its case in the caller transaction', async () => {
      const updated = { id: victimId, name: 'Jane Doe' }
      model.update.mockResolvedValueOnce([1, [updated]])
      const update = { hasLawyer: true, lawyerName: 'John Doe' }

      const result = await service.updateByIdAndCase(victimId, caseId, update, {
        transaction,
      })

      expect(model.update).toHaveBeenCalledWith(update, {
        where: { id: victimId, caseId },
        returning: true,
        transaction,
      })
      expect(result).toEqual({ numberOfAffectedRows: 1, victims: [updated] })
    })

    it('names both halves of the tuple, including when nothing matched', async () => {
      model.update.mockResolvedValueOnce([0, []])

      const result = await service.updateByIdAndCase(
        victimId,
        caseId,
        { lawyerAccessToRequest: RequestSharedWhen.OBLIGATED },
        { transaction },
      )

      expect(result).toEqual({ numberOfAffectedRows: 0, victims: [] })
    })

    it('rethrows when the update fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.updateByIdAndCase(
          victimId,
          caseId,
          { name: 'Jane Doe' },
          { transaction },
        ),
      ).rejects.toThrow(error)
    })
  })

  describe('deleteByIdAndCase', () => {
    it('scopes the delete to the victim within its case in the caller transaction and returns the row count', async () => {
      model.destroy.mockResolvedValueOnce(1)

      const result = await service.deleteByIdAndCase(victimId, caseId, {
        transaction,
      })

      expect(model.destroy).toHaveBeenCalledWith({
        where: { id: victimId, caseId },
        transaction,
      })
      expect(result).toBe(1)
    })

    it('rethrows when the delete fails', async () => {
      const error = new Error('Some error')
      model.destroy.mockRejectedValueOnce(error)

      await expect(
        service.deleteByIdAndCase(victimId, caseId, { transaction }),
      ).rejects.toThrow(error)
    })
  })
})
