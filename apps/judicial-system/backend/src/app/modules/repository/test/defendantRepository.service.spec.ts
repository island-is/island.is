import { Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { DefendantPlea, Gender } from '@island.is/judicial-system/types'

import { Defendant } from '../models/defendant.model'
import { DefendantRepositoryService } from '../services/defendantRepository.service'

describe('DefendantRepositoryService', () => {
  const caseId = 'some-case-id'
  const newCaseId = 'some-new-case-id'
  const defendantId = 'some-defendant-id'
  const transaction = {} as Transaction

  let service: DefendantRepositoryService
  let model: {
    findAll: jest.Mock
    create: jest.Mock
  }

  beforeEach(async () => {
    model = {
      findAll: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
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
})
