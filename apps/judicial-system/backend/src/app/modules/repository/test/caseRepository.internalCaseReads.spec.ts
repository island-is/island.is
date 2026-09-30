import { Op } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  CaseIndictmentRulingDecision,
  CaseOrigin,
  CaseState,
  CaseType,
  completedIndictmentCaseStates,
  DateType,
} from '@island.is/judicial-system/types'

import { createTestingRepositoryModule } from './createTestingRepositoryModule'

import { Case } from '../models/case.model'
import { CaseDefendantPoliceCaseNumberRepositoryService } from '../services/caseDefendantPoliceCaseNumber.repository.service'
import { CaseRepositoryService } from '../services/caseRepository.service'
import {
  archivableCaseInclude,
  archivableCaseOrder,
  archivableCaseWhere,
  defendantIndictmentCaseInclude,
  defendantIndictmentCaseListInclude,
  indictmentReviewCaseInclude,
  verdictAppealDeadlineCaseInclude,
} from '../types/caseRepository.types'

// The node of an include graph that reads a given association
const included = (include: unknown, as: string) =>
  (include as { as?: string }[]).find((node) => node.as === as)

describe('CaseRepositoryService - internal case reads', () => {
  const cases = [{ id: uuid() }, { id: uuid() }] as Case[]
  const theCase = { id: uuid() } as Case

  let caseRepositoryService: CaseRepositoryService
  let mockCaseModel: { findOne: jest.Mock; findAll: jest.Mock }
  let mockResolvePoliceCaseNumbersForCases: jest.Mock

  // The options the one read was made with
  const findAllOptions = () => mockCaseModel.findAll.mock.calls[0][0]
  const findOneOptions = () => mockCaseModel.findOne.mock.calls[0][0]

  beforeEach(async () => {
    const {
      caseRepositoryService: service,
      caseModel,
      caseDefendantPoliceCaseNumberRepositoryService,
    } = await createTestingRepositoryModule()

    caseRepositoryService = service
    mockCaseModel = caseModel as unknown as {
      findOne: jest.Mock
      findAll: jest.Mock
    }
    mockResolvePoliceCaseNumbersForCases = (
      caseDefendantPoliceCaseNumberRepositoryService as jest.Mocked<CaseDefendantPoliceCaseNumberRepositoryService>
    ).resolvePoliceCaseNumbersForCases as jest.Mock

    mockCaseModel.findAll.mockResolvedValue(cases)
    mockCaseModel.findOne.mockResolvedValue(theCase)
  })

  describe('findNextCaseToArchive', () => {
    const transaction = {} as never
    let result: Case | null

    beforeEach(async () => {
      result = await caseRepositoryService.findNextCaseToArchive(transaction)
    })

    it('should read one archivable case in the callers transaction', () => {
      expect(findOneOptions()).toEqual({
        where: archivableCaseWhere,
        include: archivableCaseInclude,
        order: archivableCaseOrder,
        transaction,
      })
      expect(result).toBe(theCase)
    })

    it('should only consider cases that are not archived yet', () => {
      expect(archivableCaseWhere).toEqual(
        expect.objectContaining({
          [Op.and]: expect.arrayContaining([{ isArchived: false }]),
        }),
      )
    })

    it('should read every model the archive encrypts', () => {
      expect(
        archivableCaseInclude.map((node) => (node as { as: string }).as),
      ).toEqual([
        'defendants',
        'indictmentCounts',
        'caseFiles',
        'caseStrings',
        'appealCase',
        'appealDecisions',
      ])
      expect(included(archivableCaseInclude, 'indictmentCounts')).toEqual(
        expect.objectContaining({
          include: [expect.objectContaining({ as: 'offenses' })],
        }),
      )
    })

    it('should resolve the police case numbers in the same transaction', () => {
      expect(mockResolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(
        [theCase],
        { transaction },
      )
    })

    describe('no case to archive', () => {
      beforeEach(async () => {
        mockCaseModel.findOne.mockReset()
        mockResolvePoliceCaseNumbersForCases.mockClear()
        mockCaseModel.findOne.mockResolvedValue(null)

        result = await caseRepositoryService.findNextCaseToArchive(transaction)
      })

      it('should resolve nothing', () => {
        expect(result).toBeNull()
        expect(mockResolvePoliceCaseNumbersForCases).not.toHaveBeenCalled()
      })
    })
  })

  describe('findIndictmentCasesForVerdictAppealDeadlineCheck', () => {
    let result: Case[]

    beforeEach(async () => {
      result =
        await caseRepositoryService.findIndictmentCasesForVerdictAppealDeadlineCheck()
    })

    it('should only read ruled indictment cases that came from LOKE', () => {
      expect(findAllOptions().where).toEqual({
        state: completedIndictmentCaseStates,
        type: CaseType.INDICTMENT,
        indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
        origin: CaseOrigin.LOKE,
      })
      expect(findAllOptions().include).toBe(verdictAppealDeadlineCaseInclude)
      expect(result).toBe(cases)
    })

    it('should require a defendant with a verdict', () => {
      expect(included(verdictAppealDeadlineCaseInclude, 'defendants')).toEqual(
        expect.objectContaining({ required: true }),
      )
      const defendants = included(
        verdictAppealDeadlineCaseInclude,
        'defendants',
      ) as { include: unknown }
      expect(included(defendants.include, 'verdicts')).toEqual(
        expect.objectContaining({
          required: true,
          separate: true,
          order: [['created', 'DESC']],
        }),
      )
    })

    it('should resolve their police case numbers', () => {
      expect(mockResolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(cases, {
        transaction: undefined,
      })
    })
  })

  describe('findCasesWithHearingArrangementsOnDate', () => {
    const date = new Date('2026-09-17T11:30:00.000Z')
    const dateAsGiven = new Date(date)
    let result: Case[]

    beforeEach(async () => {
      result =
        await caseRepositoryService.findCasesWithHearingArrangementsOnDate(date)
    })

    it('should only read received cases, earliest hearing first', () => {
      expect(findAllOptions().where).toEqual({
        state: { [Op.eq]: CaseState.RECEIVED },
      })
      expect(findAllOptions().order).toEqual([
        [{ model: expect.anything(), as: 'dateLogs' }, 'date', 'ASC'],
      ])
      expect(result).toBe(cases)
    })

    it('should require an arraignment or court date inside the whole day', () => {
      const startOfDay = new Date(dateAsGiven)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(dateAsGiven)
      endOfDay.setHours(23, 59, 59, 999)

      expect(included(findAllOptions().include, 'dateLogs')).toEqual(
        expect.objectContaining({
          required: true,
          where: {
            dateType: [DateType.ARRAIGNMENT_DATE, DateType.COURT_DATE],
            date: { [Op.gte]: startOfDay, [Op.lte]: endOfDay },
          },
        }),
      )
    })

    it('should leave the date it was given alone', () => {
      expect(date).toEqual(dateAsGiven)
    })

    it('should resolve their police case numbers', () => {
      expect(mockResolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(cases, {
        transaction: undefined,
      })
    })
  })

  describe('findDefendantIndictmentCases', () => {
    const nationalId = '012345-6789'
    let result: Case[]

    beforeEach(async () => {
      result = await caseRepositoryService.findDefendantIndictmentCases(
        nationalId,
      )
    })

    it('should match the defendant on a national id without a separator', () => {
      expect(findAllOptions().where).toEqual({
        type: CaseType.INDICTMENT,
        state: [
          CaseState.RECEIVED,
          CaseState.WAITING_FOR_CANCELLATION,
          ...completedIndictmentCaseStates,
        ],
        '$defendants.national_id$': '0123456789',
      })
      expect(result).toBe(cases)
    })

    it('should read them by their arraignment, newest first', () => {
      expect(findAllOptions().include).toBe(defendantIndictmentCaseListInclude)
      expect(included(defendantIndictmentCaseListInclude, 'dateLogs')).toEqual(
        expect.objectContaining({
          required: true,
          where: { dateType: DateType.ARRAIGNMENT_DATE },
        }),
      )
      expect(findAllOptions().order).toEqual([
        [{ model: expect.anything(), as: 'dateLogs' }, 'created', 'DESC'],
      ])
    })

    it('should read only what the digital mailbox lists', () => {
      expect(findAllOptions().attributes).toEqual([
        'id',
        'courtCaseNumber',
        'type',
        'state',
      ])
    })

    it('should not resolve police case numbers it did not read', () => {
      expect(mockResolvePoliceCaseNumbersForCases).not.toHaveBeenCalled()
    })
  })

  describe('findIndictmentCaseByIdAndDefendantNationalId', () => {
    const caseId = uuid()
    const nationalId = '012345-6789'
    let result: Case | null

    beforeEach(async () => {
      result =
        await caseRepositoryService.findIndictmentCaseByIdAndDefendantNationalId(
          caseId,
          nationalId,
        )
    })

    it('should read one live indictment case for that defendant', () => {
      expect(findOneOptions().where).toEqual({
        id: caseId,
        type: CaseType.INDICTMENT,
        state: { [Op.not]: CaseState.DELETED },
        isArchived: false,
        '$defendants.national_id$': '0123456789',
      })
      expect(findOneOptions().include).toBe(defendantIndictmentCaseInclude)
      expect(findOneOptions().attributes).toEqual([
        'courtCaseNumber',
        'id',
        'state',
        'indictmentRulingDecision',
        'rulingDate',
        'ruling',
      ])
      expect(result).toBe(theCase)
    })

    it('should read the defendants subpoenas and verdicts, newest first', () => {
      const defendants = included(
        defendantIndictmentCaseInclude,
        'defendants',
      ) as { include: unknown }

      expect(included(defendants.include, 'subpoenas')).toEqual(
        expect.objectContaining({
          separate: true,
          order: [['created', 'DESC']],
        }),
      )
      expect(included(defendants.include, 'verdicts')).toEqual(
        expect.objectContaining({
          separate: true,
          order: [['created', 'DESC']],
        }),
      )
    })

    it('should not resolve police case numbers it did not read', () => {
      expect(mockResolvePoliceCaseNumbersForCases).not.toHaveBeenCalled()
    })
  })

  describe('findIndictmentCasesAwaitingReviewByRulingDate', () => {
    const indictmentReviewerId = uuid()
    const from = new Date('2026-09-01')
    const to = new Date('2026-09-02')
    let result: Case[]

    beforeEach(async () => {
      result =
        await caseRepositoryService.findIndictmentCasesAwaitingReviewByRulingDate(
          indictmentReviewerId,
          from,
          to,
        )
    })

    it('should bound the ruling date at both ends, inclusive', () => {
      expect(findAllOptions().where).toEqual({
        indictmentReviewerId,
        indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
        rulingDate: { [Op.gte]: from, [Op.lte]: to },
      })
      expect(result).toBe(cases)
    })

    it('should only read defendants no one has decided on yet', () => {
      expect(findAllOptions().include).toBe(indictmentReviewCaseInclude)
      expect(included(indictmentReviewCaseInclude, 'defendants')).toEqual(
        expect.objectContaining({
          required: true,
          where: { indictmentReviewDecision: null },
        }),
      )
    })

    it('should resolve their police case numbers', () => {
      expect(mockResolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(cases, {
        transaction: undefined,
      })
    })
  })
})
