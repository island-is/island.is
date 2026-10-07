import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { PoliceDigitalCaseFile } from '../models/policeDigitalCaseFile.model'
import { PoliceDigitalCaseFileRepositoryService } from '../services/policeDigitalCaseFileRepository.service'

describe('PoliceDigitalCaseFileRepositoryService', () => {
  let service: PoliceDigitalCaseFileRepositoryService
  let model: { findAll: jest.Mock }
  let logger: { debug: jest.Mock; error: jest.Mock }

  beforeEach(async () => {
    model = { findAll: jest.fn().mockResolvedValue([]) }
    logger = { debug: jest.fn(), error: jest.fn() }

    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: LOGGER_PROVIDER, useValue: logger },
        { provide: getModelToken(PoliceDigitalCaseFile), useValue: model },
        PoliceDigitalCaseFileRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(PoliceDigitalCaseFileRepositoryService)
  })

  describe('findByCaseId', () => {
    it('reads every police digital case file of the case', async () => {
      const files = [{ id: 'some-file-id' }]
      model.findAll.mockResolvedValueOnce(files)

      const result = await service.findByCaseId('some-case-id')

      expect(model.findAll).toHaveBeenCalledWith({
        where: { caseId: 'some-case-id' },
      })
      expect(result).toBe(files)
    })

    it('logs and rethrows when the read fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(service.findByCaseId('some-case-id')).rejects.toBe(error)
      expect(logger.error).toHaveBeenCalledWith(
        'Error finding police digital case files for case',
        { error },
      )
    })
  })

  describe('findByCaseAndPoliceCaseNumber', () => {
    it('reads the police digital case files of one police case number', async () => {
      const files = [{ id: 'some-file-id' }]
      model.findAll.mockResolvedValueOnce(files)

      const result = await service.findByCaseAndPoliceCaseNumber(
        'some-case-id',
        '007-2024-1',
      )

      expect(model.findAll).toHaveBeenCalledWith({
        where: { caseId: 'some-case-id', policeCaseNumber: '007-2024-1' },
      })
      expect(result).toBe(files)
    })

    it('logs and rethrows when the read fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(
        service.findByCaseAndPoliceCaseNumber('some-case-id', '007-2024-1'),
      ).rejects.toBe(error)
      expect(logger.error).toHaveBeenCalledWith(
        'Error finding police digital case files for police case number',
        { error },
      )
    })
  })
})
