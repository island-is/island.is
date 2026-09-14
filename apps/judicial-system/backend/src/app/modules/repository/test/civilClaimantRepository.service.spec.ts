import { Op, Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { CaseState } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
import { CivilClaimant } from '../models/civilClaimant.model'
import { CivilClaimantRepositoryService } from '../services/civilClaimantRepository.service'

describe('CivilClaimantRepositoryService', () => {
  const civilClaimantId = 'some-civil-claimant-id'
  const caseId = 'some-case-id'
  const transaction = {} as Transaction

  let service: CivilClaimantRepositoryService
  let model: {
    findOne: jest.Mock
    findAll: jest.Mock
    create: jest.Mock
    update: jest.Mock
    destroy: jest.Mock
  }

  beforeEach(async () => {
    model = {
      findOne: jest.fn().mockResolvedValue(null),
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
        { provide: getModelToken(CivilClaimant), useValue: model },
        CivilClaimantRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(CivilClaimantRepositoryService)
  })

  describe('create', () => {
    it('creates the civil claimant against the case in the transaction', async () => {
      const created = { id: civilClaimantId, caseId }
      model.create.mockResolvedValueOnce(created)

      const result = await service.create(caseId, { transaction })

      expect(model.create).toHaveBeenCalledWith({ caseId }, { transaction })
      expect(result).toBe(created)
    })

    it('rethrows when the creation fails', async () => {
      const error = new Error('Some error')
      model.create.mockRejectedValueOnce(error)

      await expect(service.create(caseId, { transaction })).rejects.toThrow(
        error,
      )
    })
  })

  describe('updateByIdAndCase', () => {
    it('scopes the update to the civil claimant within its case', async () => {
      const updated = { id: civilClaimantId, name: 'Jane Doe' }
      model.update.mockResolvedValueOnce([1, [updated]])
      const update = { hasSpokesperson: true, spokespersonName: 'John Doe' }

      const result = await service.updateByIdAndCase(
        civilClaimantId,
        caseId,
        update,
      )

      expect(model.update).toHaveBeenCalledWith(update, {
        where: { id: civilClaimantId, caseId },
        returning: true,
      })
      expect(result).toEqual({
        numberOfAffectedRows: 1,
        civilClaimants: [updated],
      })
    })

    it('names both halves of the tuple, including when nothing matched', async () => {
      model.update.mockResolvedValueOnce([0, []])

      const result = await service.updateByIdAndCase(civilClaimantId, caseId, {
        defendantIds: ['some-defendant-id'],
      })

      expect(result).toEqual({ numberOfAffectedRows: 0, civilClaimants: [] })
    })

    it('rethrows when the update fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.updateByIdAndCase(civilClaimantId, caseId, {
          name: 'Jane Doe',
        }),
      ).rejects.toThrow(error)
    })
  })

  describe('deleteByIdAndCase', () => {
    it('scopes the delete to the civil claimant within its case and returns the row count', async () => {
      model.destroy.mockResolvedValueOnce(1)

      const result = await service.deleteByIdAndCase(civilClaimantId, caseId)

      expect(model.destroy).toHaveBeenCalledWith({
        where: { id: civilClaimantId, caseId },
      })
      expect(result).toBe(1)
    })

    it('rethrows when the delete fails', async () => {
      const error = new Error('Some error')
      model.destroy.mockRejectedValueOnce(error)

      await expect(
        service.deleteByIdAndCase(civilClaimantId, caseId),
      ).rejects.toThrow(error)
    })
  })

  describe('deleteAllForCase', () => {
    it('deletes every civil claimant of the case in the transaction', async () => {
      model.destroy.mockResolvedValueOnce(2)

      const result = await service.deleteAllForCase(caseId, { transaction })

      expect(model.destroy).toHaveBeenCalledWith({
        where: { caseId },
        transaction,
      })
      expect(result).toBe(2)
    })

    it('rethrows when the delete fails', async () => {
      const error = new Error('Some error')
      model.destroy.mockRejectedValueOnce(error)

      await expect(
        service.deleteAllForCase(caseId, { transaction }),
      ).rejects.toThrow(error)
    })
  })

  describe('findLatestBySpokespersonNationalId', () => {
    const nationalId = '0000000000'

    it('looks up the most recent claimant of a live case for the spokesperson', async () => {
      const civilClaimant = { id: civilClaimantId, caseId }
      model.findOne.mockResolvedValueOnce(civilClaimant)

      const result = await service.findLatestBySpokespersonNationalId(
        nationalId,
      )

      expect(model.findOne).toHaveBeenCalledWith({
        include: [
          {
            model: Case,
            as: 'case',
            where: {
              state: { [Op.not]: CaseState.DELETED },
              isArchived: false,
            },
          },
        ],
        where: { hasSpokesperson: true, spokespersonNationalId: nationalId },
        order: [['created', 'DESC']],
      })
      expect(result).toBe(civilClaimant)
    })

    it('returns null when there is no such civil claimant', async () => {
      expect(
        await service.findLatestBySpokespersonNationalId(nationalId),
      ).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(
        service.findLatestBySpokespersonNationalId(nationalId),
      ).rejects.toThrow(error)
    })
  })

  describe('copyAllToCase', () => {
    const newCaseId = 'some-new-case-id'
    const oldDefendantId = 'old-defendant-id'
    const newDefendantId = 'new-defendant-id'
    const defendantIdMap = new Map([[oldDefendantId, newDefendantId]])

    it('copies every civil claimant to the new case with its defendant references remapped and maps old ids to new', async () => {
      const otherCivilClaimantId = 'other-civil-claimant-id'
      model.findAll.mockResolvedValueOnce([
        {
          id: civilClaimantId,
          defendantIds: [oldDefendantId, 'defendant-not-copied'],
          toJSON: () => ({
            id: civilClaimantId,
            caseId,
            name: 'Claimant',
            defendantIds: [oldDefendantId, 'defendant-not-copied'],
          }),
        },
        {
          id: otherCivilClaimantId,
          toJSON: () => ({ id: otherCivilClaimantId, caseId, name: 'Other' }),
        },
      ])
      model.create
        .mockResolvedValueOnce({ id: 'new-civil-claimant-id' })
        .mockResolvedValueOnce({ id: 'new-other-civil-claimant-id' })

      const result = await service.copyAllToCase(
        caseId,
        newCaseId,
        defendantIdMap,
        { transaction },
      )

      expect(model.findAll).toHaveBeenCalledWith({
        where: { caseId },
        transaction,
      })
      // The reference to the defendant that was not copied is dropped
      expect(model.create).toHaveBeenNthCalledWith(
        1,
        {
          id: undefined,
          caseId: newCaseId,
          name: 'Claimant',
          defendantIds: [newDefendantId],
        },
        { transaction },
      )
      // A claimant with no defendant references stays that way
      expect(model.create).toHaveBeenNthCalledWith(
        2,
        {
          id: undefined,
          caseId: newCaseId,
          name: 'Other',
          defendantIds: undefined,
        },
        { transaction },
      )
      expect(result).toEqual(
        new Map([
          [civilClaimantId, 'new-civil-claimant-id'],
          [otherCivilClaimantId, 'new-other-civil-claimant-id'],
        ]),
      )
    })

    it('rethrows when a copy fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockResolvedValueOnce([
        { id: civilClaimantId, toJSON: () => ({ id: civilClaimantId }) },
      ])
      model.create.mockRejectedValueOnce(error)

      await expect(
        service.copyAllToCase(caseId, newCaseId, defendantIdMap, {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })
})
