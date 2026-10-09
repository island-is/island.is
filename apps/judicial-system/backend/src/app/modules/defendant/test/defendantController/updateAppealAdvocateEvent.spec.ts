import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  AppealEventType,
  CaseIndictmentRulingDecision,
  CaseType,
  IndictmentCaseReviewDecision,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { runInRequestContext } from '../../../../test'
import {
  AppealCase,
  AppealEventLogRepositoryService,
  Case,
  Defendant,
  DefendantRepositoryService,
} from '../../../repository'

/**
 * The record of the court of appeals confirming a defendant's defender for the
 * appeal, which is what gives the letter of appointment its signatory and
 * date. The defendant row keeps neither.
 */
describe('DefendantController - Update writes an advocate confirmed event', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const appealCaseId = uuid()

  const actor = {
    id: uuid(),
    nationalId: '0000000000',
    name: 'Áslaug Björk Ingólfsdóttir',
    title: 'aðstoðarmaður dómara',
    role: UserRole.COURT_OF_APPEALS_ASSISTANT,
    institution: { name: 'Landsréttur' },
  } as User

  const defendant = { id: defendantId, caseId } as Defendant

  let mockDefendantRepositoryService: DefendantRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let transaction: Transaction
  let update: (
    defendantUpdate: Partial<Defendant>,
    existing?: Partial<Defendant>,
    caseOverrides?: Partial<Case>,
  ) => Promise<unknown>

  beforeEach(async () => {
    const {
      sequelize,
      defendantRepositoryService,
      appealEventLogRepositoryService,
      defendantController,
    } = await createTestingDefendantModule()

    mockDefendantRepositoryService = defendantRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    update = (defendantUpdate, existing = {}, caseOverrides = {}) => {
      const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce({
        ...defendant,
        ...existing,
        ...defendantUpdate,
      })

      // Guards do not execute in controller unit tests, so the request
      // context the handler takes its transaction from is set up here.
      return runInRequestContext(() =>
        defendantController.update(
          caseId,
          defendantId,
          actor,
          {
            id: caseId,
            type: CaseType.INDICTMENT,
            courtCaseNumber: 'S-14/2026',
            verdictAppealCase: { id: appealCaseId } as AppealCase,
            ...caseOverrides,
          } as Case,
          { ...defendant, ...existing } as Defendant,
          defendantUpdate,
        ),
      )
    }
  })

  it('records who confirmed, when, and for which defendant', async () => {
    await update({ isAppealDefenderConfirmed: true })

    expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
      {
        caseId,
        appealCaseId,
        eventType: AppealEventType.ADVOCATE_CONFIRMED,
        defendantId,
        civilClaimantId: undefined,
        userRole: UserRole.COURT_OF_APPEALS_ASSISTANT,
        userId: actor.id,
        nationalId: actor.nationalId,
        userName: actor.name,
        userTitle: actor.title,
        institutionName: 'Landsréttur',
      },
      { transaction },
    )
  })

  // Only the crossing from unconfirmed to confirmed is an act of the court.
  // Saving anything else on an already confirmed defendant must not look like
  // a second confirmation and re-date the letter.
  it('does not record an update that leaves the confirmation standing', async () => {
    await update(
      { isAppealDefenderConfirmed: true },
      { isAppealDefenderConfirmed: true },
    )

    expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
  })

  it('does not record anything when nothing was confirmed', async () => {
    await update({ appealDefenderName: 'Lára Lögmann' })

    expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
  })

  // A confirmation names a person. Putting a different defender on an already
  // confirmed defendant must take the confirmation back, or the letter would
  // print the new name over the old signatory and date. The screen already
  // makes the court confirm again; this is the API doing the same.
  it('takes the confirmation back when the defender changes', async () => {
    await update(
      { appealDefenderName: 'Nýr Verjandi' },
      {
        isAppealDefenderConfirmed: true,
        appealDefenderName: 'Fyrri Verjandi',
      },
    )

    expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
      caseId,
      defendantId,
      expect.objectContaining({ isAppealDefenderConfirmed: false }),
      expect.anything(),
    )
  })

  // Confirming a defender the row did not have yet is the ordinary case and
  // must go through untouched, even though both fields move at once.
  it('leaves a first confirmation alone', async () => {
    await update({
      appealDefenderName: 'Lára Lögmann',
      isAppealDefenderConfirmed: true,
    })

    expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
      caseId,
      defendantId,
      expect.objectContaining({ isAppealDefenderConfirmed: true }),
      expect.anything(),
    )
  })

  it('leaves an update that renames nobody alone', async () => {
    await update(
      { appealDefenderEmail: 'ny@example.is' },
      {
        isAppealDefenderConfirmed: true,
        appealDefenderName: 'Fyrri Verjandi',
      },
    )

    expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
      caseId,
      defendantId,
      expect.not.objectContaining({ isAppealDefenderConfirmed: false }),
      expect.anything(),
    )
  })

  // A court of appeals user reaching this defendant through a ruling appeal
  // has no verdict appeal to record the confirmation against. The
  // confirmation itself still saves.
  it('leaves the confirmation alone when there is no verdict appeal', async () => {
    const result = await update(
      { isAppealDefenderConfirmed: true },
      {},
      { verdictAppealCase: undefined },
    )

    expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    expect(result).toEqual(
      expect.objectContaining({ isAppealDefenderConfirmed: true }),
    )
  })
})

/**
 * One request may both register the prosecution's appeal and confirm an
 * advocate on it. The confirmation has nothing to record itself against until
 * the appeal exists, so the order the two run in decides whether the letter
 * ever gets a signatory.
 */
describe('DefendantController - Update confirms against an appeal it just registered', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const newAppealCaseId = uuid()

  const actor = {
    id: uuid(),
    nationalId: '0000000000',
    name: 'RIKSAK skrifstofa',
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    institution: { name: 'Ríkissaksóknari' },
  } as User

  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService

  beforeEach(async () => {
    const {
      sequelize,
      defendantRepositoryService,
      appealEventLogRepositoryService,
      appealCaseService,
      defendantController,
    } = await createTestingDefendantModule()

    mockAppealEventLogRepositoryService = appealEventLogRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn({} as Transaction),
    )

    const mockCreateAppeal = appealCaseService.create as jest.Mock
    mockCreateAppeal.mockResolvedValue({ id: newAppealCaseId } as AppealCase)

    const mockUpdate = defendantRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValueOnce({
      id: defendantId,
      caseId,
      isAppealDefenderConfirmed: true,
      indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
    })

    await defendantController.update(
      caseId,
      defendantId,
      actor,
      {
        id: caseId,
        type: CaseType.INDICTMENT,
        courtCaseNumber: 'S-14/2026',
        indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
        // No appeal yet - this request is what creates it.
        verdictAppealCase: undefined,
      } as Case,
      { id: defendantId, caseId } as Defendant,
      {
        registerVerdictAppeal: true,
        indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
        isAppealDefenderConfirmed: true,
      },
    )
  })

  it('records the confirmation against the appeal the same request created', () => {
    expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        appealCaseId: newAppealCaseId,
        eventType: AppealEventType.ADVOCATE_CONFIRMED,
        defendantId,
      }),
      expect.anything(),
    )
  })
})
