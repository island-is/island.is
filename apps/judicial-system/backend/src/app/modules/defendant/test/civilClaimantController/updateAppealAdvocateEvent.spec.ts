import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealEventType,
  CivilClaimantNotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'

// This spec imports the middleware barrel, which would otherwise load the
// real helper before createTestingDefendantModule mocks it.
jest.mock('../../../../middleware/queueMessagesAfterCommit')

import {
  AppealCase,
  AppealEventLogRepositoryService,
  Case,
  CivilClaimant,
  CivilClaimantRepositoryService,
} from '../../../repository'

/**
 * The court of appeals confirming a civil claimant's advocate for the appeal.
 *
 * Recorded for a lawyer as well as a spokesperson. Only the spokesperson is
 * formally appointed and gets a letter, but the court confirmed either way,
 * and that is what this records.
 */
describe('CivilClaimantController - Update writes an advocate confirmed event', () => {
  const caseId = uuid()
  const civilClaimantId = uuid()
  const appealCaseId = uuid()

  const actor = {
    id: uuid(),
    nationalId: '0000000000',
    name: 'Áslaug Björk Ingólfsdóttir',
    title: 'aðstoðarmaður dómara',
    role: UserRole.COURT_OF_APPEALS_ASSISTANT,
    institution: { name: 'Landsréttur' },
  } as User

  let mockCivilClaimantRepositoryService: CivilClaimantRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let transaction: Transaction
  let mockSequelize: Sequelize
  let update: (
    civilClaimantUpdate: Partial<CivilClaimant>,
    existing?: Partial<CivilClaimant>,
    caseOverrides?: Partial<Case>,
  ) => Promise<unknown>

  beforeEach(async () => {
    const {
      sequelize,
      civilClaimantRepositoryService,
      appealEventLogRepositoryService,
      civilClaimantController,
    } = await createTestingDefendantModule()

    mockCivilClaimantRepositoryService = civilClaimantRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService

    mockSequelize = sequelize
    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    update = (civilClaimantUpdate, existing = {}, caseOverrides = {}) => {
      const mockUpdate =
        mockCivilClaimantRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdate.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        civilClaimants: [
          { id: civilClaimantId, caseId, ...existing, ...civilClaimantUpdate },
        ],
      })

      // Guards do not execute in controller unit tests, so the request
      // context the handler takes its transaction from is set up here.
      return runInRequestContext(async () => {
        await getOrCreateTransaction(mockSequelize)

        return civilClaimantController.update(
          caseId,
          civilClaimantId,
          {
            id: caseId,
            courtCaseNumber: 'S-14/2026',
            verdictAppealCase: { id: appealCaseId } as AppealCase,
            ...caseOverrides,
          } as Case,
          actor,
          { id: civilClaimantId, ...existing } as CivilClaimant,
          civilClaimantUpdate,
        )
      })
    }
  })

  // The handler must take the request's transaction rather than open one of
  // its own: the setup below already opened it, so a second call would mean
  // the update and the event sat in a transaction apart from the request's.
  it('writes in the transaction the request already opened', async () => {
    await update({ isAppealSpokespersonConfirmed: true })

    expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
  })

  it('records who confirmed, when, and for which claimant', async () => {
    await update({ isAppealSpokespersonConfirmed: true })

    expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
      {
        caseId,
        appealCaseId,
        eventType: AppealEventType.ADVOCATE_CONFIRMED,
        defendantId: undefined,
        civilClaimantId,
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

  // A lawyer is never formally appointed, so no letter follows - but the
  // court did confirm them, and the record says so.
  it('records a lawyer as well as a spokesperson', async () => {
    await update({
      isAppealSpokespersonConfirmed: true,
      appealSpokespersonIsLawyer: true,
    })

    expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalled()
  })

  it('does not record an update that leaves the confirmation standing', async () => {
    await update(
      { isAppealSpokespersonConfirmed: true },
      { isAppealSpokespersonConfirmed: true },
    )

    expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
  })

  it('does not record anything when nothing was confirmed', async () => {
    await update({ appealSpokespersonName: 'Lára Lögmann' })

    expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
  })

  it('leaves the confirmation alone when there is no verdict appeal', async () => {
    await update(
      { isAppealSpokespersonConfirmed: true },
      {},
      { verdictAppealCase: undefined },
    )

    expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
  })
})

describe('CivilClaimantController - Update takes a stale confirmation back', () => {
  const caseId = uuid()
  const civilClaimantId = uuid()
  const appealCaseId = uuid()

  const actor = {
    id: uuid(),
    role: UserRole.COURT_OF_APPEALS_ASSISTANT,
  } as User

  let mockCivilClaimantRepositoryService: CivilClaimantRepositoryService
  let update: (
    civilClaimantUpdate: Partial<CivilClaimant>,
    existing?: Partial<CivilClaimant>,
  ) => Promise<unknown>

  beforeEach(async () => {
    const {
      sequelize,
      civilClaimantRepositoryService,
      civilClaimantController,
    } = await createTestingDefendantModule()

    mockCivilClaimantRepositoryService = civilClaimantRepositoryService
    ;(sequelize.transaction as jest.Mock).mockResolvedValue({} as Transaction)

    update = (civilClaimantUpdate, existing = {}) => {
      const mockUpdate =
        civilClaimantRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdate.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        civilClaimants: [
          { id: civilClaimantId, caseId, ...existing, ...civilClaimantUpdate },
        ],
      })

      return runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        return civilClaimantController.update(
          caseId,
          civilClaimantId,
          {
            id: caseId,
            courtCaseNumber: 'S-14/2026',
            verdictAppealCase: { id: appealCaseId } as AppealCase,
          } as Case,
          actor,
          { id: civilClaimantId, ...existing } as CivilClaimant,
          civilClaimantUpdate,
        )
      })
    }
  })

  // A confirmation names a person, so one cannot survive the person changing:
  // the letter would otherwise print the new advocate over the signatory and
  // date of the confirmation that named the old one.
  it('takes the confirmation back when the advocate changes', async () => {
    await update(
      { appealSpokespersonName: 'Nýr Réttargæslumaður' },
      {
        isAppealSpokespersonConfirmed: true,
        appealSpokespersonName: 'Fyrri Réttargæslumaður',
      },
    )

    expect(
      mockCivilClaimantRepositoryService.updateByIdAndCase,
    ).toHaveBeenCalledWith(
      civilClaimantId,
      caseId,
      expect.objectContaining({ isAppealSpokespersonConfirmed: false }),
      expect.anything(),
    )
  })

  it('leaves a first confirmation alone', async () => {
    await update({
      appealSpokespersonName: 'Brynjar Sveinsson',
      isAppealSpokespersonConfirmed: true,
    })

    expect(
      mockCivilClaimantRepositoryService.updateByIdAndCase,
    ).toHaveBeenCalledWith(
      civilClaimantId,
      caseId,
      expect.objectContaining({ isAppealSpokespersonConfirmed: true }),
      expect.anything(),
    )
  })

  it('leaves an update that renames nobody alone', async () => {
    await update(
      { appealSpokespersonEmail: 'ny@example.is' },
      {
        isAppealSpokespersonConfirmed: true,
        appealSpokespersonName: 'Fyrri Réttargæslumaður',
      },
    )

    expect(
      mockCivilClaimantRepositoryService.updateByIdAndCase,
    ).toHaveBeenCalledWith(
      civilClaimantId,
      caseId,
      expect.not.objectContaining({ isAppealSpokespersonConfirmed: false }),
      expect.anything(),
    )
  })
})

