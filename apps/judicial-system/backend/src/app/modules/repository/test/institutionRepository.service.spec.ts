import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { InstitutionType } from '@island.is/judicial-system/types'

import { Institution } from '../models/institution.model'
import { InstitutionRepositoryService } from '../services/institutionRepository.service'

describe('InstitutionRepositoryService', () => {
  const institutionId = 'a5f7e3d1-0000-4000-8000-000000000001'

  let service: InstitutionRepositoryService
  let logger: { debug: jest.Mock; error: jest.Mock }
  let model: { findByPk: jest.Mock; findAll: jest.Mock }

  beforeEach(async () => {
    logger = { debug: jest.fn(), error: jest.fn() }

    model = {
      findByPk: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue([]),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: LOGGER_PROVIDER, useValue: logger },
        { provide: getModelToken(Institution), useValue: model },
        InstitutionRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(InstitutionRepositoryService)
  })

  describe('findById', () => {
    it('returns the institution', async () => {
      const institution = { id: institutionId }
      model.findByPk.mockResolvedValueOnce(institution)

      const result = await service.findById(institutionId)

      expect(model.findByPk).toHaveBeenCalledWith(institutionId)
      expect(result).toBe(institution)
    })

    it('returns null when the institution does not exist', async () => {
      model.findByPk.mockResolvedValueOnce(null)

      const result = await service.findById(institutionId)

      expect(result).toBeNull()
    })

    it('logs and rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findByPk.mockRejectedValueOnce(error)

      await expect(service.findById(institutionId)).rejects.toBe(error)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('findAllActive', () => {
    it('filters on active institutions and orders by name', async () => {
      const institutions = [{ id: institutionId }]
      model.findAll.mockResolvedValueOnce(institutions)

      const result = await service.findAllActive()

      expect(model.findAll).toHaveBeenCalledWith({
        order: ['name'],
        where: { active: true },
      })
      expect(result).toBe(institutions)
    })

    it('narrows on the given types, still active and ordered', async () => {
      await service.findAllActive([
        InstitutionType.PRISON_ADMIN,
        InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      ])

      expect(model.findAll).toHaveBeenCalledWith({
        order: ['name'],
        where: {
          active: true,
          type: [
            InstitutionType.PRISON_ADMIN,
            InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
          ],
        },
      })
    })

    it('logs and rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(service.findAllActive()).rejects.toBe(error)
      expect(logger.error).toHaveBeenCalled()
    })
  })
})
