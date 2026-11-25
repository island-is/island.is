import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { CaseArchive } from '../models/caseArchive.model'
import { repositoryModuleConfig } from '../repository.config'
import { CaseArchiveRepositoryService } from '../services/caseArchiveRepository.service'

describe('CaseArchiveRepositoryService', () => {
  const caseId = uuid()
  const transaction = {} as Transaction
  const content = {
    description: 'Lýsing með íslenskum stöfum: þæöð',
    defendants: [{ name: 'Jón Jónsson', nationalId: '0000000000' }],
  }

  let service: CaseArchiveRepositoryService
  let model: { create: jest.Mock; findOne: jest.Mock }
  let logger: { debug: jest.Mock; error: jest.Mock }

  beforeEach(async () => {
    model = {
      create: jest
        .fn()
        .mockImplementation((values) =>
          Promise.resolve({ id: uuid(), created: new Date(), ...values }),
        ),
      findOne: jest.fn(),
    }
    logger = { debug: jest.fn(), error: jest.fn() }

    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: LOGGER_PROVIDER, useValue: logger },
        { provide: getModelToken(CaseArchive), useValue: model },
        {
          provide: repositoryModuleConfig.KEY,
          useValue: { archiveEncryptionKey: 'test-archive-encryption-key' },
        },
        CaseArchiveRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(CaseArchiveRepositoryService)
  })

  describe('findLatestByCaseId', () => {
    it('should read the latest archive of the case in the callers transaction', async () => {
      model.findOne.mockResolvedValueOnce(null)

      const result = await service.findLatestByCaseId(caseId, { transaction })

      expect(model.findOne).toHaveBeenCalledWith({
        where: { caseId },
        order: [['created', 'DESC']],
        transaction,
      })
      expect(result).toBeNull()
    })

    it('should decrypt what create encrypted', async () => {
      const created = await service.create(
        caseId,
        { archiveJson: JSON.stringify(content) },
        { transaction },
      )
      model.findOne.mockResolvedValueOnce(created)

      const result = await service.findLatestByCaseId(caseId, { transaction })

      expect(created.archive).not.toContain('Jón')
      expect(result).toEqual({
        id: created.id,
        created: created.created,
        content,
      })
    })

    it('should return no content for an archive that cannot be decrypted', async () => {
      const id = uuid()
      const created = new Date()
      model.findOne.mockResolvedValueOnce({
        id,
        created,
        archive: 'not-an-encrypted-archive',
      })

      const result = await service.findLatestByCaseId(caseId, { transaction })

      expect(result).toEqual({ id, created, content: undefined })
    })

    it('should return no content for an archive that is not a JSON object', async () => {
      const created = await service.create(
        caseId,
        { archiveJson: JSON.stringify(['not', 'an', 'object']) },
        { transaction },
      )
      model.findOne.mockResolvedValueOnce(created)

      const result = await service.findLatestByCaseId(caseId, { transaction })

      expect(result?.content).toBeUndefined()
    })
  })
})
