import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  AppealCaseState,
  AppealDecisionPartyRole,
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
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.RECEIVED,
      courtEndTime,
      prosecutorAppealDecision: CaseAppealDecision.APPEAL,
      accusedAppealDecision: CaseAppealDecision.ACCEPT,
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

    it('should not write an APPEALED event for an in-court appeal', () => {
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
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

  describe('completing a request case that was already appealed', () => {
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.RECEIVED,
      appealCase: { id: appealCaseId },
      prosecutorAppealDecision: CaseAppealDecision.APPEAL,
      defendants: [{ id: defendantId1 }],
    } as Case

    beforeEach(async () => {
      await accept(theCase)
    })

    it('should not create another appeal case', () => {
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    })
  })
})
