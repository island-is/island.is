import { Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { IndictmentCountOffense } from '@island.is/judicial-system/types'

import { Offense } from '../models/offense.model'
import { OffenseRepositoryService } from '../services/offenseRepository.service'

describe('OffenseRepositoryService', () => {
  const indictmentCountId = 'some-indictment-count-id'
  const offenseId = 'some-offense-id'
  const transaction = {} as Transaction

  // An offense is only addressable within its own indictment count, so the
  // by-id methods must carry both keys.
  const expectedWhere = { id: offenseId, indictmentCountId }

  let service: OffenseRepositoryService
  let model: {
    findAll: jest.Mock
    create: jest.Mock
    update: jest.Mock
    destroy: jest.Mock
  }

  beforeEach(async () => {
    model = {
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
        { provide: getModelToken(Offense), useValue: model },
        OffenseRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(OffenseRepositoryService)
  })

  describe('create', () => {
    it('creates the offense against the indictment count', async () => {
      const created = { id: offenseId, indictmentCountId }
      model.create.mockResolvedValueOnce(created)

      const result = await service.create(
        indictmentCountId,
        IndictmentCountOffense.DRUNK_DRIVING,
      )

      expect(model.create).toHaveBeenCalledWith({
        indictmentCountId,
        offense: IndictmentCountOffense.DRUNK_DRIVING,
      })
      expect(result).toBe(created)
    })

    it('rethrows when the creation fails', async () => {
      const error = new Error('Some error')
      model.create.mockRejectedValueOnce(error)

      await expect(
        service.create(indictmentCountId, IndictmentCountOffense.DRUNK_DRIVING),
      ).rejects.toThrow(error)
    })
  })

  describe('updateByIdAndIndictmentCount', () => {
    it('scopes the update to the row id and the indictment count and returns the rows', async () => {
      const offense = { id: offenseId, substances: { ALCOHOL: '0,10' } }
      model.update.mockResolvedValueOnce([1, [offense]])

      const result = await service.updateByIdAndIndictmentCount(
        offenseId,
        indictmentCountId,
        { substances: { ALCOHOL: '0,10' } },
      )

      expect(model.update).toHaveBeenCalledWith(
        { substances: { ALCOHOL: '0,10' } },
        { where: expectedWhere, returning: true },
      )
      expect(result).toEqual({ numberOfAffectedRows: 1, offenses: [offense] })
    })

    it('reports zero rows when nothing matched', async () => {
      const result = await service.updateByIdAndIndictmentCount(
        offenseId,
        indictmentCountId,
        { substances: null },
      )

      expect(result).toEqual({ numberOfAffectedRows: 0, offenses: [] })
    })

    it('rethrows when the update fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.updateByIdAndIndictmentCount(offenseId, indictmentCountId, {}),
      ).rejects.toThrow(error)
    })
  })

  describe('deleteByIdAndIndictmentCount', () => {
    it('scopes the delete to the row id and the indictment count and reports the row count', async () => {
      model.destroy.mockResolvedValueOnce(1)

      const result = await service.deleteByIdAndIndictmentCount(
        offenseId,
        indictmentCountId,
      )

      expect(model.destroy).toHaveBeenCalledWith({ where: expectedWhere })
      expect(result).toBe(1)
    })

    it('rethrows when the delete fails', async () => {
      const error = new Error('Some error')
      model.destroy.mockRejectedValueOnce(error)

      await expect(
        service.deleteByIdAndIndictmentCount(offenseId, indictmentCountId),
      ).rejects.toThrow(error)
    })
  })

  describe('deleteAllForIndictmentCount', () => {
    it('deletes every offense of the indictment count in the caller transaction and reports the row count', async () => {
      model.destroy.mockResolvedValueOnce(3)

      const result = await service.deleteAllForIndictmentCount(
        indictmentCountId,
        { transaction },
      )

      expect(model.destroy).toHaveBeenCalledWith({
        where: { indictmentCountId },
        transaction,
      })
      expect(result).toBe(3)
    })

    it('rethrows when the delete fails', async () => {
      const error = new Error('Some error')
      model.destroy.mockRejectedValueOnce(error)

      await expect(
        service.deleteAllForIndictmentCount(indictmentCountId, { transaction }),
      ).rejects.toThrow(error)
    })
  })

  describe('copyAllForIndictmentCounts', () => {
    const newIndictmentCountId = 'some-new-indictment-count-id'
    const otherIndictmentCountId = 'other-indictment-count-id'
    const newOtherIndictmentCountId = 'other-new-indictment-count-id'
    const indictmentCountIdMap = new Map([
      [indictmentCountId, newIndictmentCountId],
      [otherIndictmentCountId, newOtherIndictmentCountId],
    ])

    it('loads the offenses of all the counts at once and copies each onto the copy of its count', async () => {
      model.findAll.mockResolvedValueOnce([
        {
          toJSON: () => ({
            id: 'first-offense-id',
            indictmentCountId,
            offense: 'DRUNK_DRIVING',
          }),
          indictmentCountId,
        },
        {
          toJSON: () => ({
            id: 'second-offense-id',
            indictmentCountId: otherIndictmentCountId,
            offense: 'SPEEDING',
          }),
          indictmentCountId: otherIndictmentCountId,
        },
      ])

      await service.copyAllForIndictmentCounts(indictmentCountIdMap, {
        transaction,
      })

      expect(model.findAll).toHaveBeenCalledWith({
        where: {
          indictmentCountId: [indictmentCountId, otherIndictmentCountId],
        },
        transaction,
      })
      expect(model.create).toHaveBeenCalledTimes(2)
      expect(model.create).toHaveBeenCalledWith(
        {
          id: undefined,
          indictmentCountId: newIndictmentCountId,
          offense: 'DRUNK_DRIVING',
        },
        { transaction },
      )
      expect(model.create).toHaveBeenCalledWith(
        {
          id: undefined,
          indictmentCountId: newOtherIndictmentCountId,
          offense: 'SPEEDING',
        },
        { transaction },
      )
    })

    it('does not query at all when there are no counts to copy for', async () => {
      await service.copyAllForIndictmentCounts(new Map(), { transaction })

      expect(model.findAll).not.toHaveBeenCalled()
      expect(model.create).not.toHaveBeenCalled()
    })

    it('rethrows when a copy fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockResolvedValueOnce([
        { toJSON: () => ({ indictmentCountId }), indictmentCountId },
      ])
      model.create.mockRejectedValueOnce(error)

      await expect(
        service.copyAllForIndictmentCounts(indictmentCountIdMap, {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })
})
