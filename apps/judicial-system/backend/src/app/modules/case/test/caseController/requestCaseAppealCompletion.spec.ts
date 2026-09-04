import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  AppealCaseState,
  AppealCaseType,
  AppealDecisionPartyRole,
  AppealEventType,
  AppealOrigin,
  CaseAppealDecision,
  CaseState,
  CaseTransition,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { getOrCreateTransaction } from '../../../../middleware'
import { randomDate, runInRequestContext } from '../../../../test'
import {
  AppealCaseRepositoryService,
  AppealDecisionRepositoryService,
  AppealEventLogRepositoryService,
  Case,
  CaseRepositoryService,
} from '../../../repository'

jest.mock('../../../../factories')

describe('CaseController - Request-case appeal on (re-)completion', () => {
  const date = randomDate()
  const user = {
    id: uuid(),
    role: UserRole.DISTRICT_COURT_JUDGE,
    name: 'Test Judge',
    title: 'dómari',
    nationalId: '9999999999',
    institution: {
      name: 'Héraðsdómur Reykjavíkur',
      type: InstitutionType.DISTRICT_COURT,
    },
  } as User
  const caseId = uuid()
  const defendantId1 = uuid()
  const defendantId2 = uuid()
  const appealCaseId = uuid()
  const createdAppealCase = { id: appealCaseId, caseId }

  let transaction: Transaction
  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockAppealDecisionRepositoryService: AppealDecisionRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockCaseRepositoryService: CaseRepositoryService
  let accept: (theCase: Case) => Promise<void>

  beforeEach(async () => {
    const {
      appealCaseRepositoryService,
      appealDecisionRepositoryService,
      appealEventLogRepositoryService,
      caseRepositoryService,
      sequelize,
      caseController,
    } = await createTestingCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockAppealDecisionRepositoryService = appealDecisionRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    mockCaseRepositoryService = caseRepositoryService

    transaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    } as unknown as Transaction
    const mockTransaction = sequelize.transaction as jest.Mock
    mockTransaction.mockImplementation(
      (fn?: (transaction: Transaction) => unknown) =>
        fn ? fn(transaction) : Promise.resolve(transaction),
    )

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValue(date)
    const mockUpdate = mockCaseRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue({})
    const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
    mockFindOne.mockResolvedValue({})
    const mockCreate = mockAppealCaseRepositoryService.create as jest.Mock
    mockCreate.mockResolvedValue(createdAppealCase)

    accept = async (theCase: Case) => {
      // The transition route is guarded by CaseExistsForUpdateGuard, which
      // opens the request transaction before the handler runs. Guards do not
      // execute in controller unit tests, so that is done here instead.
      await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        await caseController.transition(caseId, user, theCase, {
          transition: CaseTransition.ACCEPT,
        })
      })
    }
  })

  describe('completing a request case where a party appealed in court', () => {
    const courtEndTime = randomDate()
    // Completion reads the in-court stance from the case-level appeal_decision
    // rows (rulingFileId null), not the legacy columns.
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.RECEIVED,
      courtEndTime,
      appealDecisions: [
        {
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
          decision: CaseAppealDecision.APPEAL,
        },
        {
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          decision: CaseAppealDecision.ACCEPT,
        },
      ],
      defendants: [{ id: defendantId1 }, { id: defendantId2 }],
    } as Case

    beforeEach(async () => {
      await accept(theCase)
    })

    it('should create the appeal case with the court end time as appeal date', () => {
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        {
          appealType: AppealCaseType.RULING,
          appealState: AppealCaseState.APPEALED,
          appealDate: courtEndTime,
        },
        { transaction },
      )
    })

    it('should not touch appeal_decision rows (the in-court decision already records the appeal)', () => {
      expect(mockAppealDecisionRepositoryService.upsert).not.toHaveBeenCalled()
    })

    it('should register an APPEALED event for the prosecutor who appealed, with the judge as the recording actor', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledTimes(
        1,
      )
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEALED,
          // The appellant's side, not the recording judge's role.
          userRole: UserRole.PROSECUTOR,
          // No party - request-case defence is collective, and this is the
          // prosecutor anyway.
          defendantId: undefined,
          civilClaimantId: undefined,
          // Actor snapshot = the confirming judge.
          userId: user.id,
          nationalId: user.nationalId,
        }),
        { transaction },
      )
    })

    it('should not register an APPEALED event for the accused who accepted', () => {
      expect(
        mockAppealEventLogRepositoryService.create,
      ).not.toHaveBeenCalledWith(
        expect.objectContaining({ userRole: UserRole.DEFENDER }),
        expect.anything(),
      )
    })
  })

  describe('re-completing a corrected request case where the appeal still stands', () => {
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.RECEIVED,
      appealCase: { id: appealCaseId, appealState: AppealCaseState.APPEALED },
      appealDecisions: [
        {
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
          decision: CaseAppealDecision.APPEAL,
        },
        {
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          decision: CaseAppealDecision.ACCEPT,
        },
      ],
      defendants: [{ id: defendantId1 }],
    } as Case

    beforeEach(async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        {
          id: uuid(),
          eventType: AppealEventType.APPEALED,
          appealOrigin: AppealOrigin.IN_COURT,
          userRole: UserRole.PROSECUTOR,
        },
      ])

      await accept(theCase)
    })

    it('should not create or delete the appeal case', () => {
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
      expect(mockAppealCaseRepositoryService.delete).not.toHaveBeenCalled()
    })

    it('should leave the already-registered appellant event untouched', () => {
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('re-completing a request case where the correction changed who appeals', () => {
    const prosecutorEventId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.RECEIVED,
      appealCase: { id: appealCaseId, appealState: AppealCaseState.APPEALED },
      // Corrected: the prosecutor no longer appeals, the accused now does.
      appealDecisions: [
        {
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
          decision: CaseAppealDecision.ACCEPT,
        },
        {
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          decision: CaseAppealDecision.APPEAL,
        },
      ],
      defendants: [{ id: defendantId1 }],
    } as Case

    beforeEach(async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        {
          // Appealed in court, so correcting the record can take it away again.
          id: prosecutorEventId,
          eventType: AppealEventType.APPEALED,
          appealOrigin: AppealOrigin.IN_COURT,
          userRole: UserRole.PROSECUTOR,
        },
      ])

      await accept(theCase)
    })

    it('should register an APPEALED event for the newly appealing defence', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          appealCaseId,
          eventType: AppealEventType.APPEALED,
          userRole: UserRole.DEFENDER,
        }),
        { transaction },
      )
    })

    it('should remove the appellant event of the side corrected away', () => {
      expect(
        mockAppealEventLogRepositoryService.deleteByIds,
      ).toHaveBeenCalledWith([prosecutorEventId], { transaction })
    })

    it('should not create or delete the appeal case itself', () => {
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
      expect(mockAppealCaseRepositoryService.delete).not.toHaveBeenCalled()
    })
  })

  describe('re-completing a request case whose appeal was corrected away entirely', () => {
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.RECEIVED,
      appealCase: { id: appealCaseId, appealState: AppealCaseState.APPEALED },
      appealDecisions: [
        {
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
          decision: CaseAppealDecision.ACCEPT,
        },
        {
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          decision: CaseAppealDecision.ACCEPT,
        },
      ],
      defendants: [{ id: defendantId1 }],
    } as Case

    beforeEach(async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        {
          id: uuid(),
          eventType: AppealEventType.APPEALED,
          appealOrigin: AppealOrigin.IN_COURT,
          userRole: UserRole.PROSECUTOR,
        },
      ])

      await accept(theCase)
    })

    it('should delete the stranded appeal case and its events', () => {
      expect(
        mockAppealEventLogRepositoryService.deleteByAppealCaseId,
      ).toHaveBeenCalledWith(appealCaseId, { transaction })
      expect(mockAppealCaseRepositoryService.delete).toHaveBeenCalledWith(
        appealCaseId,
        { transaction },
      )
    })
  })

  describe('re-completing a request case whose appeal has progressed past the district court', () => {
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.RECEIVED,
      // The appeal has been received by the court of appeals.
      appealCase: { id: appealCaseId, appealState: AppealCaseState.RECEIVED },
      appealDecisions: [
        {
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
          decision: CaseAppealDecision.ACCEPT,
        },
        {
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          decision: CaseAppealDecision.ACCEPT,
        },
      ],
      defendants: [{ id: defendantId1 }],
    } as Case

    it('should reject the correction and delete nothing', async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        {
          id: uuid(),
          eventType: AppealEventType.APPEALED,
          appealOrigin: AppealOrigin.IN_COURT,
          userRole: UserRole.PROSECUTOR,
        },
      ])

      await expect(accept(theCase)).rejects.toBeInstanceOf(BadRequestException)
      expect(mockAppealCaseRepositoryService.delete).not.toHaveBeenCalled()
    })
  })

  // The appeal was filed by a party, not recorded in the court record, so it has
  // no decision = APPEAL row. Re-completing after a correction must not read that
  // absence as "nobody appealed" - doing so used to delete the appeal along with
  // the briefs and statements filed for it.
  describe('re-completing a request case whose appeal was made out of court', () => {
    const outOfCourtEventId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.RECEIVED,
      appealCase: { id: appealCaseId, appealState: AppealCaseState.APPEALED },
      // Nobody appealed in court - the defence postponed and then appealed
      // itself within the deadline.
      appealDecisions: [
        {
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
          decision: CaseAppealDecision.ACCEPT,
        },
        {
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          decision: CaseAppealDecision.POSTPONE,
        },
      ],
      defendants: [{ id: defendantId1 }],
    } as Case

    beforeEach(async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        {
          id: outOfCourtEventId,
          eventType: AppealEventType.APPEALED,
          appealOrigin: AppealOrigin.OUT_OF_COURT,
          userRole: UserRole.DEFENDER,
        },
      ])

      await accept(theCase)
    })

    it('should keep the appeal case', () => {
      expect(mockAppealCaseRepositoryService.delete).not.toHaveBeenCalled()
      expect(
        mockAppealEventLogRepositoryService.deleteByAppealCaseId,
      ).not.toHaveBeenCalled()
    })

    it('should keep the appellant event', () => {
      expect(
        mockAppealEventLogRepositoryService.deleteByIds,
      ).not.toHaveBeenCalledWith([outOfCourtEventId], { transaction })
    })

    it('should not clear the legacy postponed appeal dates', () => {
      expect(mockCaseRepositoryService.update).not.toHaveBeenCalledWith(
        caseId,
        expect.objectContaining({ accusedPostponedAppealDate: null }),
        { transaction },
      )
    })
  })

  describe('re-completing a progressed request case whose appeal was made out of court', () => {
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.RECEIVED,
      appealCase: { id: appealCaseId, appealState: AppealCaseState.RECEIVED },
      appealDecisions: [
        {
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
          decision: CaseAppealDecision.ACCEPT,
        },
        {
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          decision: CaseAppealDecision.POSTPONE,
        },
      ],
      defendants: [{ id: defendantId1 }],
    } as Case

    // The correction is not removing this appeal, so it must not be blocked as
    // if it were.
    it('should allow the correction and keep the appeal', async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        {
          id: uuid(),
          eventType: AppealEventType.APPEALED,
          appealOrigin: AppealOrigin.OUT_OF_COURT,
          userRole: UserRole.DEFENDER,
        },
      ])

      await expect(accept(theCase)).resolves.not.toThrow()
      expect(mockAppealCaseRepositoryService.delete).not.toHaveBeenCalled()
    })
  })
})
