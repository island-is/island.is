import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  AppealCaseState,
  AppealDecisionPartyRole,
  AppealEventType,
  AppealOrigin,
  CaseAppealDecision,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import {
  AppealDecisionRepositoryService,
  AppealEventLogRepositoryService,
  Case,
  CaseRepositoryService,
} from '../../../repository'
import { CaseAppealDecisionDto } from '../../dto/caseAppealDecision.dto'

describe('CaseController - Upsert case appeal decision', () => {
  const caseId = uuid()

  let transaction: Transaction
  let mockAppealDecisionRepositoryService: AppealDecisionRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockCaseRepositoryService: CaseRepositoryService
  let upsert: (theCase: Case, dto: CaseAppealDecisionDto) => Promise<unknown>

  beforeEach(async () => {
    const {
      appealDecisionRepositoryService,
      appealEventLogRepositoryService,
      caseRepositoryService,
      sequelize,
      caseController,
    } = await createTestingCaseModule()

    mockAppealDecisionRepositoryService = appealDecisionRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    mockCaseRepositoryService = caseRepositoryService

    transaction = {} as Transaction
    const mockTransaction = sequelize.transaction as jest.Mock
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )
    ;(
      mockAppealDecisionRepositoryService.upsert as jest.Mock
    ).mockResolvedValue({ id: uuid() })
    ;(mockCaseRepositoryService.update as jest.Mock).mockResolvedValue([1])

    upsert = (theCase: Case, dto: CaseAppealDecisionDto) =>
      caseController.upsertCaseAppealDecision(caseId, dto, theCase)
  })

  const requestCase = { id: caseId, type: CaseType.CUSTODY } as Case

  it('writes the prosecutor row', async () => {
    await upsert(requestCase, {
      partyRole: AppealDecisionPartyRole.PROSECUTOR,
      decision: CaseAppealDecision.APPEAL,
      announcement: 'Sækjandi kærir',
    })

    expect(mockAppealDecisionRepositoryService.upsert).toHaveBeenCalledWith(
      {
        caseId,
        rulingFileId: null,
        partyRole: AppealDecisionPartyRole.PROSECUTOR,
      },
      { decision: CaseAppealDecision.APPEAL, announcement: 'Sækjandi kærir' },
      { transaction },
    )
  })

  it('writes the collective defendant row', async () => {
    await upsert(requestCase, {
      partyRole: AppealDecisionPartyRole.DEFENDANT,
      decision: CaseAppealDecision.ACCEPT,
    })

    expect(mockAppealDecisionRepositoryService.upsert).toHaveBeenCalledWith(
      {
        caseId,
        rulingFileId: null,
        partyRole: AppealDecisionPartyRole.DEFENDANT,
      },
      { decision: CaseAppealDecision.ACCEPT },
      { transaction },
    )
  })

  it('writes only the announcement when no decision is provided', async () => {
    await upsert(requestCase, {
      partyRole: AppealDecisionPartyRole.PROSECUTOR,
      announcement: 'Bókun',
    })

    expect(mockAppealDecisionRepositoryService.upsert).toHaveBeenCalledWith(
      {
        caseId,
        rulingFileId: null,
        partyRole: AppealDecisionPartyRole.PROSECUTOR,
      },
      { announcement: 'Bókun' },
      { transaction },
    )
  })

  it('rejects a non-request case', async () => {
    await expect(
      upsert({ id: caseId, type: CaseType.INDICTMENT } as Case, {
        partyRole: AppealDecisionPartyRole.PROSECUTOR,
        decision: CaseAppealDecision.APPEAL,
      }),
    ).rejects.toThrow('Case-level appeal decisions can only be recorded')
  })

  it('rejects a civil-claimant party role', async () => {
    await expect(
      upsert(requestCase, {
        partyRole: AppealDecisionPartyRole.CIVIL_CLAIMANT,
        decision: CaseAppealDecision.APPEAL,
      }),
    ).rejects.toThrow('must belong to the prosecutor or the accused')
  })

  // Editing the decisions cannot change an appeal that no longer depends on
  // them, and reconciliation will not act on the edit, so the record would just
  // drift out of step with the appeal. The web disables the UI in both cases;
  // these guards make the API enforce it.
  describe('an appeal exists that the court record no longer governs', () => {
    const appealCaseId = uuid()
    const withAppeal = (
      appealState: AppealCaseState,
      appealOrigin: AppealOrigin,
    ) => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        {
          id: uuid(),
          eventType: AppealEventType.APPEALED,
          appealOrigin,
          userRole: UserRole.DEFENDER,
        },
      ])

      return {
        id: caseId,
        type: CaseType.CUSTODY,
        appealCase: { id: appealCaseId, appealState },
      } as Case
    }

    const dto = {
      partyRole: AppealDecisionPartyRole.PROSECUTOR,
      decision: CaseAppealDecision.ACCEPT,
    }

    it('rejects the change when a party appealed out of court', async () => {
      const theCase = withAppeal(
        AppealCaseState.APPEALED,
        AppealOrigin.OUT_OF_COURT,
      )

      await expect(upsert(theCase, dto)).rejects.toThrow(
        'appealed out of court',
      )
      expect(mockAppealDecisionRepositoryService.upsert).not.toHaveBeenCalled()
    })

    it('rejects the change when the appeal has been received', async () => {
      const theCase = withAppeal(
        AppealCaseState.RECEIVED,
        AppealOrigin.IN_COURT,
      )

      await expect(upsert(theCase, dto)).rejects.toThrow(
        'progressed past the district court',
      )
      expect(mockAppealDecisionRepositoryService.upsert).not.toHaveBeenCalled()
    })

    it('allows the change while an in-court appeal is still at the district court', async () => {
      const theCase = withAppeal(
        AppealCaseState.APPEALED,
        AppealOrigin.IN_COURT,
      )

      await expect(upsert(theCase, dto)).resolves.not.toThrow()
      expect(mockAppealDecisionRepositoryService.upsert).toHaveBeenCalled()
    })
  })
})
