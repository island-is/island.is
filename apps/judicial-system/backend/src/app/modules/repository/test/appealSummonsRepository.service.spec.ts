import { Op, Transaction } from 'sequelize'

import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AppealSummonsAppellantSide,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { AppealSummons } from '../models/appealSummons.model'
import { AppealSummonsDefendant } from '../models/appealSummonsDefendant.model'
import { AppealSummonsServiceRecipient } from '../models/appealSummonsServiceRecipient.model'
import { Institution } from '../models/institution.model'
import { User } from '../models/user.model'
import { AppealSummonsRepositoryService } from '../services/appealSummonsRepository.service'

describe('AppealSummonsRepositoryService', () => {
  const transaction = {} as Transaction
  let service: AppealSummonsRepositoryService
  let summonsModel: {
    create: jest.Mock
    destroy: jest.Mock
    findAll: jest.Mock
    findOne: jest.Mock
    update: jest.Mock
  }
  let defendantModel: { create: jest.Mock; destroy: jest.Mock }
  let serviceRecipientModel: {
    create: jest.Mock
    findOne: jest.Mock
    update: jest.Mock
  }

  beforeEach(async () => {
    summonsModel = {
      create: jest.fn(),
      destroy: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    }
    defendantModel = {
      create: jest.fn(),
      destroy: jest.fn(),
    }
    serviceRecipientModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
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
        {
          provide: getModelToken(AppealSummonsServiceRecipient),
          useValue: serviceRecipientModel,
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
          {
            model: AppealSummonsServiceRecipient,
            as: 'services',
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
    it('updates the summons by id and case only, and reloads it', async () => {
      const updated = { id: 'summons_id', confirmedDate: new Date() }
      summonsModel.update.mockResolvedValueOnce([1])
      summonsModel.findOne.mockResolvedValueOnce(updated)

      const result = await service.update(
        'summons_id',
        'case_id',
        { confirmedById: 'user_id', confirmedDate: updated.confirmedDate },
        { transaction },
      )

      expect(summonsModel.update).toHaveBeenCalledWith(
        { confirmedById: 'user_id', confirmedDate: updated.confirmedDate },
        { where: { id: 'summons_id', caseId: 'case_id' }, transaction },
      )
      expect(summonsModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'summons_id', caseId: 'case_id' },
          transaction,
        }),
      )
      expect(result).toBe(updated)
    })

    it('throws a server error when no row matches, since there is no precondition to miss', async () => {
      summonsModel.update.mockResolvedValueOnce([0])

      await expect(
        service.update(
          'summons_id',
          'case_id',
          { hash: 'hash' },
          { transaction },
        ),
      ).rejects.toBeInstanceOf(InternalServerErrorException)

      expect(summonsModel.findOne).not.toHaveBeenCalled()
    })
  })

  describe('clearConfirmationIfUnsent', () => {
    it('clears the confirmation only while the summons is unsent', async () => {
      const updated = { id: 'summons_id', confirmedDate: null }
      summonsModel.update.mockResolvedValueOnce([1])
      summonsModel.findOne.mockResolvedValueOnce(updated)

      const result = await service.clearConfirmationIfUnsent(
        'summons_id',
        'case_id',
        { transaction },
      )

      expect(summonsModel.update).toHaveBeenCalledWith(
        {
          confirmedById: null,
          confirmedDate: null,
          hash: null,
          hashAlgorithm: null,
        },
        {
          where: {
            id: 'summons_id',
            caseId: 'case_id',
            sentToCourtOfAppealsDate: null,
          },
          transaction,
        },
      )
      expect(result).toBe(updated)
    })

    it('rejects with a conflict when a concurrent send already went through', async () => {
      summonsModel.update.mockResolvedValueOnce([0])

      await expect(
        service.clearConfirmationIfUnsent('summons_id', 'case_id', {
          transaction,
        }),
      ).rejects.toBeInstanceOf(ConflictException)

      expect(summonsModel.findOne).not.toHaveBeenCalled()
    })
  })

  describe('markSentToCourtOfAppeals', () => {
    const sentToCourtOfAppealsDate = new Date('2026-06-05T09:30:00.000Z')
    const expectedConfirmedDate = new Date('2026-06-05T09:15:00.000Z')

    it('sets the send date only while unsent and still confirmed as the caller saw it', async () => {
      const updated = { id: 'summons_id', sentToCourtOfAppealsDate }
      summonsModel.update.mockResolvedValueOnce([1])
      summonsModel.findOne.mockResolvedValueOnce(updated)

      const result = await service.markSentToCourtOfAppeals(
        'summons_id',
        'case_id',
        sentToCourtOfAppealsDate,
        { transaction, expectedConfirmedDate },
      )

      expect(summonsModel.update).toHaveBeenCalledWith(
        { sentToCourtOfAppealsDate },
        {
          where: {
            id: 'summons_id',
            caseId: 'case_id',
            sentToCourtOfAppealsDate: null,
            confirmedDate: expectedConfirmedDate,
          },
          transaction,
        },
      )
      expect(summonsModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ transaction }),
      )
      expect(result).toBe(updated)
    })

    it('rejects with a conflict when the summons was sent or its confirmation changed', async () => {
      summonsModel.update.mockResolvedValueOnce([0])

      await expect(
        service.markSentToCourtOfAppeals(
          'summons_id',
          'case_id',
          sentToCourtOfAppealsDate,
          { transaction, expectedConfirmedDate },
        ),
      ).rejects.toBeInstanceOf(ConflictException)

      expect(summonsModel.findOne).not.toHaveBeenCalled()
    })
  })

  describe('deleteIfUnsent', () => {
    it('removes the defendant rows and then the summons, only while unsent', async () => {
      defendantModel.destroy.mockResolvedValueOnce(1)
      summonsModel.destroy.mockResolvedValueOnce(1)

      const result = await service.deleteIfUnsent('summons_id', 'case_id', {
        transaction,
      })

      expect(defendantModel.destroy).toHaveBeenCalledWith({
        where: { appealSummonsId: 'summons_id' },
        transaction,
      })
      expect(summonsModel.destroy).toHaveBeenCalledWith({
        where: {
          id: 'summons_id',
          caseId: 'case_id',
          sentToCourtOfAppealsDate: null,
        },
        transaction,
      })
      expect(result).toBe(true)
    })

    it('rejects with a conflict when a concurrent send already went through', async () => {
      defendantModel.destroy.mockResolvedValueOnce(1)
      summonsModel.destroy.mockResolvedValueOnce(0)

      await expect(
        service.deleteIfUnsent('summons_id', 'case_id', { transaction }),
      ).rejects.toBeInstanceOf(ConflictException)
    })
  })

  describe('findServiceRecipientById', () => {
    it('reads the recipient without a lock', async () => {
      const found = { id: 'service_id' }
      serviceRecipientModel.findOne.mockResolvedValueOnce(found)

      const result = await service.findServiceRecipientById(
        'service_id',
        'summons_id',
        { transaction },
      )

      expect(serviceRecipientModel.findOne).toHaveBeenCalledWith({
        where: { id: 'service_id', appealSummonsId: 'summons_id' },
        transaction,
      })
      expect(serviceRecipientModel.findOne.mock.calls[0][0]).not.toHaveProperty(
        'lock',
      )
      expect(result).toBe(found)
    })
  })

  describe('findServiceRecipientByIdForUpdate', () => {
    it('reads the recipient under a FOR UPDATE lock in the transaction', async () => {
      const found = { id: 'service_id' }
      serviceRecipientModel.findOne.mockResolvedValueOnce(found)

      const result = await service.findServiceRecipientByIdForUpdate(
        'service_id',
        'summons_id',
        { transaction },
      )

      expect(serviceRecipientModel.findOne).toHaveBeenCalledWith({
        where: { id: 'service_id', appealSummonsId: 'summons_id' },
        transaction,
        lock: Transaction.LOCK.UPDATE,
      })
      expect(result).toBe(found)
    })
  })

  describe('updateServiceRecipient', () => {
    it('updates the recipient by id and summons only, and reloads it without a lock', async () => {
      const updated = { id: 'service_id', externalPoliceDocumentId: 'doc_id' }
      serviceRecipientModel.update.mockResolvedValueOnce([1])
      serviceRecipientModel.findOne.mockResolvedValueOnce(updated)

      const result = await service.updateServiceRecipient(
        'service_id',
        'summons_id',
        { externalPoliceDocumentId: 'doc_id' },
        { transaction },
      )

      expect(serviceRecipientModel.update).toHaveBeenCalledWith(
        { externalPoliceDocumentId: 'doc_id' },
        {
          where: { id: 'service_id', appealSummonsId: 'summons_id' },
          transaction,
        },
      )
      expect(serviceRecipientModel.findOne).toHaveBeenCalledWith({
        where: { id: 'service_id', appealSummonsId: 'summons_id' },
        transaction,
      })
      expect(result).toBe(updated)
    })

    it('throws a server error when no row matches', async () => {
      serviceRecipientModel.update.mockResolvedValueOnce([0])

      await expect(
        service.updateServiceRecipient(
          'service_id',
          'summons_id',
          { externalPoliceDocumentId: 'doc_id' },
          { transaction },
        ),
      ).rejects.toBeInstanceOf(InternalServerErrorException)

      expect(serviceRecipientModel.findOne).not.toHaveBeenCalled()
    })
  })

  describe('recordServiceStatusIfUnset', () => {
    const data = {
      serviceStatus: VerdictServiceStatus.IN_PERSON,
      serviceDate: new Date('2026-06-06T10:00:00.000Z'),
      servedBy: 'Lögreglumaður',
      comment: undefined,
    }

    it('records the status only while the row has none, and reloads it', async () => {
      const updated = { id: 'service_id', ...data }
      serviceRecipientModel.update.mockResolvedValueOnce([1])
      serviceRecipientModel.findOne.mockResolvedValueOnce(updated)

      const result = await service.recordServiceStatusIfUnset(
        'service_id',
        'summons_id',
        data,
        { transaction },
      )

      expect(serviceRecipientModel.update).toHaveBeenCalledWith(data, {
        where: {
          id: 'service_id',
          appealSummonsId: 'summons_id',
          serviceStatus: null,
        },
        transaction,
      })
      expect(result).toBe(updated)
    })

    it('returns null and leaves the row alone when a status was recorded in the meantime', async () => {
      serviceRecipientModel.update.mockResolvedValueOnce([0])

      const result = await service.recordServiceStatusIfUnset(
        'service_id',
        'summons_id',
        data,
        { transaction },
      )

      expect(result).toBeNull()
      expect(serviceRecipientModel.findOne).not.toHaveBeenCalled()
    })
  })

  describe('findConfirmedByAppealCaseId', () => {
    it('loads the confirmed summonses of the appeal, oldest first, with their defendant rows', async () => {
      const found = [{ id: 'summons_id', defendants: [] }]
      summonsModel.findAll.mockResolvedValueOnce(found)

      const result = await service.findConfirmedByAppealCaseId(
        'appeal_case_id',
        { transaction },
      )

      expect(summonsModel.findAll).toHaveBeenCalledWith({
        where: {
          appealCaseId: 'appeal_case_id',
          confirmedDate: { [Op.ne]: null },
        },
        include: [
          {
            model: AppealSummonsDefendant,
            as: 'defendants',
            required: false,
            separate: true,
            order: [['created', 'ASC']],
          },
        ],
        order: [['confirmedDate', 'ASC']],
        transaction,
      })
      expect(result).toBe(found)
    })
  })
})
