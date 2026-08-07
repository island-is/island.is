import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  AppealCaseState,
  AppealDecisionPartyRole,
  AppealEventType,
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
import { randomDate } from '../../../../test'
import {
  AppealCaseRepositoryService,
  AppealDecisionRepositoryService,
  AppealEventLogRepositoryService,
  Case,
  CaseRepositoryService,
} from '../../../repository'
import { UpdateCaseDto } from '../../dto/updateCase.dto'

jest.mock('../../../../factories')

describe('CaseController - Appeal decision dual-write', () => {
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
  let update: (theCase: Case, caseToUpdate: UpdateCaseDto) => Promise<void>
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

    update = async (theCase: Case, caseToUpdate: UpdateCaseDto) => {
      await caseController.update(caseId, user, theCase, caseToUpdate)
    }

    accept = async (theCase: Case) => {
      await caseController.transition(caseId, user, theCase, {
        transition: CaseTransition.ACCEPT,
      })
    }
  })

  describe('district court records appeal decisions on a request case', () => {
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.RECEIVED,
      defendants: [{ id: defendantId1 }, { id: defendantId2 }],
    } as Case
    const caseToUpdate = {
      prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
      prosecutorAppealAnnouncement: 'Sækjandi tekur sér frest',
      accusedAppealDecision: CaseAppealDecision.APPEAL,
      accusedAppealAnnouncement: 'Varnaraðili kærir',
    } as UpdateCaseDto

    beforeEach(async () => {
      await update(theCase, caseToUpdate)
    })

    it('should mirror the prosecutor decision into an appeal decision row', () => {
      expect(mockAppealDecisionRepositoryService.upsert).toHaveBeenCalledWith(
        { caseId, partyRole: AppealDecisionPartyRole.PROSECUTOR },
        {
          decision: CaseAppealDecision.POSTPONE,
          announcement: 'Sækjandi tekur sér frest',
        },
        { transaction },
      )
    })

    it('should mirror the accused decision into a single collective defence row', () => {
      expect(mockAppealDecisionRepositoryService.upsert).toHaveBeenCalledWith(
        { caseId, partyRole: AppealDecisionPartyRole.DEFENDANT },
        {
          decision: CaseAppealDecision.APPEAL,
          announcement: 'Varnaraðili kærir',
        },
        { transaction },
      )
    })

    it('should not create a defence row per defendant', () => {
      expect(
        mockAppealDecisionRepositoryService.upsert,
      ).not.toHaveBeenCalledWith(
        expect.objectContaining({ defendantId: expect.anything() }),
        expect.anything(),
        expect.anything(),
      )
    })

    it('should still persist the legacy case columns', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        expect.objectContaining(caseToUpdate),
        { transaction },
      )
    })
  })

  describe('appeal decision fields on an indictment case are not mirrored', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.RECEIVED,
      defendants: [{ id: defendantId1 }],
    } as Case

    beforeEach(async () => {
      await update(theCase, {
        prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
      } as UpdateCaseDto)
    })

    it('should not upsert any appeal decision rows', () => {
      expect(mockAppealDecisionRepositoryService.upsert).not.toHaveBeenCalled()
    })
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
        { appealState: AppealCaseState.APPEALED, appealDate: courtEndTime },
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

    it('should still stamp the legacy prosecutor postponed appeal date', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        expect.objectContaining({
          prosecutorPostponedAppealDate: courtEndTime,
        }),
        { transaction },
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
      ).mockResolvedValue([{ id: uuid(), userRole: UserRole.PROSECUTOR }])

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
        { id: prosecutorEventId, userRole: UserRole.PROSECUTOR },
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

    it('should clear the legacy postponed appeal dates', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        expect.objectContaining({
          prosecutorPostponedAppealDate: null,
          accusedPostponedAppealDate: null,
        }),
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
      await expect(accept(theCase)).rejects.toBeInstanceOf(BadRequestException)
      expect(mockAppealCaseRepositoryService.delete).not.toHaveBeenCalled()
    })
  })
})
