import { Op, Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseOrigin,
  CaseState,
  CaseType,
  DateType,
  EventType,
  IndictmentDecision,
  StringType,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import {
  Case,
  CaseDefendantPoliceCaseNumberRepositoryService,
  CaseFileRepositoryService,
  caseInclude,
  CaseRepositoryService,
  CaseString,
  CaseStringRepositoryService,
  DateLogRepositoryService,
  Defendant,
  DefendantEventLogRepositoryService,
  DefendantRepositoryService,
  EventLogRepositoryService,
  IndictmentCountRepositoryService,
  OffenseRepositoryService,
  SubpoenaRepositoryService,
  VerdictRepositoryService,
  VictimRepositoryService,
} from '../../../repository'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (theCase: Case, defendant: Defendant) => Promise<Then>

describe('CaseController - Split defendant from case', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const courtCaseNumber = 'S-100/2026'
  const courtId = uuid()
  const judgeId = uuid()
  const registrarId = uuid()
  const creatingProsecutorId = uuid()
  const prosecutorId = uuid()
  const prosecutorsOfficeId = uuid()

  const defendantToSplit = { id: defendantId, caseId } as Defendant

  // The case the route's guard resolved - the court's case with two
  // defendants, which is what gets copied
  const theCase = {
    id: caseId,
    origin: CaseOrigin.LOKE,
    type: CaseType.INDICTMENT,
    indictmentSubtypes: { '007-2026-1': ['THEFT'] },
    description: 'Some description',
    courtId,
    demands: 'Some demands',
    comments: 'Some comments',
    creatingProsecutorId,
    prosecutorId,
    prosecutorsOfficeId,
    judgeId,
    registrarId,
    indictmentHash: 'some-hash',
    hasCivilClaims: true,
    // Data that must NOT travel to the split case as it is
    state: CaseState.RECEIVED,
    courtCaseNumber,
    policeCaseNumbers: ['007-2026-1', '007-2026-2'],
    indictmentDecision: IndictmentDecision.SCHEDULING,
    indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    parentCaseId: uuid(),
    defendants: [defendantToSplit, { id: uuid(), caseId } as Defendant],
  } as unknown as Case

  const splitCaseFileCategories = [
    CaseFileCategory.CRIMINAL_RECORD,
    CaseFileCategory.COST_BREAKDOWN,
    CaseFileCategory.CASE_FILE,
    CaseFileCategory.PROSECUTOR_CASE_FILE,
    CaseFileCategory.DEFENDANT_CASE_FILE,
    CaseFileCategory.CIVIL_CLAIM,
    CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
    CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
    CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
  ]

  let transaction: Transaction
  let splitCaseId: string
  let oldIndictmentCountId: string
  let newIndictmentCountId: string
  let splitCase: Case
  let fullSplitCase: Case

  let mockCaseRepositoryService: jest.Mocked<CaseRepositoryService>
  let mockPoliceCaseNumberRepositoryService: jest.Mocked<CaseDefendantPoliceCaseNumberRepositoryService>
  let mockDefendantRepositoryService: jest.Mocked<DefendantRepositoryService>
  let mockSubpoenaRepositoryService: jest.Mocked<SubpoenaRepositoryService>
  let mockVerdictRepositoryService: jest.Mocked<VerdictRepositoryService>
  let mockDefendantEventLogRepositoryService: jest.Mocked<DefendantEventLogRepositoryService>
  let mockIndictmentCountRepositoryService: jest.Mocked<IndictmentCountRepositoryService>
  let mockOffenseRepositoryService: jest.Mocked<OffenseRepositoryService>
  let mockVictimRepositoryService: jest.Mocked<VictimRepositoryService>
  let mockCaseStringRepositoryService: jest.Mocked<CaseStringRepositoryService>
  let mockDateLogRepositoryService: jest.Mocked<DateLogRepositoryService>
  let mockEventLogRepositoryService: jest.Mocked<EventLogRepositoryService>
  let mockCaseFileRepositoryService: jest.Mocked<CaseFileRepositoryService>

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      caseRepositoryService,
      caseDefendantPoliceCaseNumberRepositoryService,
      defendantRepositoryService,
      subpoenaRepositoryService,
      verdictRepositoryService,
      defendantEventLogRepositoryService,
      indictmentCountRepositoryService,
      offenseRepositoryService,
      victimRepositoryService,
      caseStringRepositoryService,
      dateLogRepositoryService,
      eventLogRepositoryService,
      caseFileRepositoryService,
      caseController,
    } = await createTestingCaseModule()

    mockCaseRepositoryService =
      caseRepositoryService as jest.Mocked<CaseRepositoryService>
    mockPoliceCaseNumberRepositoryService =
      caseDefendantPoliceCaseNumberRepositoryService as jest.Mocked<CaseDefendantPoliceCaseNumberRepositoryService>
    mockDefendantRepositoryService =
      defendantRepositoryService as jest.Mocked<DefendantRepositoryService>
    mockSubpoenaRepositoryService =
      subpoenaRepositoryService as jest.Mocked<SubpoenaRepositoryService>
    mockVerdictRepositoryService =
      verdictRepositoryService as jest.Mocked<VerdictRepositoryService>
    mockDefendantEventLogRepositoryService =
      defendantEventLogRepositoryService as jest.Mocked<DefendantEventLogRepositoryService>
    mockIndictmentCountRepositoryService =
      indictmentCountRepositoryService as jest.Mocked<IndictmentCountRepositoryService>
    mockOffenseRepositoryService =
      offenseRepositoryService as jest.Mocked<OffenseRepositoryService>
    mockVictimRepositoryService =
      victimRepositoryService as jest.Mocked<VictimRepositoryService>
    mockCaseStringRepositoryService =
      caseStringRepositoryService as jest.Mocked<CaseStringRepositoryService>
    mockDateLogRepositoryService =
      dateLogRepositoryService as jest.Mocked<DateLogRepositoryService>
    mockEventLogRepositoryService =
      eventLogRepositoryService as jest.Mocked<EventLogRepositoryService>
    mockCaseFileRepositoryService =
      caseFileRepositoryService as jest.Mocked<CaseFileRepositoryService>

    splitCaseId = uuid()
    splitCase = { id: splitCaseId } as Case
    oldIndictmentCountId = uuid()
    newIndictmentCountId = uuid()
    // The re-read split case, as the initial court documents need it
    fullSplitCase = {
      id: splitCaseId,
      policeCaseNumbers: ['007-2026-2'],
      defendants: [defendantToSplit],
    } as Case

    mockPoliceCaseNumberRepositoryService.findUnassignedPoliceCaseNumbersForSplit.mockResolvedValue(
      ['007-2026-2'],
    )
    mockCaseRepositoryService.create.mockResolvedValue(splitCase)
    mockCaseRepositoryService.findOne.mockResolvedValue(fullSplitCase)
    mockDefendantRepositoryService.moveToCase.mockResolvedValue()
    mockSubpoenaRepositoryService.moveAllForDefendantToCase.mockResolvedValue(1)
    mockVerdictRepositoryService.moveAllForDefendantToCase.mockResolvedValue(1)
    mockDefendantEventLogRepositoryService.moveAllForDefendantToCase.mockResolvedValue(
      1,
    )
    mockCaseStringRepositoryService.upsertByCaseAndType.mockResolvedValue(
      {} as CaseString,
    )
    mockCaseStringRepositoryService.copyByTypesToCase.mockResolvedValue()
    mockDateLogRepositoryService.copyByTypesToCase.mockResolvedValue()
    mockEventLogRepositoryService.copyByTypesToCase.mockResolvedValue()
    mockVictimRepositoryService.copyAllToCase.mockResolvedValue()
    mockIndictmentCountRepositoryService.copyAllToCase.mockResolvedValue(
      new Map([[oldIndictmentCountId, newIndictmentCountId]]),
    )
    mockOffenseRepositoryService.copyAllForIndictmentCounts.mockResolvedValue()
    mockCaseFileRepositoryService.moveAllForDefendantToCase.mockResolvedValue(1)
    mockCaseFileRepositoryService.copyAllWithoutDefendantToCase.mockResolvedValue()
    mockPoliceCaseNumberRepositoryService.moveAssignedRowsToCaseForDefendant.mockResolvedValue()
    mockPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases.mockResolvedValue()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (theCase: Case, defendant: Defendant) => {
      const then = {} as Then

      try {
        then.result = await caseController.splitDefendantFromCase(
          theCase.id,
          defendant.id,
          theCase,
          defendant,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('defendant split from case', () => {
    let then: Then
    let createdWith: Partial<Case>

    beforeEach(async () => {
      then = await givenWhenThen(theCase, defendantToSplit)
      ;[createdWith] = mockCaseRepositoryService.create.mock.calls[0]
    })

    it('should create the split case from the court view of the case', () => {
      expect(then.error).toBeUndefined()
      expect(mockCaseRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: CaseOrigin.LOKE,
          type: CaseType.INDICTMENT,
          indictmentSubtypes: { '007-2026-1': ['THEFT'] },
          description: 'Some description',
          courtId,
          demands: 'Some demands',
          comments: 'Some comments',
          creatingProsecutorId,
          prosecutorId,
          prosecutorsOfficeId,
          judgeId,
          registrarId,
          indictmentHash: 'some-hash',
          hasCivilClaims: true,
          state: CaseState.SUBMITTED,
          splitCaseId: caseId,
          withCourtSessions: true,
          indictmentDecision: IndictmentDecision.POSTPONING,
        }),
        { transaction },
      )
    })

    it('should give the split case the police case numbers assigned to no defendant, not the original case numbers', () => {
      expect(
        mockPoliceCaseNumberRepositoryService.findUnassignedPoliceCaseNumbersForSplit,
      ).toHaveBeenCalledWith(caseId, defendantId, { transaction })
      expect(createdWith.policeCaseNumbers).toEqual(['007-2026-2'])
      expect(createdWith).not.toHaveProperty('courtCaseNumber')
      expect(createdWith).not.toHaveProperty('indictmentRulingDecision')
      expect(createdWith).not.toHaveProperty('parentCaseId')
      expect(createdWith).not.toHaveProperty('defendants')
    })

    it('should move the defendant and what hangs off them to the split case', () => {
      expect(mockDefendantRepositoryService.moveToCase).toHaveBeenCalledWith(
        defendantId,
        caseId,
        splitCaseId,
        { transaction },
      )
      expect(
        mockSubpoenaRepositoryService.moveAllForDefendantToCase,
      ).toHaveBeenCalledWith(caseId, defendantId, splitCaseId, { transaction })
      expect(
        mockVerdictRepositoryService.moveAllForDefendantToCase,
      ).toHaveBeenCalledWith(caseId, defendantId, splitCaseId, { transaction })
      expect(
        mockDefendantEventLogRepositoryService.moveAllForDefendantToCase,
      ).toHaveBeenCalledWith(caseId, defendantId, splitCaseId, { transaction })
    })

    it('should explain the indefinite postponement by the case the defendant came from', () => {
      expect(
        mockCaseStringRepositoryService.upsertByCaseAndType,
      ).toHaveBeenCalledWith(
        splitCaseId,
        StringType.POSTPONED_INDEFINITELY_EXPLANATION,
        `Ákærði klofinn frá máli ${courtCaseNumber}.`,
        { transaction },
      )
    })

    it('should copy what the two cases share', () => {
      expect(
        mockCaseStringRepositoryService.copyByTypesToCase,
      ).toHaveBeenCalledWith(caseId, splitCaseId, [StringType.CIVIL_DEMANDS], {
        transaction,
      })
      expect(
        mockDateLogRepositoryService.copyByTypesToCase,
      ).toHaveBeenCalledWith(caseId, splitCaseId, [DateType.ARRAIGNMENT_DATE], {
        transaction,
      })
      expect(
        mockEventLogRepositoryService.copyByTypesToCase,
      ).toHaveBeenCalledWith(
        caseId,
        splitCaseId,
        [
          EventType.INDICTMENT_CONFIRMED,
          EventType.CASE_SENT_TO_COURT,
          EventType.CASE_RECEIVED_BY_COURT,
        ],
        { transaction },
      )
      expect(mockVictimRepositoryService.copyAllToCase).toHaveBeenCalledWith(
        caseId,
        splitCaseId,
        { transaction },
      )
      expect(
        mockIndictmentCountRepositoryService.copyAllToCase,
      ).toHaveBeenCalledWith(caseId, splitCaseId, { transaction })
    })

    it('should put the offenses on the copied indictment counts', () => {
      expect(
        mockOffenseRepositoryService.copyAllForIndictmentCounts,
      ).toHaveBeenCalledWith(
        new Map([[oldIndictmentCountId, newIndictmentCountId]]),
        { transaction },
      )
    })

    it("should move the defendant's case files and copy the ones linked to no defendant", () => {
      expect(
        mockCaseFileRepositoryService.moveAllForDefendantToCase,
      ).toHaveBeenCalledWith(
        caseId,
        defendantId,
        splitCaseId,
        splitCaseFileCategories,
        { transaction },
      )
      expect(
        mockCaseFileRepositoryService.copyAllWithoutDefendantToCase,
      ).toHaveBeenCalledWith(caseId, splitCaseId, splitCaseFileCategories, {
        transaction,
      })
    })

    it("should move the defendant's police case numbers and then resolve them onto the split case", () => {
      const move =
        mockPoliceCaseNumberRepositoryService.moveAssignedRowsToCaseForDefendant
      const resolve =
        mockPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases

      expect(move).toHaveBeenCalledWith(caseId, splitCaseId, defendantId, {
        transaction,
      })
      expect(resolve).toHaveBeenCalledWith([splitCase], { transaction })
      // The move changes the set, so the resolve has to come after it
      expect(resolve.mock.invocationCallOrder[0]).toBeGreaterThan(
        move.mock.invocationCallOrder[0],
      )
    })

    it('should read the full split case for the initial court documents and return the split case', () => {
      expect(mockCaseRepositoryService.findOne).toHaveBeenCalledWith({
        include: caseInclude,
        where: {
          id: splitCaseId,
          state: { [Op.not]: CaseState.DELETED },
          isArchived: false,
        },
        transaction,
      })
      expect(then.result).toBe(splitCase)
    })
  })

  describe('case with a single defendant', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        { ...theCase, defendants: [defendantToSplit] } as Case,
        defendantToSplit,
      )
    })

    it('should throw BadRequestException and not split', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockCaseRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('moving the defendant fails', () => {
    const error = new Error('Some error')
    let then: Then

    beforeEach(async () => {
      mockDefendantRepositoryService.moveToCase.mockRejectedValueOnce(error)

      then = await givenWhenThen(theCase, defendantToSplit)
    })

    it('should rethrow and not go on to the rest of the split', () => {
      expect(then.error).toBe(error)
      expect(
        mockPoliceCaseNumberRepositoryService.moveAssignedRowsToCaseForDefendant,
      ).not.toHaveBeenCalled()
      expect(mockCaseRepositoryService.findOne).not.toHaveBeenCalled()
    })
  })
})
