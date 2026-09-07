import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  AppealCaseState,
  AppealDecisionPartyRole,
  CaseAppealDecision,
  CaseFileCategory,
  CourtSessionRulingType,
  EventType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import { EventLogService } from '../../../event-log'
import { FileService } from '../../../file'
import {
  AppealCaseRepositoryService,
  AppealDecision,
  AppealEventLogRepositoryService,
  Case,
  CourtSession,
  CourtSessionRepositoryService,
} from '../../../repository'
import { UpdateCourtSessionDto } from '../../dto/updateCourtSession.dto'

jest.mock('@island.is/judicial-system/message', () => ({
  ...jest.requireActual('@island.is/judicial-system/message'),
  addMessagesToQueue: jest.fn(),
}))

interface Then {
  result: CourtSession | null
  error: Error
}

type GivenWhenThen = (theCase: Case) => Promise<Then>

describe('CourtSessionController - Correct ruling order appeal', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const rulingFileId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const civilClaimantId = uuid()
  const user = { id: uuid() } as User

  const confirmUpdate = { isConfirmed: true } as UpdateCourtSessionDto

  // A complete set of decisions with no in-court appeal (so confirmation passes
  // validation and there is nothing keeping the appeal case alive).
  const acceptedDecisions: Partial<AppealDecision>[] = [
    {
      partyRole: AppealDecisionPartyRole.PROSECUTOR,
      decision: CaseAppealDecision.ACCEPT,
    },
    {
      partyRole: AppealDecisionPartyRole.DEFENDANT,
      defendantId,
      decision: CaseAppealDecision.ACCEPT,
    },
    {
      partyRole: AppealDecisionPartyRole.CIVIL_CLAIMANT,
      civilClaimantId,
      decision: CaseAppealDecision.NOT_APPLICABLE,
    },
  ]

  const appealBrief = {
    id: uuid(),
    rulingFileId,
    category: CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
  }
  const appealStatement = {
    id: uuid(),
    rulingFileId,
    category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
  }
  const theRulingOrderFile = {
    id: rulingFileId,
    rulingFileId: null,
    category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
  }
  const otherRulingAppealFile = {
    id: uuid(),
    rulingFileId: uuid(),
    category: CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
  }

  const caseWith = (appealState: AppealCaseState): Case =>
    ({
      id: caseId,
      caseFiles: [
        appealBrief,
        appealStatement,
        theRulingOrderFile,
        otherRulingAppealFile,
      ],
      defendants: [{ id: defendantId }],
      civilClaimants: [{ id: civilClaimantId }],
      rulingOrderAppealCases: [{ id: appealCaseId, rulingFileId, appealState }],
    } as unknown as Case)

  let mockCourtSessionRepositoryService: CourtSessionRepositoryService
  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockFileService: FileService
  let mockEventLogService: EventLogService
  let transaction: Transaction
  let decisions: Partial<AppealDecision>[]
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      courtSessionRepositoryService,
      appealDecisionRepositoryService,
      appealCaseRepositoryService,
      appealEventLogRepositoryService,
      fileService,
      eventLogService,
      courtSessionController,
    } = await createTestingCourtSessionModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    mockCourtSessionRepositoryService = courtSessionRepositoryService
    const mockUpdate = mockCourtSessionRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue({
      id: courtSessionId,
      caseId,
      isConfirmed: true,
      rulingType: CourtSessionRulingType.ORDER,
      rulingFileId,
    })

    decisions = acceptedDecisions
    const mockFindAll = appealDecisionRepositoryService.findAll as jest.Mock
    mockFindAll.mockImplementation(() => Promise.resolve(decisions))

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    mockFileService = fileService
    mockEventLogService = eventLogService

    givenWhenThen = async (theCase) => {
      const then = {} as Then
      const existingCourtSession = {
        id: courtSessionId,
        isConfirmed: false,
        rulingType: CourtSessionRulingType.ORDER,
        rulingFileId,
      } as unknown as CourtSession

      try {
        then.result = await courtSessionController.update(
          caseId,
          courtSessionId,
          confirmUpdate,
          user,
          theCase,
          existingCourtSession,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  afterEach(() => jest.clearAllMocks())

  describe('correcting away an in-court appeal that is still APPEALED', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseWith(AppealCaseState.APPEALED))
    })

    it('should confirm the corrected court session', () => {
      expect(then.error).toBeUndefined()
      expect(mockCourtSessionRepositoryService.update).toHaveBeenCalled()
    })

    it('should delete the appeal party files for the ruling only', () => {
      expect(mockFileService.deleteCaseFile).toHaveBeenCalledTimes(2)
      expect(mockFileService.deleteCaseFile).toHaveBeenCalledWith(
        expect.anything(),
        appealBrief,
        transaction,
      )
      expect(mockFileService.deleteCaseFile).toHaveBeenCalledWith(
        expect.anything(),
        appealStatement,
        transaction,
      )
    })

    it('should delete the appeal event logs then the appeal case', () => {
      expect(
        mockAppealEventLogRepositoryService.deleteByAppealCaseId,
      ).toHaveBeenCalledWith(appealCaseId, { transaction })
      expect(mockAppealCaseRepositoryService.delete).toHaveBeenCalledWith(
        appealCaseId,
        { transaction },
      )
    })

    it('should audit the deletion on the case event log', () => {
      expect(mockEventLogService.createWithUser).toHaveBeenCalledWith(
        EventType.APPEAL_DELETED,
        caseId,
        user,
        transaction,
      )
    })
  })

  describe('correcting away an appeal that has progressed past the district court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseWith(AppealCaseState.RECEIVED))
    })

    it('should reject confirmation and not write the session', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockCourtSessionRepositoryService.update).not.toHaveBeenCalled()
    })

    it('should not delete anything', () => {
      expect(mockAppealCaseRepositoryService.delete).not.toHaveBeenCalled()
      expect(mockFileService.deleteCaseFile).not.toHaveBeenCalled()
      expect(
        mockAppealEventLogRepositoryService.deleteByAppealCaseId,
      ).not.toHaveBeenCalled()
    })
  })

  describe('an in-court appeal still stands after the correction', () => {
    beforeEach(async () => {
      decisions = [
        {
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
          decision: CaseAppealDecision.APPEAL,
        },
        ...acceptedDecisions.slice(1),
      ]
      await givenWhenThen(caseWith(AppealCaseState.APPEALED))
    })

    it('should keep the appeal case', () => {
      expect(mockAppealCaseRepositoryService.delete).not.toHaveBeenCalled()
      expect(mockFileService.deleteCaseFile).not.toHaveBeenCalled()
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
    })
  })
})
