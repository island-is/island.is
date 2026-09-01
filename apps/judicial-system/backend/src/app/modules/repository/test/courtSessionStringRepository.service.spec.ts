import { Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { CourtSessionStringType } from '@island.is/judicial-system/types'

import { CourtSessionString } from '../models/courtSessionString.model'
import {
  CourtSessionStringKey,
  CourtSessionStringRepositoryService,
} from '../services/courtSessionStringRepository.service'

describe('CourtSessionStringRepositoryService', () => {
  const caseId = 'some-case-id'
  const courtSessionId = 'some-court-session-id'
  const mergedCaseId = 'some-merged-case-id'
  const transaction = {} as Transaction

  const key: CourtSessionStringKey = {
    caseId,
    courtSessionId,
    mergedCaseId,
    stringType: CourtSessionStringType.ENTRIES,
  }

  // The typed key exists so that no caller can address a row by fewer than all
  // four columns - assert them one by one rather than against the key object.
  const expectedWhere = {
    caseId,
    courtSessionId,
    mergedCaseId,
    stringType: CourtSessionStringType.ENTRIES,
  }

  let service: CourtSessionStringRepositoryService
  let model: {
    findOne: jest.Mock
    update: jest.Mock
    create: jest.Mock
  }

  beforeEach(async () => {
    model = {
      findOne: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue([0, []]),
      create: jest.fn(),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(CourtSessionString), useValue: model },
        CourtSessionStringRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(CourtSessionStringRepositoryService)
  })

  describe('findByKey', () => {
    it('looks the string up by all four key columns', async () => {
      const courtSessionString = { id: 'some-court-session-string-id' }
      model.findOne.mockResolvedValueOnce(courtSessionString)

      const result = await service.findByKey(key, { transaction })

      expect(model.findOne).toHaveBeenCalledWith({
        where: expectedWhere,
        transaction,
      })
      expect(result).toBe(courtSessionString)
    })

    it('passes no merged case when the string belongs to the session itself', async () => {
      await service.findByKey({
        caseId,
        courtSessionId,
        stringType: CourtSessionStringType.ENTRIES,
      })

      expect(model.findOne).toHaveBeenCalledWith({
        where: {
          caseId,
          courtSessionId,
          mergedCaseId: undefined,
          stringType: CourtSessionStringType.ENTRIES,
        },
        transaction: undefined,
      })
    })

    it('returns null when there is no such string', async () => {
      expect(await service.findByKey(key)).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(service.findByKey(key)).rejects.toThrow(error)
    })
  })

  describe('updateByKey', () => {
    it('scopes the update to all four key columns and names both halves of the tuple', async () => {
      const updated = { id: 'some-court-session-string-id' }
      model.update.mockResolvedValueOnce([1, [updated]])

      const result = await service.updateByKey(
        key,
        { value: 'Some value' },
        { transaction },
      )

      expect(model.update).toHaveBeenCalledWith(
        { value: 'Some value' },
        { where: expectedWhere, transaction, returning: true },
      )
      expect(result).toEqual({
        numberOfAffectedRows: 1,
        courtSessionStrings: [updated],
      })
    })

    it('reports an unexpected row count rather than enforcing one', async () => {
      const updated = [{ id: 'one' }, { id: 'another' }]
      model.update.mockResolvedValueOnce([2, updated])

      expect(await service.updateByKey(key, { value: 'Some value' })).toEqual({
        numberOfAffectedRows: 2,
        courtSessionStrings: updated,
      })
    })

    it('names both halves when nothing matched', async () => {
      expect(await service.updateByKey(key, { value: 'Some value' })).toEqual({
        numberOfAffectedRows: 0,
        courtSessionStrings: [],
      })
    })

    it('rethrows when the update fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.updateByKey(key, { value: 'Some value' }),
      ).rejects.toThrow(error)
    })
  })

  describe('create', () => {
    it('creates the string with its key columns in the caller transaction', async () => {
      const created = { id: 'some-court-session-string-id' }
      model.create.mockResolvedValueOnce(created)

      const result = await service.create(
        { ...key, value: 'Some value' },
        { transaction },
      )

      expect(model.create).toHaveBeenCalledWith(
        { ...expectedWhere, value: 'Some value' },
        { transaction },
      )
      expect(result).toBe(created)
    })

    it('rethrows when the creation fails', async () => {
      const error = new Error('Some error')
      model.create.mockRejectedValueOnce(error)

      await expect(
        service.create({ ...key, value: 'Some value' }),
      ).rejects.toThrow(error)
    })
  })
})
