import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  AppealEventType,
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