/**
 * The mail that tells the claimant's advocate the court of appeals has
 * recorded them. A lögmaður gets it too, though no letter of appointment
 * follows.
 */
describe('CivilClaimantController - Update notifies a confirmed appeal advocate', () => {
  const caseId = uuid()
  const civilClaimantId = uuid()
  const appealCaseId = uuid()

  const actor = {
    id: uuid(),
    nationalId: '0000000000',
    name: 'Áslaug Björk Ingólfsdóttir',
    role: UserRole.COURT_OF_APPEALS_ASSISTANT,
    institution: { name: 'Landsréttur' },
  } as User

  let queuedMessages: { type: MessageType; body?: unknown }[]
  let update: (
    civilClaimantUpdate: Partial<CivilClaimant>,
    existing?: Partial<CivilClaimant>,
    caseOverrides?: Partial<Case>,
  ) => Promise<unknown>

  const appealAdvocateNotifications = () =>
    queuedMessages.filter(
      (message) =>
        message.type === MessageType.CIVIL_CLAIMANT_NOTIFICATION &&
        (message.body as { type?: string })?.type ===
          CivilClaimantNotificationType.APPEAL_SPOKESPERSON_ASSIGNED,
    )

  beforeEach(async () => {
    const {
      sequelize,
      civilClaimantRepositoryService,
      civilClaimantController,
      queuedMessagesAfterCommit,
    } = await createTestingDefendantModule()

    queuedMessages = queuedMessagesAfterCommit
    ;(sequelize.transaction as jest.Mock).mockResolvedValue({} as Transaction)

    update = (civilClaimantUpdate, existing = {}, caseOverrides = {}) => {
      const mockUpdate =
        civilClaimantRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdate.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        civilClaimants: [
          { id: civilClaimantId, caseId, ...existing, ...civilClaimantUpdate },
        ],
      })

      return runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        return civilClaimantController.update(
          caseId,
          civilClaimantId,
          {
            id: caseId,
            courtCaseNumber: 'S-14/2026',
            verdictAppealCase: { id: appealCaseId } as AppealCase,
            ...caseOverrides,
          } as Case,
          actor,
          { id: civilClaimantId, ...existing } as CivilClaimant,
          civilClaimantUpdate,
        )
      })
    }
  })

  // The same message whichever role the court settled on - the body names the
  // role, and only the letter of appointment tells a lawyer apart.
  it.each([true, false])(
    'queues the mail when the advocate is confirmed (lawyer: %s)',
    async (appealSpokespersonIsLawyer) => {
      await update({
        isAppealSpokespersonConfirmed: true,
        appealSpokespersonIsLawyer,
      })

      expect(appealAdvocateNotifications()).toEqual([
        {
          type: MessageType.CIVIL_CLAIMANT_NOTIFICATION,
          caseId,
          elementId: civilClaimantId,
          body: {
            type: CivilClaimantNotificationType.APPEAL_SPOKESPERSON_ASSIGNED,
          },
        },
      ])
    },
  )

  it('queues nothing when the confirmation already stood', async () => {
    await update(
      { appealSpokespersonEmail: 'ny@example.is' },
      { isAppealSpokespersonConfirmed: true },
    )

    expect(appealAdvocateNotifications()).toEqual([])
  })

  it('queues nothing when there is no verdict appeal', async () => {
    await update(
      { isAppealSpokespersonConfirmed: true },
      {},
      {
        verdictAppealCase: undefined,
      },
    )

    expect(appealAdvocateNotifications()).toEqual([])
  })
})
