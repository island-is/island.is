import { Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { StringType } from '@island.is/judicial-system/types'

import { CaseString } from '../models/caseString.model'
import { CaseStringRepositoryService } from '../services/caseStringRepository.service'

describe('CaseStringRepositoryService', () => {
  const caseId = 'some-case-id'
  const caseStringId = 'some-case-string-id'
  const stringType = StringType.CIVIL_DEMANDS
  const transaction = {} as Transaction

  // The table has a composite UNIQUE on (case_id, string_type), so the
  // type-keyed methods must address the row by both columns and the upsert
  // must resolve its conflict on exactly that pair.
  const expectedWhere = { caseId, stringType }
  const expectedConflictFields = ['case_id', 'string_type']

  let service: CaseStringRepositoryService
  let model: {
    findAll: jest.Mock
    create: jest.Mock
    upsert: jest.Mock
    destroy: jest.Mock
    update: jest.Mock
  }

  beforeEach(async () => {
    model = {
      findAll: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
      upsert: jest.fn().mockResolvedValue([{}, null]),
      destroy: jest.fn().mockResolvedValue(0),
      update: jest.fn().mockResolvedValue([0]),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(CaseString), useValue: model },
        CaseStringRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(CaseStringRepositoryService)
  })

  describe('upsertByCaseAndType', () => {
    it('upserts on both key columns in the caller transaction and returns the row', async () => {
      const caseString = { id: caseStringId }
      model.upsert.mockResolvedValueOnce([caseString, true])

      const result = await service.upsertByCaseAndType(
        caseId,
        stringType,
        'Some value',
        { transaction },
      )

      expect(model.upsert).toHaveBeenCalledWith(
        { ...expectedWhere, value: 'Some value' },
        { conflictFields: expectedConflictFields, transaction },
      )
      expect(result).toBe(caseString)
    })

    it('rethrows when the upsert fails', async () => {
      const error = new Error('Some error')
      model.upsert.mockRejectedValueOnce(error)

      await expect(
        service.upsertByCaseAndType(caseId, stringType, 'Some value', {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })

  describe('deleteByCaseAndType', () => {
    it('scopes the delete to both key columns in the caller transaction and reports the row count', async () => {
      model.destroy.mockResolvedValueOnce(1)

      const result = await service.deleteByCaseAndType(caseId, stringType, {
        transaction,
      })

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
        service.deleteByCaseAndType(caseId, stringType, { transaction }),
      ).rejects.toThrow(error)
    })
  })

  describe('updateByIdAndCase', () => {
    it('scopes the update to the row id and the case in the caller transaction', async () => {
      await service.updateByIdAndCase(
        caseStringId,
        caseId,
        { value: '' },
        { transaction },
      )

      expect(model.update).toHaveBeenCalledWith(
        { value: '' },
        { where: { id: caseStringId, caseId }, transaction },
      )
    })

    it('rethrows when the update fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.updateByIdAndCase(caseStringId, caseId, {}, { transaction }),
      ).rejects.toThrow(error)
    })
  })

  describe('copyByTypesToCase', () => {
    const newCaseId = 'some-new-case-id'
    const stringTypes = [StringType.CIVIL_DEMANDS, StringType.PENALTIES]

    it('copies only the case strings of the given types to the new case as new rows', async () => {
      model.findAll.mockResolvedValueOnce([
        {
          toJSON: () => ({
            id: caseStringId,
            caseId,
            stringType: StringType.CIVIL_DEMANDS,
            value: 'Some demands',
          }),
        },
      ])

      await service.copyByTypesToCase(caseId, newCaseId, stringTypes, {
        transaction,
      })

      expect(model.findAll).toHaveBeenCalledWith({
        where: { caseId, stringType: stringTypes },
        transaction,
      })
      expect(model.create).toHaveBeenCalledTimes(1)
      expect(model.create).toHaveBeenCalledWith(
        {
          id: undefined,
          caseId: newCaseId,
          stringType: StringType.CIVIL_DEMANDS,
          value: 'Some demands',
        },
        { transaction },
      )
    })

    it('rethrows when a copy fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockResolvedValueOnce([
        { toJSON: () => ({ id: caseStringId }) },
      ])
      model.create.mockRejectedValueOnce(error)

      await expect(
        service.copyByTypesToCase(caseId, newCaseId, stringTypes, {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })
})
