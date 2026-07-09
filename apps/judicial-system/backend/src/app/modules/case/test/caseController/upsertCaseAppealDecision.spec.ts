import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  AppealDecisionPartyRole,
  CaseAppealDecision,
  CaseType,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import {
  AppealDecisionRepositoryService,
  Case,
  CaseRepositoryService,
} from '../../../repository'
import { CaseAppealDecisionDto } from '../../dto/caseAppealDecision.dto'

describe('CaseController - Upsert case appeal decision', () => {
  const caseId = uuid()

  let transaction: Transaction
  let mockAppealDecisionRepositoryService: AppealDecisionRepositoryService
  let mockCaseRepositoryService: CaseRepositoryService
  let upsert: (theCase: Case, dto: CaseAppealDecisionDto) => Promise<unknown>

  beforeEach(async () => {
    const {
      appealDecisionRepositoryService,
      caseRepositoryService,
      sequelize,
      caseController,
    } = await createTestingCaseModule()

    mockAppealDecisionRepositoryService = appealDecisionRepositoryService
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
})
