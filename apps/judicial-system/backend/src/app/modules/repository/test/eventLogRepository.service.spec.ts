import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { EventType, UserRole } from '@island.is/judicial-system/types'

import { EventLog } from '../models/eventLog.model'
import { EventLogRepositoryService } from '../services/eventLogRepository.service'

describe('EventLogRepositoryService', () => {
  let service: EventLogRepositoryService
  let model: { findOne: jest.Mock; create: jest.Mock; count: jest.Mock }

  beforeEach(async () => {
    model = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      count: jest.fn().mockResolvedValue([]),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(EventLog), useValue: model },
        EventLogRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(EventLogRepositoryService)
  })

  describe('existsForCaseAndType', () => {
    it('queries on event type and case id and reports a hit', async () => {
      model.findOne.mockResolvedValueOnce({ id: 'some-event-log-id' })

      const result = await service.existsForCaseAndType(
        EventType.INDICTMENT_CONFIRMED,
        'some-case-id',
      )

      expect(model.findOne).toHaveBeenCalledWith({
        where: {
          eventType: EventType.INDICTMENT_CONFIRMED,
          caseId: 'some-case-id',
        },
        transaction: undefined,
      })
      expect(result).toBe(true)
    })

    it('adds the user role to the query when one is given', async () => {
      const transaction = {} as never

      const result = await service.existsForCaseAndType(
        EventType.APPEAL_RESULT_ACCESSED,
        'some-case-id',
        UserRole.PROSECUTOR,
        { transaction },
      )

      expect(model.findOne).toHaveBeenCalledWith({
        where: {
          eventType: EventType.APPEAL_RESULT_ACCESSED,
          caseId: 'some-case-id',
          userRole: UserRole.PROSECUTOR,
        },
        transaction,
      })
      expect(result).toBe(false)
    })

    it('leaves out the case id when there is none', async () => {
      await service.existsForCaseAndType(EventType.LOGIN)

      expect(model.findOne).toHaveBeenCalledWith({
        where: { eventType: EventType.LOGIN },
        transaction: undefined,
      })
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(
        service.existsForCaseAndType(EventType.LOGIN, 'some-case-id'),
      ).rejects.toThrow(error)
    })
  })

  describe('create', () => {
    it('creates the event log in the given transaction', async () => {
      const transaction = {} as never
      const created = { id: 'some-event-log-id' }
      model.create.mockResolvedValueOnce(created)

      const result = await service.create(
        { eventType: EventType.LOGIN, nationalId: 'some-national-id' },
        { transaction },
      )

      expect(model.create).toHaveBeenCalledWith(
        { eventType: EventType.LOGIN, nationalId: 'some-national-id' },
        { transaction },
      )
      expect(result).toBe(created)
    })

    it('rethrows when the creation fails', async () => {
      const error = new Error('Some error')
      model.create.mockRejectedValueOnce(error)

      await expect(
        service.create({ eventType: EventType.LOGIN }),
      ).rejects.toThrow(error)
    })
  })

  describe('countLoginsByNationalIds', () => {
    it('groups and aggregates logins and returns typed rows', async () => {
      const latest = new Date()
      model.count.mockResolvedValueOnce([
        {
          nationalId: 'some-national-id',
          userRole: UserRole.DISTRICT_COURT_JUDGE,
          institutionName: 'Some institution',
          latest,
          count: 3,
        },
      ])

      const result = await service.countLoginsByNationalIds([
        'some-national-id',
      ])

      const { group, attributes, where } = model.count.mock.calls[0][0]

      expect(group).toEqual(['nationalId', 'userRole', 'institutionName'])
      expect(where).toEqual({
        eventType: [EventType.LOGIN, EventType.LOGIN_BYPASS],
        nationalId: ['some-national-id'],
      })
      expect(attributes.slice(0, 3)).toEqual([
        'nationalId',
        'userRole',
        'institutionName',
      ])
      expect(attributes[3]).toMatchObject([
        { fn: 'max', args: [{ col: 'created' }] },
        'latest',
      ])
      expect(attributes[4]).toMatchObject([
        { fn: 'count', args: [{ col: 'national_id' }] },
        'count',
      ])
      expect(result).toEqual([
        {
          nationalId: 'some-national-id',
          userRole: UserRole.DISTRICT_COURT_JUDGE,
          institutionName: 'Some institution',
          latest,
          count: 3,
        },
      ])
    })

    it('rethrows when the count fails', async () => {
      const error = new Error('Some error')
      model.count.mockRejectedValueOnce(error)

      await expect(
        service.countLoginsByNationalIds(['some-national-id']),
      ).rejects.toThrow(error)
    })
  })
})
