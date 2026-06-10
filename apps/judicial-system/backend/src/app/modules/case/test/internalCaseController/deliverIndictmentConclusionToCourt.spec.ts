import { v4 as uuid } from 'uuid'

import {
  CaseIndictmentRulingDecision,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { randomDate } from '../../../../test'
import { CourtService } from '../../../court'
import { buildIndictmentConclusionContent } from '../../../court/court.service'
import { Case, DefendantRepositoryService } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalCaseController - Deliver indictment conclusion to court', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = 'S-1/2026'
  const rulingDate = randomDate()

  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    court: { name: courtName },
    courtCaseNumber,
    indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    rulingDate,
    rulingModifiedHistory: null,
  } as Case

  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockUpdateIndictmentCaseWithConclusion =
      mockCourtService.updateIndictmentCaseWithConclusion as jest.Mock
    mockUpdateIndictmentCaseWithConclusion.mockResolvedValue(uuid())

    givenWhenThen = async () => {
      const then = {} as Then

      await internalCaseController
        .deliverIndictmentConclusionToCourt(caseId, theCase, {
          user,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('case-level RULING conclusion delivered', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should deliver the indictment conclusion', () => {
      expect(
        mockCourtService.updateIndictmentCaseWithConclusion,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        buildIndictmentConclusionContent({
          courtCaseNumber,
          isCorrection: false,
          indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
          rulingDate,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('split-off conclusion delivered for defendant on child case', () => {
    const defendantId = uuid()
    const defendantNationalId = '1111111111'
    const splitCaseNumber = 'S-2/2026'
    const splitRulingDate = randomDate()

    const parentCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      court: { name: courtName },
      courtCaseNumber,
      defendants: [],
    } as Case

    let mockDefendantRepositoryService: DefendantRepositoryService
    let then: Then

    beforeEach(async () => {
      const { courtService, internalCaseController, defendantRepositoryService } =
        await createTestingCaseModule()

      mockCourtService = courtService
      mockDefendantRepositoryService = defendantRepositoryService

      const mockUpdateIndictmentCaseWithConclusion =
        mockCourtService.updateIndictmentCaseWithConclusion as jest.Mock
      mockUpdateIndictmentCaseWithConclusion.mockResolvedValue(uuid())

      const mockFindOne = mockDefendantRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValue({
        id: defendantId,
        nationalId: defendantNationalId,
      })

      then = await internalCaseController
        .deliverIndictmentConclusionToCourt(caseId, parentCase, {
          user,
          defendantId,
          splitCaseNumber,
          rulingDate: splitRulingDate.toISOString(),
        })
        .then((result) => ({ result, error: undefined as unknown as Error }))
        .catch((error) => ({
          result: undefined as unknown as DeliverResponse,
          error,
        }))
    })

    it('should look up the defendant by id and deliver split-off conclusion', () => {
      expect(mockDefendantRepositoryService.findOne).toHaveBeenCalledWith({
        where: { id: defendantId },
      })

      expect(
        mockCourtService.updateIndictmentCaseWithConclusion,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        buildIndictmentConclusionContent({
          courtCaseNumber,
          rulingDate: splitRulingDate.toISOString(),
          defendantNationalId,
          splitCaseNumber,
        }),
        defendantId,
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('split-off conclusion uses case created when body omits rulingDate', () => {
    const defendantId = uuid()
    const defendantNationalId = '1111111111'
    const splitCaseNumber = 'S-2/2026'
    const caseCreated = randomDate()

    const parentCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      court: { name: courtName },
      courtCaseNumber,
      created: caseCreated,
      defendants: [],
    } as Case

    let mockDefendantRepositoryService: DefendantRepositoryService
    let then: Then

    beforeEach(async () => {
      const { courtService, internalCaseController, defendantRepositoryService } =
        await createTestingCaseModule()

      mockCourtService = courtService
      mockDefendantRepositoryService = defendantRepositoryService

      const mockUpdateIndictmentCaseWithConclusion =
        mockCourtService.updateIndictmentCaseWithConclusion as jest.Mock
      mockUpdateIndictmentCaseWithConclusion.mockResolvedValue(uuid())

      const mockFindOne = mockDefendantRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValue({
        id: defendantId,
        nationalId: defendantNationalId,
      })

      then = await internalCaseController
        .deliverIndictmentConclusionToCourt(caseId, parentCase, {
          user,
          defendantId,
          splitCaseNumber,
        })
        .then((result) => ({ result, error: undefined as unknown as Error }))
        .catch((error) => ({
          result: undefined as unknown as DeliverResponse,
          error,
        }))
    })

    it('should fall back to case created and deliver split-off conclusion', () => {
      expect(
        mockCourtService.updateIndictmentCaseWithConclusion,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        buildIndictmentConclusionContent({
          courtCaseNumber,
          rulingDate: caseCreated,
          defendantNationalId,
          splitCaseNumber,
        }),
        defendantId,
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('withdrawal conclusion with prior judge assignment in robot_log', () => {
    const withdrawalCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      court: { name: courtName },
      courtCaseNumber,
      indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
      rulingDate,
      rulingModifiedHistory: null,
      judgeId: null,
      judge: undefined,
    } as Case

    let then: Then

    beforeEach(async () => {
      const { courtService, internalCaseController } =
        await createTestingCaseModule()

      mockCourtService = courtService

      const mockUpdateIndictmentCaseWithConclusion =
        mockCourtService.updateIndictmentCaseWithConclusion as jest.Mock
      mockUpdateIndictmentCaseWithConclusion.mockResolvedValue(uuid())

      const mockHasPriorIndictmentJudgeAssignment =
        mockCourtService.hasPriorIndictmentJudgeAssignment as jest.Mock
      mockHasPriorIndictmentJudgeAssignment.mockResolvedValue(true)

      then = await internalCaseController
        .deliverIndictmentConclusionToCourt(caseId, withdrawalCase, {
          user,
        })
        .then((result) => ({ result, error: undefined as unknown as Error }))
        .catch((error) => ({
          result: undefined as unknown as DeliverResponse,
          error,
        }))
    })

    it('should set wasAssignedToJudge from robot_log when judgeId is cleared', () => {
      expect(
        mockCourtService.hasPriorIndictmentJudgeAssignment,
      ).toHaveBeenCalledWith(caseId)

      expect(
        mockCourtService.updateIndictmentCaseWithConclusion,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        buildIndictmentConclusionContent({
          courtCaseNumber,
          isCorrection: false,
          indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
          rulingDate,
          wasAssignedToJudge: true,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('per-defendant DISMISSAL conclusion delivered', () => {
    const defendantId = uuid()
    const defendantNationalId = '2222222222'
    const perDefendantRulingDate = randomDate()

    const caseWithDefendant = {
      id: caseId,
      type: CaseType.INDICTMENT,
      court: { name: courtName },
      courtCaseNumber,
      defendants: [{ id: defendantId, nationalId: defendantNationalId }],
    } as Case

    let then: Then

    beforeEach(async () => {
      const { courtService, internalCaseController } =
        await createTestingCaseModule()

      mockCourtService = courtService

      const mockUpdateIndictmentCaseWithConclusion =
        mockCourtService.updateIndictmentCaseWithConclusion as jest.Mock
      mockUpdateIndictmentCaseWithConclusion.mockResolvedValue(uuid())

      then = await internalCaseController
        .deliverIndictmentConclusionToCourt(caseId, caseWithDefendant, {
          user,
          defendantId,
          indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
          rulingDate: perDefendantRulingDate.toISOString(),
        })
        .then((result) => ({ result, error: undefined as unknown as Error }))
        .catch((error) => ({
          result: undefined as unknown as DeliverResponse,
          error,
        }))
    })

    it('should deliver per-defendant conclusion with defendant national id', () => {
      expect(
        mockCourtService.updateIndictmentCaseWithConclusion,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        buildIndictmentConclusionContent({
          courtCaseNumber,
          indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
          rulingDate: perDefendantRulingDate.toISOString(),
          defendantNationalId,
        }),
        defendantId,
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('withdrawal conclusion with judge assigned', () => {
    const judgeNationalId = '0000000000'
    const withdrawalCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      court: { name: courtName },
      courtCaseNumber,
      indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
      rulingDate,
      rulingModifiedHistory: null,
      judgeId: uuid(),
      judge: { nationalId: judgeNationalId },
    } as Case

    let then: Then

    beforeEach(async () => {
      const { courtService, internalCaseController } =
        await createTestingCaseModule()

      mockCourtService = courtService

      const mockUpdateIndictmentCaseWithConclusion =
        mockCourtService.updateIndictmentCaseWithConclusion as jest.Mock
      mockUpdateIndictmentCaseWithConclusion.mockResolvedValue(uuid())

      then = await internalCaseController
        .deliverIndictmentConclusionToCourt(caseId, withdrawalCase, {
          user,
        })
        .then((result) => ({ result, error: undefined as unknown as Error }))
        .catch((error) => ({
          result: undefined as unknown as DeliverResponse,
          error,
        }))
    })

    it('should set wasAssignedToJudge and judgeNationalId from the case', () => {
      expect(
        mockCourtService.hasPriorIndictmentJudgeAssignment,
      ).not.toHaveBeenCalled()

      expect(
        mockCourtService.updateIndictmentCaseWithConclusion,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        buildIndictmentConclusionContent({
          courtCaseNumber,
          isCorrection: false,
          indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
          rulingDate,
          wasAssignedToJudge: true,
          judgeNationalId,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('withdrawal conclusion without judge assignment', () => {
    const withdrawalCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      court: { name: courtName },
      courtCaseNumber,
      indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
      rulingDate,
      rulingModifiedHistory: null,
      judgeId: null,
      judge: undefined,
    } as Case

    let then: Then

    beforeEach(async () => {
      const { courtService, internalCaseController } =
        await createTestingCaseModule()

      mockCourtService = courtService

      const mockUpdateIndictmentCaseWithConclusion =
        mockCourtService.updateIndictmentCaseWithConclusion as jest.Mock
      mockUpdateIndictmentCaseWithConclusion.mockResolvedValue(uuid())

      const mockHasPriorIndictmentJudgeAssignment =
        mockCourtService.hasPriorIndictmentJudgeAssignment as jest.Mock
      mockHasPriorIndictmentJudgeAssignment.mockResolvedValue(false)

      then = await internalCaseController
        .deliverIndictmentConclusionToCourt(caseId, withdrawalCase, {
          user,
        })
        .then((result) => ({ result, error: undefined as unknown as Error }))
        .catch((error) => ({
          result: undefined as unknown as DeliverResponse,
          error,
        }))
    })

    it('should set wasAssignedToJudge to false when no judge and no robot_log', () => {
      expect(
        mockCourtService.hasPriorIndictmentJudgeAssignment,
      ).toHaveBeenCalledWith(caseId)

      expect(
        mockCourtService.updateIndictmentCaseWithConclusion,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        buildIndictmentConclusionContent({
          courtCaseNumber,
          isCorrection: false,
          indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
          rulingDate,
          wasAssignedToJudge: false,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('MERGE conclusion delivered', () => {
    const mergeCaseNumber = 'S-100/2025'
    const mergeCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      court: { name: courtName },
      courtCaseNumber,
      indictmentRulingDecision: CaseIndictmentRulingDecision.MERGE,
      rulingDate,
      rulingModifiedHistory: null,
      mergeCase: { courtCaseNumber: mergeCaseNumber },
    } as Case

    let then: Then

    beforeEach(async () => {
      const { courtService, internalCaseController } =
        await createTestingCaseModule()

      mockCourtService = courtService

      const mockUpdateIndictmentCaseWithConclusion =
        mockCourtService.updateIndictmentCaseWithConclusion as jest.Mock
      mockUpdateIndictmentCaseWithConclusion.mockResolvedValue(uuid())

      then = await internalCaseController
        .deliverIndictmentConclusionToCourt(caseId, mergeCase, {
          user,
        })
        .then((result) => ({ result, error: undefined as unknown as Error }))
        .catch((error) => ({
          result: undefined as unknown as DeliverResponse,
          error,
        }))
    })

    it('should include mergeCaseNumber in the payload', () => {
      expect(
        mockCourtService.updateIndictmentCaseWithConclusion,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        buildIndictmentConclusionContent({
          courtCaseNumber,
          isCorrection: false,
          indictmentRulingDecision: CaseIndictmentRulingDecision.MERGE,
          rulingDate,
          mergeCaseNumber,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('missing court case number', () => {
    const caseWithoutCourtCaseNumber = {
      id: caseId,
      type: CaseType.INDICTMENT,
      court: { name: courtName },
      courtCaseNumber: undefined,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate,
    } as Case

    let then: Then

    beforeEach(async () => {
      const { courtService, internalCaseController } =
        await createTestingCaseModule()

      mockCourtService = courtService

      then = await internalCaseController
        .deliverIndictmentConclusionToCourt(
          caseId,
          caseWithoutCourtCaseNumber,
          { user },
        )
        .then((result) => ({ result, error: undefined as unknown as Error }))
        .catch((error) => ({
          result: undefined as unknown as DeliverResponse,
          error,
        }))
    })

    it('should not deliver when court case number is missing', () => {
      expect(
        mockCourtService.updateIndictmentCaseWithConclusion,
      ).not.toHaveBeenCalled()

      expect(then.result).toEqual({ delivered: false })
    })
  })

  describe('per-defendant conclusion with missing defendant national id', () => {
    const defendantId = uuid()
    const perDefendantRulingDate = randomDate()

    const caseWithDefendant = {
      id: caseId,
      type: CaseType.INDICTMENT,
      court: { name: courtName },
      courtCaseNumber,
      defendants: [{ id: defendantId }],
    } as Case

    let then: Then

    beforeEach(async () => {
      const { courtService, internalCaseController } =
        await createTestingCaseModule()

      mockCourtService = courtService

      then = await internalCaseController
        .deliverIndictmentConclusionToCourt(caseId, caseWithDefendant, {
          user,
          defendantId,
          indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
          rulingDate: perDefendantRulingDate.toISOString(),
        })
        .then((result) => ({ result, error: undefined as unknown as Error }))
        .catch((error) => ({
          result: undefined as unknown as DeliverResponse,
          error,
        }))
    })

    it('should not deliver when defendant national id is missing', () => {
      expect(
        mockCourtService.updateIndictmentCaseWithConclusion,
      ).not.toHaveBeenCalled()

      expect(then.result).toEqual({ delivered: false })
    })
  })
})
