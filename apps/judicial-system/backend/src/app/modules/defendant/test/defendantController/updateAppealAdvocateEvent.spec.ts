import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealEventType,
  CaseType,
  DefendantNotificationType,
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
 * The mail that tells the defender the court of appeals has recorded them.
 * It rides on the same confirmation as the event above, so the two are tested
 * against the same transitions.
 */
describe('DefendantController - Update notifies a confirmed appeal defender', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const appealCaseId = uuid()

  const actor = {
    id: uuid(),
    nationalId: '0000000000',
    name: 'Áslaug Björk Ingólfsdóttir',
    role: UserRole.COURT_OF_APPEALS_ASSISTANT,
    institution: { name: 'Landsréttur' },
  } as User

  const defendant = { id: defendantId, caseId } as Defendant

  let queuedMessages: { type: MessageType; body?: unknown }[]
  let update: (
    defendantUpdate: Partial<Defendant>,
    existing?: Partial<Defendant>,
    caseOverrides?: Partial<Case>,
  ) => Promise<unknown>

  const appealDefenderNotifications = () =>
    queuedMessages.filter(
      (message) =>
        message.type === MessageType.DEFENDANT_NOTIFICATION &&
        (message.body as { type?: string })?.type ===
          DefendantNotificationType.APPEAL_DEFENDER_ASSIGNED,
    )

  beforeEach(async () => {
    const {
      sequelize,
      defendantRepositoryService,
      defendantController,
      queuedMessagesAfterCommit,
    } = await createTestingDefendantModule()

    queuedMessages = queuedMessagesAfterCommit

    const mockTransaction = sequelize.transaction as jest.Mock
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn({} as Transaction),
    )

    update = (defendantUpdate, existing = {}, caseOverrides = {}) => {
      const mockUpdate = defendantRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce({
        ...defendant,
        ...existing,
        ...defendantUpdate,
      })

      return defendantController.update(
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
      )
    }
  })

  it('queues the mail for the defendant just confirmed', async () => {
    await update({ isAppealDefenderConfirmed: true })

    expect(appealDefenderNotifications()).toEqual([
      {
        type: MessageType.DEFENDANT_NOTIFICATION,
        caseId,
        elementId: defendantId,
        body: { type: DefendantNotificationType.APPEAL_DEFENDER_ASSIGNED },
      },
    ])
  })

  // Saving anything else on an already confirmed defendant must not mail them
  // again, the same rule the event follows.
  it('queues nothing when the confirmation already stood', async () => {
    await update(
      { appealDefenderEmail: 'ny@example.is' },
      { isAppealDefenderConfirmed: true },
    )

    expect(appealDefenderNotifications()).toEqual([])
  })

  it('queues nothing when there is no verdict appeal', async () => {
    await update(
      { isAppealDefenderConfirmed: true },
      {},
      {
        verdictAppealCase: undefined,
      },
    )

    expect(appealDefenderNotifications()).toEqual([])
  })
})
