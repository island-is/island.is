import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { ApplicationService } from './application.service'
import { Application } from './application.model'
import { ScheduledNotification } from '../scheduledNotification/scheduledNotifications.model'

describe('ApplicationService', () => {
  let service: ApplicationService
  let findAllSpy: jest.Mock

  beforeEach(async () => {
    findAllSpy = jest.fn().mockResolvedValue([])

    const module = await Test.createTestingModule({
      providers: [
        ApplicationService,
        {
          provide: getModelToken(Application),
          useValue: { findAll: findAllSpy, findOne: jest.fn() },
        },
        {
          provide: getModelToken(ScheduledNotification),
          useValue: { findAll: jest.fn() },
        },
        {
          provide: Sequelize,
          useValue: { query: jest.fn() },
        },
      ],
    }).compile()

    service = module.get<ApplicationService>(ApplicationService)
  })

  describe('findAllByNationalIdAndFilters', () => {
    const nationalId = '0101302989'

    it('should include pruneAt filter when showPruned is false', async () => {
      await service.findAllByNationalIdAndFilters(
        nationalId,
        undefined,
        undefined,
        false,
      )

      expect(findAllSpy).toHaveBeenCalledTimes(1)
      const where = findAllSpy.mock.calls[0][0].where
      const andConditions = where[Op.and]

      expect(andConditions).toHaveLength(2)

      const pruneFilter = andConditions[1]
      expect(pruneFilter[Op.or]).toBeDefined()

      const orConditions = pruneFilter[Op.or]
      expect(orConditions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ pruneAt: { [Op.is]: null } }),
          expect.objectContaining({
            pruneAt: { [Op.gt]: expect.any(Date) },
          }),
        ]),
      )
    })

    it('should NOT include pruneAt filter when showPruned is true', async () => {
      await service.findAllByNationalIdAndFilters(
        nationalId,
        undefined,
        undefined,
        true,
      )

      expect(findAllSpy).toHaveBeenCalledTimes(1)
      const where = findAllSpy.mock.calls[0][0].where
      const andConditions = where[Op.and]

      expect(andConditions).toHaveLength(2)

      const pruneFilter = andConditions[1]
      expect(pruneFilter).toEqual({})
    })

    it('should include pruneAt filter when showPruned is undefined', async () => {
      await service.findAllByNationalIdAndFilters(nationalId)

      expect(findAllSpy).toHaveBeenCalledTimes(1)
      const where = findAllSpy.mock.calls[0][0].where
      const andConditions = where[Op.and]
      const pruneFilter = andConditions[1]

      expect(pruneFilter[Op.or]).toBeDefined()
    })

    it('should always include isListed and applicant access conditions', async () => {
      await service.findAllByNationalIdAndFilters(
        nationalId,
        undefined,
        undefined,
        true,
      )

      const where = findAllSpy.mock.calls[0][0].where

      expect(where.isListed).toEqual({ [Op.eq]: true })

      const applicantCondition = where[Op.and][0]
      expect(applicantCondition[Op.or]).toEqual(
        expect.arrayContaining([
          { applicant: { [Op.eq]: nationalId } },
          { assignees: { [Op.contains]: [nationalId] } },
        ]),
      )
    })

    it('should apply typeId filter when provided', async () => {
      await service.findAllByNationalIdAndFilters(
        nationalId,
        'ExampleType1,ExampleType2',
        undefined,
        true,
      )

      const where = findAllSpy.mock.calls[0][0].where
      expect(where.typeId).toEqual({
        [Op.in]: ['ExampleType1', 'ExampleType2'],
      })
    })

    it('should apply status filter when provided', async () => {
      await service.findAllByNationalIdAndFilters(
        nationalId,
        undefined,
        'draft,inprogress',
        true,
      )

      const where = findAllSpy.mock.calls[0][0].where
      expect(where.status).toEqual({
        [Op.in]: ['draft', 'inprogress'],
      })
    })

    it('should order results by modified DESC', async () => {
      await service.findAllByNationalIdAndFilters(nationalId)

      const order = findAllSpy.mock.calls[0][0].order
      expect(order).toEqual([['modified', 'DESC']])
    })
  })
})
