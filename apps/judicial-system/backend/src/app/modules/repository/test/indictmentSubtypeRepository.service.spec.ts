import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { IndictmentSubtype } from '../models/indictmentSubtype.model'
import { IndictmentSubtypeRepositoryService } from '../services/indictmentSubtypeRepository.service'

describe('IndictmentSubtypeRepositoryService', () => {
  let service: IndictmentSubtypeRepositoryService
  let model: { findOne: jest.Mock }

  beforeEach(async () => {
    model = { findOne: jest.fn().mockResolvedValue(null) }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(IndictmentSubtype), useValue: model },
        IndictmentSubtypeRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(IndictmentSubtypeRepositoryService)
  })

  describe('findByArticle', () => {
    it('queries the given article', async () => {
      await service.findByArticle('article')

      expect(model.findOne).toHaveBeenCalledWith({
        where: { article: 'article' },
      })
    })

    it('returns the indictment subtype for the given article', async () => {
      const indictmentSubtype = { id: 'indictment_subtype_id' }
      model.findOne.mockResolvedValueOnce(indictmentSubtype)

      await expect(service.findByArticle('article')).resolves.toBe(
        indictmentSubtype,
      )
    })

    it('returns null when no indictment subtype matches the article', async () => {
      model.findOne.mockResolvedValueOnce(null)

      await expect(service.findByArticle('article')).resolves.toBeNull()
    })

    it('rethrows when the query fails', async () => {
      model.findOne.mockRejectedValueOnce(new Error('Some error'))

      await expect(service.findByArticle('article')).rejects.toThrow(
        'Some error',
      )
    })
  })
})
