import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealDecisionPartyRole,
  CaseAppealDecision,
  CourtSessionRulingType,
} from '@island.is/judicial-system/types'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import {
  AppealCaseRepositoryService,
  AppealDecision,
  AppealDecisionRepositoryService,
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

describe('CourtSessionController - Confirm ruling order appeal', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const rulingFileId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const civilClaimantId = uuid()
  const endDate = new Date('2026-03-05T10:55:00Z')

  const confirmUpdate = { isConfirmed: true } as UpdateCourtSessionDto

  let mockCourtSessionRepositoryService: CourtSessionRepositoryService
  let mockAppealDecisionRepositoryService: AppealDecisionRepositoryService
  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let transaction: Transaction
  // decision can be null for a row that holds only an announcement, matching
  // what the nullable DB column returns.
  let decisions: (Partial<AppealDecision> & {
    decision?: CaseAppealDecision | null
  })[]
  let givenWhenThen: GivenWhenThen

  const baseCase = {
    id: caseId,
    caseFiles: [],
    defendants: [{ id: defendantId }],
    civilClaimants: [{ id: civilClaimantId }],
    rulingOrderAppealCases: [],
  } as unknown as Case

  beforeEach(async () => {
    const {
      sequelize,
      courtSessionRepositoryService,
      appealDecisionRepositoryService,
      appealCaseRepositoryService,
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
      endDate,
    })

    mockAppealDecisionRepositoryService = appealDecisionRepositoryService
    decisions = [
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
    const mockFindAll = mockAppealDecisionRepositoryService.findAll as jest.Mock
    mockFindAll.mockImplementation(() => Promise.resolve(decisions))

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    const mockCreate = mockAppealCaseRepositoryService.create as jest.Mock
    mockCreate.mockResolvedValue({ id: appealCaseId, caseId, rulingFileId })

    givenWhenThen = async (theCase) => {
      const then = {} as Then
      const existingCourtSession = {
        id: courtSessionId,
        isConfirmed: false,
        rulingType: CourtSessionRulingType.ORDER,
        rulingFileId,
        endDate,
      } as unknown as CourtSession

      try {
        then.result = await courtSessionController.update(
          caseId,
          courtSessionId,
          confirmUpdate,
          {} as never,
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

  describe('a party appealed in court', () => {
    let then: Then

    beforeEach(async () => {
      decisions[0].decision = CaseAppealDecision.APPEAL
      then = await givenWhenThen(baseCase)
    })

    it('should confirm the court session', () => {
      expect(mockCourtSessionRepositoryService.update).toHaveBeenCalled()
      expect(then.error).toBeUndefined()
    })

    it('should create the appeal case with the court session end time', () => {
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        {
          appealState: AppealCaseState.APPEALED,
          rulingFileId,
          appealDate: endDate,
        },
        { transaction },
      )
    })

    it('should queue the appeal to court of appeals notification', () => {
      expect(addMessagesToQueue).toHaveBeenCalledWith({
        type: MessageType.APPEAL_CASE_NOTIFICATION,
        user: {},
        caseId,
        elementId: appealCaseId,
        body: { type: AppealCaseNotificationType.APPEAL_TO_COURT_OF_APPEALS },
      })
    })
  })

  describe('no party appealed in court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(baseCase)
    })

    it('should confirm without creating an appeal case', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
      expect(addMessagesToQueue).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
        }),
      )
    })
  })

  describe('an appeal case already exists for the ruling', () => {
    beforeEach(async () => {
      decisions[0].decision = CaseAppealDecision.APPEAL
      await givenWhenThen({
        ...baseCase,
        rulingOrderAppealCases: [{ id: appealCaseId, rulingFileId }],
      } as unknown as Case)
    })

    it('should not create another appeal case', () => {
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
      expect(addMessagesToQueue).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
        }),
      )
    })
  })

  describe('every in-court appeal has been withdrawn on confirmation', () => {
    const withdrawnDate = new Date('2026-03-04T09:00:00Z')

    const caseWithAppeal = (appealState: AppealCaseState) =>
      ({
        ...baseCase,
        rulingOrderAppealCases: [
          { id: appealCaseId, rulingFileId, appealState },
        ],
      } as unknown as Case)

    beforeEach(() => {
      decisions = [
        {
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
          decision: CaseAppealDecision.APPEAL,
          withdrawnDate,
        },
        {
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          defendantId,
          decision: CaseAppealDecision.APPEAL,
          withdrawnDate,
        },
        {
          partyRole: AppealDecisionPartyRole.CIVIL_CLAIMANT,
          civilClaimantId,
          decision: CaseAppealDecision.APPEAL,
          withdrawnDate,
        },
      ]
    })

    it('should withdraw a still-APPEALED appeal case and notify', async () => {
      await givenWhenThen(caseWithAppeal(AppealCaseState.APPEALED))

      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        expect.objectContaining({ appealState: AppealCaseState.WITHDRAWN }),
        { transaction },
      )
      expect(addMessagesToQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          body: { type: AppealCaseNotificationType.APPEAL_WITHDRAWN },
        }),
      )
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
      expect(mockAppealCaseRepositoryService.delete).not.toHaveBeenCalled()
    })

    it('should withdraw and discontinue a RECEIVED appeal case', async () => {
      await givenWhenThen(caseWithAppeal(AppealCaseState.RECEIVED))

      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        expect.objectContaining({
          appealState: AppealCaseState.WITHDRAWN,
          appealRulingDecision: AppealCaseRulingDecision.DISCONTINUED,
        }),
        { transaction },
      )
    })
  })

  describe('a defendant has no decision', () => {
    let then: Then

    beforeEach(async () => {
      decisions = decisions.filter(
        (d) => d.partyRole !== AppealDecisionPartyRole.DEFENDANT,
      )
      then = await givenWhenThen(baseCase)
    })

    it('should reject confirmation and not write the session', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockCourtSessionRepositoryService.update).not.toHaveBeenCalled()
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('a civil claimant has no decision', () => {
    let then: Then

    beforeEach(async () => {
      decisions = decisions.filter(
        (d) => d.partyRole !== AppealDecisionPartyRole.CIVIL_CLAIMANT,
      )
      then = await givenWhenThen(baseCase)
    })

    it('should reject confirmation', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockCourtSessionRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('a party has an announcement but no decision', () => {
    let then: Then

    beforeEach(async () => {
      decisions[0].decision = null
      decisions[0].announcement = 'Yfirlýsing án afstöðu'
      then = await givenWhenThen(baseCase)
    })

    it('should reject confirmation', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockCourtSessionRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  // TEMPORARY — REMOVE WITH THE `decisions.length === 0` SKIP IN
  // CourtSessionService.validateAppealDecisionsComplete (when the ruling-order
  // appeal UI ships). Until the data-entry UI is deployed no ORDER session has
  // any decisions, so confirmation must still succeed. When the skip is removed
  // this case must flip to a rejection.
  describe('no decisions recorded at all (temporary pre-UI behaviour)', () => {
    let then: Then

    beforeEach(async () => {
      decisions = []
      then = await givenWhenThen(baseCase)
    })

    it('should confirm without creating an appeal case', () => {
      expect(then.error).toBeUndefined()
      expect(mockCourtSessionRepositoryService.update).toHaveBeenCalled()
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
    })
  })
})
