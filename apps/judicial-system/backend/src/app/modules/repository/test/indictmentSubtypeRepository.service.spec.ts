import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { IndictmentSubtype } from '../models/indictmentSubtype.model'
import { IndictmentSubtypeRepositoryService } from '../services/indictmentSubtypeRepository.service'

describe('IndictmentSubtypeRepositoryService', () => {
  let service: IndictmentSubtypeRepositoryService
  let model: { findAll: jest.Mock }

  beforeEach(async () => {
    model = { findAll: jest.fn().mockResolvedValue([]) }

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

      expect(model.findAll).toHaveBeenCalledWith({
        where: { article: 'article' },
      })
    })

    it('returns the indictment subtype for the given article', async () => {
      const indictmentSubtype = { id: 'indictment_subtype_id' }
      model.findAll.mockResolvedValueOnce([indictmentSubtype])

      await expect(service.findByArticle('article')).resolves.toBe(
        indictmentSubtype,
      )
    })

    it('returns null when no indictment subtype matches the article', async () => {
      model.findAll.mockResolvedValueOnce([])

      await expect(service.findByArticle('article')).resolves.toBeNull()
    })

    it('uses details to pick among multiple matches for the same article', async () => {
      const matching = {
        offenseType: 'Hegningarlagabrot önnur',
        details: 'með vatnsflóði',
      }
      model.findAll.mockResolvedValueOnce([
        {
          offenseType: 'Eignaspjöll',
          details: 'með óförum farar- eða flutningstækja',
        },
        matching,
      ])

      await expect(
        service.findByArticle('article', '  MEÐ VATNSFLÓÐI '),
      ).resolves.toBe(matching)
    })

    it('returns the first match when details do not disambiguate', async () => {
      const first = {
        offenseType: 'Eignaspjöll',
        details: 'með óförum farar- eða flutningstækja',
      }
      model.findAll.mockResolvedValueOnce([
        first,
        {
          offenseType: 'Hegningarlagabrot önnur',
          details: 'með vatnsflóði',
        },
      ])

      await expect(service.findByArticle('article')).resolves.toBe(first)
    })

    it('rethrows when the query fails', async () => {
      model.findAll.mockRejectedValueOnce(new Error('Some error'))

      await expect(service.findByArticle('article')).rejects.toThrow(
        'Some error',
      )
    })
  })
})
