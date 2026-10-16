import { Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { AppealSummonsAppellantSide } from '@island.is/judicial-system/types'

import { AppealSummons } from '../models/appealSummons.model'
import { AppealSummonsDefendant } from '../models/appealSummonsDefendant.model'
import { Institution } from '../models/institution.model'
import { User } from '../models/user.model'
import { AppealSummonsRepositoryService } from '../services/appealSummonsRepository.service'

describe('AppealSummonsRepositoryService', () => {
  const transaction = {} as Transaction
  let service: AppealSummonsRepositoryService
  let summonsModel: {
    create: jest.Mock
    findOne: jest.Mock
    update: jest.Mock
  }
  let defendantModel: { create: jest.Mock; destroy: jest.Mock }

  beforeEach(async () => {
    summonsModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    }
    defendantModel = {
      create: jest.fn(),
      destroy: jest.fn(),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(AppealSummons), useValue: summonsModel },
        {
          provide: getModelToken(AppealSummonsDefendant),
          useValue: defendantModel,
        },
        AppealSummonsRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(AppealSummonsRepositoryService)
  })

  describe('create', () => {
    it('creates the summons in the given transaction', async () => {
      const created = { id: 'summons_id' }
      summonsModel.create.mockResolvedValueOnce(created)

      const result = await service.create(
        { caseId: 'case_id', appealCaseId: 'appeal_case_id' },
        { transaction },
      )

      expect(summonsModel.create).toHaveBeenCalledWith(
        { caseId: 'case_id', appealCaseId: 'appeal_case_id' },
        { transaction },
      )
      expect(result).toBe(created)
    })
  })

  describe('findByIdAndCaseId', () => {
    it('loads the summons with its defendant rows', async () => {
      const found = { id: 'summons_id', defendants: [] }
      summonsModel.findOne.mockResolvedValueOnce(found)

      const result = await service.findByIdAndCaseId('summons_id', 'case_id', {
        transaction,
      })

      expect(summonsModel.findOne).toHaveBeenCalledWith({
        where: { id: 'summons_id', caseId: 'case_id' },
        include: [
          {
            model: User,
            as: 'confirmedBy',
            include: [{ model: Institution, as: 'institution' }],
          },
          {
            model: AppealSummonsDefendant,
            as: 'defendants',
            required: false,
            separate: true,
            order: [['created', 'ASC']],
          },
        ],
        transaction,
      })
      expect(result).toBe(found)
    })
  })

  describe('createDefendant', () => {
    it('creates a defendant row on the summons', async () => {
      const created = { id: 'row_id' }
      defendantModel.create.mockResolvedValueOnce(created)

      const result = await service.createDefendant(
        {
          appealSummonsId: 'summons_id',
          defendantId: 'defendant_id',
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims: 'Kröfur',
        },
        { transaction },
      )

      expect(defendantModel.create).toHaveBeenCalledWith(
        {
          appealSummonsId: 'summons_id',
          defendantId: 'defendant_id',
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims: 'Kröfur',
        },
        { transaction },
      )
      expect(result).toBe(created)
    })
  })

  describe('deleteDefendants', () => {
    it('removes every defendant row of the summons', async () => {
      defendantModel.destroy.mockResolvedValueOnce(2)

      const result = await service.deleteDefendants('summons_id', {
        transaction,
      })

      expect(defendantModel.destroy).toHaveBeenCalledWith({
        where: { appealSummonsId: 'summons_id' },
        transaction,
      })
      expect(result).toBe(2)
    })
  })

  describe('update', () => {
    it('updates the summons and reloads it with defendant rows', async () => {
      const updated = { id: 'summons_id', confirmedDate: null }
      summonsModel.update.mockResolvedValueOnce([1])
      summonsModel.findOne.mockResolvedValueOnce(updated)

      const result = await service.update(
        'summons_id',
        'case_id',
        { confirmedDate: null, confirmedById: null, hash: null },
        { transaction },
      )

      expect(summonsModel.update).toHaveBeenCalledWith(
        { confirmedDate: null, confirmedById: null, hash: null },
        { where: { id: 'summons_id', caseId: 'case_id' }, transaction },
      )
      expect(result).toBe(updated)
    })
  })
})
