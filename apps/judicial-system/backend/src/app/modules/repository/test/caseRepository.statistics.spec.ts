import { Op } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { createTestingRepositoryModule } from './createTestingRepositoryModule'

import { Case } from '../models/case.model'
import { CaseDefendantPoliceCaseNumberRepositoryService } from '../services/caseDefendantPoliceCaseNumber.repository.service'
import { CaseRepositoryService } from '../services/caseRepository.service'
import {
  caseStatisticsInclude,
  indictmentCaseEventExportInclude,
  requestCaseEventExportInclude,
} from '../types/caseRepository.types'

describe('CaseRepositoryService - statistics reads', () => {
  const cases = [{ id: uuid() }, { id: uuid() }] as Case[]

  let caseRepositoryService: CaseRepositoryService
  let mockCaseModel: { findAll: jest.Mock }
  let mockResolvePoliceCaseNumbersForCases: jest.Mock

  // The options the one findAll call was made with
  const findAllOptions = () => mockCaseModel.findAll.mock.calls[0][0]

  beforeEach(async () => {
    const {
      caseRepositoryService: service,
      caseModel,
      caseDefendantPoliceCaseNumberRepositoryService,
    } = await createTestingRepositoryModule()

    caseRepositoryService = service
    mockCaseModel = caseModel as unknown as { findAll: jest.Mock }
    mockResolvePoliceCaseNumbersForCases = (
      caseDefendantPoliceCaseNumberRepositoryService as jest.Mocked<CaseDefendantPoliceCaseNumberRepositoryService>
    ).resolvePoliceCaseNumbersForCases as jest.Mock

    mockCaseModel.findAll.mockResolvedValue(cases)
  })

  describe('findCasesForStatistics', () => {
    describe('no period and no institution', () => {
      let result: Case[]

      beforeEach(async () => {
        result = await caseRepositoryService.findCasesForStatistics({})
      })

      it('should count every case that left the prosecutors desk', () => {
        expect(findAllOptions().where).toEqual({
          state: {
            [Op.not]: [
              CaseState.DELETED,
              CaseState.DRAFT,
              CaseState.NEW,
              CaseState.WAITING_FOR_CONFIRMATION,
            ],
          },
        })
        expect(result).toBe(cases)
      })

      it('should read the indictment confirmation event with them', () => {
        expect(findAllOptions().include).toBe(caseStatisticsInclude)
      })

      it('should resolve their police case numbers', () => {
        expect(mockResolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(
          cases,
          { transaction: undefined },
        )
      })
    })

    describe('a period with both ends', () => {
      const from = new Date('2026-01-01')
      const to = new Date('2026-02-01')

      beforeEach(async () => {
        await caseRepositoryService.findCasesForStatistics({ from, to })
      })

      it('should bound the creation date at both ends, inclusive', () => {
        expect(findAllOptions().where.created).toEqual({
          [Op.gte]: from,
          [Op.lte]: to,
        })
      })
    })

    describe('a period with only a start', () => {
      const from = new Date('2026-01-01')

      beforeEach(async () => {
        await caseRepositoryService.findCasesForStatistics({ from })
      })

      it('should bound the creation date from below only', () => {
        expect(findAllOptions().where.created).toEqual({ [Op.gte]: from })
      })
    })

    describe('a period with only an end', () => {
      const to = new Date('2026-02-01')

      beforeEach(async () => {
        await caseRepositoryService.findCasesForStatistics({ to })
      })

      it('should bound the creation date from above only', () => {
        expect(findAllOptions().where.created).toEqual({ [Op.lte]: to })
      })
    })

    describe('an institution', () => {
      const institutionId = uuid()

      beforeEach(async () => {
        await caseRepositoryService.findCasesForStatistics({ institutionId })
      })

      // An institution is asked about the cases it handles, whether it
      // prosecutes them or presides over them
      it('should match the court or the prosecutors office, not both', () => {
        expect(findAllOptions().where[Op.or]).toEqual([
          { courtId: institutionId },
          { prosecutorsOfficeId: institutionId },
        ])
      })

      it('should not bound the creation date', () => {
        expect(findAllOptions().where.created).toBeUndefined()
      })
    })

    describe('no cases in the period', () => {
      beforeEach(async () => {
        mockCaseModel.findAll.mockResolvedValueOnce([])

        await caseRepositoryService.findCasesForStatistics({})
      })

      it('should not resolve police case numbers', () => {
        expect(mockResolvePoliceCaseNumbersForCases).not.toHaveBeenCalled()
      })
    })

    describe('the read fails', () => {
      const error = new Error('Some error')

      it('should rethrow', async () => {
        mockCaseModel.findAll.mockRejectedValueOnce(error)

        await expect(
          caseRepositoryService.findCasesForStatistics({}),
        ).rejects.toThrow(error)
      })
    })
  })

  describe('findRequestCasesForEventExport', () => {
    let result: Case[]

    beforeEach(async () => {
      result = await caseRepositoryService.findRequestCasesForEventExport()
    })

    it('should read every case that is not an indictment, oldest first', () => {
      expect(findAllOptions().where).toEqual({
        type: { [Op.not]: [CaseType.INDICTMENT] },
      })
      expect(findAllOptions().order).toEqual([['created', 'ASC']])
      expect(result).toBe(cases)
    })

    it('should read the graph the export derives its rows from', () => {
      expect(findAllOptions().include).toBe(requestCaseEventExportInclude)
    })

    it('should resolve their police case numbers', () => {
      expect(mockResolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(cases, {
        transaction: undefined,
      })
    })

    describe('the read fails', () => {
      const error = new Error('Some error')

      it('should rethrow', async () => {
        mockCaseModel.findAll.mockRejectedValueOnce(error)

        await expect(
          caseRepositoryService.findRequestCasesForEventExport(),
        ).rejects.toThrow(error)
      })
    })
  })

  describe('findIndictmentCasesForEventExport', () => {
    let result: Case[]

    beforeEach(async () => {
      result = await caseRepositoryService.findIndictmentCasesForEventExport()
    })

    it('should read every indictment case, oldest first', () => {
      expect(findAllOptions().where).toEqual({ type: CaseType.INDICTMENT })
      expect(findAllOptions().order).toEqual([['created', 'ASC']])
      expect(result).toBe(cases)
    })

    it('should read the graph the export derives its rows from', () => {
      expect(findAllOptions().include).toBe(indictmentCaseEventExportInclude)
    })

    // The export reads a case's police case numbers off the case itself
    it('should resolve their police case numbers', () => {
      expect(mockResolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(cases, {
        transaction: undefined,
      })
    })

    describe('the read fails', () => {
      const error = new Error('Some error')

      it('should rethrow', async () => {
        mockCaseModel.findAll.mockRejectedValueOnce(error)

        await expect(
          caseRepositoryService.findIndictmentCasesForEventExport(),
        ).rejects.toThrow(error)
      })
    })
  })
})
