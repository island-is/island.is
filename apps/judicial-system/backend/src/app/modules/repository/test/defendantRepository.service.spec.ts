import { literal, Op, Transaction } from 'sequelize'

import { InternalServerErrorException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseState,
  CaseType,
  DefendantPlea,
  Gender,
} from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
import { Defendant } from '../models/defendant.model'
import { DefendantRepositoryService } from '../services/defendantRepository.service'

describe('DefendantRepositoryService', () => {
  const caseId = 'some-case-id'
  const newCaseId = 'some-new-case-id'
  const defendantId = 'some-defendant-id'
  const transaction = {} as Transaction

  let service: DefendantRepositoryService
  let model: {
    findOne: jest.Mock
    findAll: jest.Mock
    create: jest.Mock
    update: jest.Mock
  }

  beforeEach(async () => {
    model = {
      findOne: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue([1]),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(Defendant), useValue: model },
        DefendantRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(DefendantRepositoryService)
  })

  describe('findByIdInCases', () => {
    const caseIds = [caseId, newCaseId]

    it('addresses the defendant within the given cases only', async () => {
      const defendant = { id: defendantId } as Defendant
      model.findOne.mockResolvedValueOnce(defendant)

      const result = await service.findByIdInCases(defendantId, caseIds, {
        transaction,
      })

      expect(model.findOne).toHaveBeenCalledWith({
        where: { id: defendantId, caseId: { [Op.in]: caseIds } },
        transaction,
      })
      expect(result).toBe(defendant)
    })

    it('returns null when the defendant is in none of the cases', async () => {
      const result = await service.findByIdInCases(defendantId, caseIds)

      expect(model.findOne).toHaveBeenCalledWith({
        where: { id: defendantId, caseId: { [Op.in]: caseIds } },
        transaction: undefined,
      })
      expect(result).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(
        service.findByIdInCases(defendantId, caseIds),
      ).rejects.toThrow(error)
    })
  })

  describe('existsInActiveCustody', () => {
    const nationalId = '0000000000'

    // Active custody is an accepted custody case that has not run out - all
    // three conditions are part of the question, so the query is asserted in
    // full
    it('asks for a defendant on an accepted custody case that is still valid', async () => {
      model.findOne.mockResolvedValueOnce({ id: defendantId })

      const result = await service.existsInActiveCustody(nationalId)

      expect(model.findOne).toHaveBeenCalledWith({
        include: [
          {
            model: Case,
            as: 'case',
            where: {
              state: CaseState.ACCEPTED,
              type: CaseType.CUSTODY,
              valid_to_date: { [Op.gte]: literal('current_date') },
            },
          },
        ],
        where: { nationalId },
      })
      expect(result).toBe(true)
    })

    it('answers false when no such defendant exists', async () => {
      const result = await service.existsInActiveCustody(nationalId)

      expect(result).toBe(false)
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(service.existsInActiveCustody(nationalId)).rejects.toThrow(
        error,
      )
    })
  })

  describe('copyProsecutorEnteredToCase', () => {
    it('copies each defendant to the new case with prosecutor entered data only and maps old ids to new', async () => {
      const dateOfBirth = new Date('1990-01-01')
      model.findAll.mockResolvedValueOnce([
        {
          id: defendantId,
          noNationalId: false,
          nationalId: '0000000000',
          dateOfBirth,
          name: 'Accused',
          gender: Gender.MALE,
          address: 'Some address',
          citizenship: 'Iceland',
          defendantPlea: DefendantPlea.GUILTY,
          // Court/process data that must not be copied
          punishmentType: 'IMPRISONMENT',
          defenderName: 'Defender',
          defenderChoice: 'CHOOSE',
          verdictViewDate: new Date(),
        },
      ])
      model.create.mockResolvedValueOnce({ id: 'new-defendant-id' })

      const result = await service.copyProsecutorEnteredToCase(
        caseId,
        newCaseId,
        { transaction },
      )

      expect(model.findAll).toHaveBeenCalledWith({
        where: { caseId },
        transaction,
      })
      expect(model.create).toHaveBeenCalledWith(
        {
          caseId: newCaseId,
          noNationalId: false,
          nationalId: '0000000000',
          dateOfBirth,
          name: 'Accused',
          gender: Gender.MALE,
          address: 'Some address',
          citizenship: 'Iceland',
          defendantPlea: DefendantPlea.GUILTY,
        },
        { transaction },
      )
      expect(result).toEqual(new Map([[defendantId, 'new-defendant-id']]))
    })

    it('returns an empty map when the case has no defendants', async () => {
      const result = await service.copyProsecutorEnteredToCase(
        caseId,
        newCaseId,
        { transaction },
      )

      expect(model.create).not.toHaveBeenCalled()
      expect(result).toEqual(new Map())
    })

    it('rethrows when a copy fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockResolvedValueOnce([{ id: defendantId }])
      model.create.mockRejectedValueOnce(error)

      await expect(
        service.copyProsecutorEnteredToCase(caseId, newCaseId, {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })

  describe('moveToCase', () => {
    it('moves the defendant, addressed within its own case, to the new case', async () => {
      await service.moveToCase(defendantId, caseId, newCaseId, { transaction })

      expect(model.update).toHaveBeenCalledWith(
        { caseId: newCaseId },
        { where: { id: defendantId, caseId }, transaction },
      )
      expect(model.create).not.toHaveBeenCalled()
    })

    // The guards bound the defendant to the case before the transaction
    // opened, so a concurrent change can leave nothing to move - the split must
    // then fail instead of committing a case without its defendant
    it('throws when the defendant is no longer in the case', async () => {
      model.update.mockResolvedValueOnce([0])

      await expect(
        service.moveToCase(defendantId, caseId, newCaseId, { transaction }),
      ).rejects.toThrow(InternalServerErrorException)
    })

    it('rethrows when the move fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.moveToCase(defendantId, caseId, newCaseId, { transaction }),
      ).rejects.toThrow(error)
    })
  })
})
