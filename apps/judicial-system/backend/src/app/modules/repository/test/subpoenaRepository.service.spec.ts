import { Op, Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { ServiceStatus } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
import { CourtSession } from '../models/courtSession.model'
import { Defendant } from '../models/defendant.model'
import { Institution } from '../models/institution.model'
import { Subpoena } from '../models/subpoena.model'
import { User } from '../models/user.model'
import { SubpoenaRepositoryService } from '../services/subpoenaRepository.service'

// The read graph every subpoena route depends on. Pinned here so that dropping
// a leg of it fails a test rather than an unrendered document.
const expectedInclude = [
  {
    model: Case,
    as: 'case',
    include: [
      { model: User, as: 'judge' },
      { model: User, as: 'registrar' },
      { model: Institution, as: 'prosecutorsOffice' },
      { model: Institution, as: 'court' },
      { model: CourtSession, as: 'courtSessions' },
    ],
  },
  { model: Defendant, as: 'defendant' },
]

describe('SubpoenaRepositoryService', () => {
  const caseId = 'some-case-id'
  const newCaseId = 'some-new-case-id'
  const defendantId = 'some-defendant-id'
  const subpoenaId = 'some-subpoena-id'
  const policeSubpoenaId = 'some-police-subpoena-id'
  const institutionId = 'some-institution-id'
  const from = new Date('2026-01-01')
  const to = new Date('2026-02-01')
  const transaction = {} as Transaction

  let service: SubpoenaRepositoryService
  let model: {
    findOne: jest.Mock
    findAll: jest.Mock
    count: jest.Mock
    update: jest.Mock
  }

  beforeEach(async () => {
    model = {
      findOne: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      update: jest.fn().mockResolvedValue([0]),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(Subpoena), useValue: model },
        SubpoenaRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(SubpoenaRepositoryService)
  })

  describe('findById', () => {
    it('reads the subpoena with its case and defendant', async () => {
      const subpoena = { id: subpoenaId }
      model.findOne.mockResolvedValueOnce(subpoena)

      const result = await service.findById(subpoenaId)

      expect(model.findOne).toHaveBeenCalledWith({
        include: expectedInclude,
        where: { id: subpoenaId },
        transaction: undefined,
      })
      expect(result).toBe(subpoena)
    })

    it('reads within the given transaction', async () => {
      await service.findById(subpoenaId, { transaction })

      expect(model.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ transaction }),
      )
    })

    it('reports no subpoena rather than throwing', async () => {
      const result = await service.findById(subpoenaId)

      expect(result).toBeNull()
    })

    it('rethrows when the read fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(service.findById(subpoenaId)).rejects.toThrow(error)
    })
  })

  describe('findByPoliceSubpoenaId', () => {
    it('reads the subpoena with its case and defendant', async () => {
      const subpoena = { id: subpoenaId, policeSubpoenaId }
      model.findOne.mockResolvedValueOnce(subpoena)

      const result = await service.findByPoliceSubpoenaId(policeSubpoenaId)

      expect(model.findOne).toHaveBeenCalledWith({
        include: expectedInclude,
        where: { policeSubpoenaId },
      })
      expect(result).toBe(subpoena)
    })

    it('reports no subpoena rather than throwing', async () => {
      const result = await service.findByPoliceSubpoenaId(policeSubpoenaId)

      expect(result).toBeNull()
    })

    it('rethrows when the read fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(
        service.findByPoliceSubpoenaId(policeSubpoenaId),
      ).rejects.toThrow(error)
    })
  })

  describe('findEarliestPoliceSubpoenaCreatedDate', () => {
    it('reads the oldest subpoena that reached the police, ignoring any period', async () => {
      const created = new Date('2025-06-01')
      model.findOne.mockResolvedValueOnce({ created })

      const result = await service.findEarliestPoliceSubpoenaCreatedDate()

      expect(model.findOne).toHaveBeenCalledWith({
        where: { policeSubpoenaId: { [Op.ne]: null } },
        order: [['created', 'ASC']],
        attributes: ['created'],
      })
      expect(result).toBe(created)
    })

    it('reports no date when no subpoena has reached the police', async () => {
      const result = await service.findEarliestPoliceSubpoenaCreatedDate()

      expect(result).toBeNull()
    })

    it('rethrows when the read fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(
        service.findEarliestPoliceSubpoenaCreatedDate(),
      ).rejects.toThrow(error)
    })
  })

  describe('countPoliceSubpoenas', () => {
    it('counts every subpoena that reached the police when nothing narrows it', async () => {
      model.count.mockResolvedValueOnce(7)

      const result = await service.countPoliceSubpoenas({})

      expect(model.count).toHaveBeenCalledWith({
        where: { policeSubpoenaId: { [Op.ne]: null } },
        include: [],
        distinct: true,
      })
      expect(result).toBe(7)
    })

    it('bounds the count by the start of the period', async () => {
      await service.countPoliceSubpoenas({ from })

      expect(model.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            policeSubpoenaId: { [Op.ne]: null },
            created: { [Op.gte]: from },
          },
        }),
      )
    })

    it('bounds the count by the end of the period', async () => {
      await service.countPoliceSubpoenas({ to })

      expect(model.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            policeSubpoenaId: { [Op.ne]: null },
            created: { [Op.lte]: to },
          },
        }),
      )
    })

    it('bounds the count by both ends of the period', async () => {
      await service.countPoliceSubpoenas({ from, to })

      expect(model.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            policeSubpoenaId: { [Op.ne]: null },
            created: { [Op.gte]: from, [Op.lte]: to },
          },
        }),
      )
    })

    it('counts only subpoenas whose case the institution handles', async () => {
      await service.countPoliceSubpoenas({ institutionId })

      expect(model.count).toHaveBeenCalledWith(
        expect.objectContaining({
          include: [
            {
              model: Case,
              required: true,
              attributes: [],
              where: {
                [Op.or]: [
                  { courtId: institutionId },
                  { prosecutorsOfficeId: institutionId },
                ],
              },
            },
          ],
        }),
      )
    })

    it('rethrows when the count fails', async () => {
      const error = new Error('Some error')
      model.count.mockRejectedValueOnce(error)

      await expect(service.countPoliceSubpoenas({})).rejects.toThrow(error)
    })
  })

  describe('countPoliceSubpoenasByServiceStatus', () => {
    it('reports a typed row for each service status', async () => {
      model.findAll.mockResolvedValueOnce([
        {
          serviceStatus: ServiceStatus.ELECTRONICALLY,
          count: '3',
          averageServiceTimeMs: '86400000.5',
        },
        {
          serviceStatus: null,
          count: '2',
          averageServiceTimeMs: null,
        },
      ])

      const result = await service.countPoliceSubpoenasByServiceStatus({})

      expect(result).toEqual([
        {
          serviceStatus: ServiceStatus.ELECTRONICALLY,
          count: 3,
          averageServiceTimeMs: 86400000.5,
        },
        { serviceStatus: null, count: 2, averageServiceTimeMs: null },
      ])
    })

    it('groups by service status over the subpoenas that reached the police', async () => {
      await service.countPoliceSubpoenasByServiceStatus({})

      expect(model.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { policeSubpoenaId: { [Op.ne]: null } },
          include: [],
          group: ['serviceStatus'],
          raw: true,
        }),
      )
    })

    it('narrows the groups by period and institution', async () => {
      await service.countPoliceSubpoenasByServiceStatus({
        from,
        to,
        institutionId,
      })

      expect(model.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            policeSubpoenaId: { [Op.ne]: null },
            created: { [Op.gte]: from, [Op.lte]: to },
          },
          include: [
            {
              model: Case,
              required: true,
              attributes: [],
              where: {
                [Op.or]: [
                  { courtId: institutionId },
                  { prosecutorsOfficeId: institutionId },
                ],
              },
            },
          ],
        }),
      )
    })

    it('rethrows when the aggregation fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(
        service.countPoliceSubpoenasByServiceStatus({}),
      ).rejects.toThrow(error)
    })
  })

  describe('moveAllForDefendantToCase', () => {
    it('moves the subpoenas of the defendant within the case to the new case and reports the row count', async () => {
      model.update.mockResolvedValueOnce([2])

      const result = await service.moveAllForDefendantToCase(
        caseId,
        defendantId,
        newCaseId,
        { transaction },
      )

      expect(model.update).toHaveBeenCalledWith(
        { caseId: newCaseId },
        { where: { caseId, defendantId }, transaction },
      )
      expect(result).toBe(2)
    })

    it('reports zero when the defendant has no subpoenas', async () => {
      const result = await service.moveAllForDefendantToCase(
        caseId,
        defendantId,
        newCaseId,
        { transaction },
      )

      expect(result).toBe(0)
    })

    it('rethrows when the move fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.moveAllForDefendantToCase(caseId, defendantId, newCaseId, {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })
})
