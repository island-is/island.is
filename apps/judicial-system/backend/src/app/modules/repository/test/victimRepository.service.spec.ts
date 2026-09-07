import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { RequestSharedWhen } from '@island.is/judicial-system/types'

import { Victim } from '../models/victim.model'
import { VictimRepositoryService } from '../services/victimRepository.service'

describe('VictimRepositoryService', () => {
  const victimId = 'some-victim-id'
  const caseId = 'some-case-id'

  let service: VictimRepositoryService
  let model: {
    findByPk: jest.Mock
    create: jest.Mock
    update: jest.Mock
    destroy: jest.Mock
  }

  beforeEach(async () => {
    model = {
      findByPk: jest.fn().mockResolvedValue(null),
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
    it('looks the victim up by primary key', async () => {
      const victim = { id: victimId }
      model.findByPk.mockResolvedValueOnce(victim)

      const result = await service.findById(victimId)

      expect(model.findByPk).toHaveBeenCalledWith(victimId)
      expect(result).toBe(victim)
    })

    it('returns null when there is no such victim', async () => {
      expect(await service.findById(victimId)).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findByPk.mockRejectedValueOnce(error)

      await expect(service.findById(victimId)).rejects.toThrow(error)
    })
  })

  describe('create', () => {
    it('creates the victim against the case', async () => {
      const created = { id: victimId, caseId }
      model.create.mockResolvedValueOnce(created)

      const result = await service.create(caseId, { name: 'Jane Doe' })

      expect(model.create).toHaveBeenCalledWith({ name: 'Jane Doe', caseId })
      expect(result).toBe(created)
    })

    it('rethrows when the creation fails', async () => {
      const error = new Error('Some error')
      model.create.mockRejectedValueOnce(error)

      await expect(service.create(caseId, {})).rejects.toThrow(error)
    })
  })

  describe('updateByIdAndCase', () => {
    it('scopes the update to the victim within its case', async () => {
      const updated = { id: victimId, name: 'Jane Doe' }
      model.update.mockResolvedValueOnce([1, [updated]])
      const update = { hasLawyer: true, lawyerName: 'John Doe' }

      const result = await service.updateByIdAndCase(victimId, caseId, update)

      expect(model.update).toHaveBeenCalledWith(update, {
        where: { id: victimId, caseId },
        returning: true,
      })
      expect(result).toEqual({ numberOfAffectedRows: 1, victims: [updated] })
    })

    it('names both halves of the tuple, including when nothing matched', async () => {
      model.update.mockResolvedValueOnce([0, []])

      const result = await service.updateByIdAndCase(victimId, caseId, {
        lawyerAccessToRequest: RequestSharedWhen.OBLIGATED,
      })

      expect(result).toEqual({ numberOfAffectedRows: 0, victims: [] })
    })

    it('rethrows when the update fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.updateByIdAndCase(victimId, caseId, { name: 'Jane Doe' }),
      ).rejects.toThrow(error)
    })
  })

  describe('deleteByIdAndCase', () => {
    it('scopes the delete to the victim within its case and returns the row count', async () => {
      model.destroy.mockResolvedValueOnce(1)

      const result = await service.deleteByIdAndCase(victimId, caseId)

      expect(model.destroy).toHaveBeenCalledWith({
        where: { id: victimId, caseId },
      })
      expect(result).toBe(1)
    })

    it('rethrows when the delete fails', async () => {
      const error = new Error('Some error')
      model.destroy.mockRejectedValueOnce(error)

      await expect(service.deleteByIdAndCase(victimId, caseId)).rejects.toThrow(
        error,
      )
    })
  })
})
