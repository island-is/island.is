import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealCaseType,
  AppealCourtSessionType,
  type User,
} from '@island.is/judicial-system/types'

import { createTestingAppealCourtSessionModule } from './createTestingAppealCourtSessionModule'

import { getOrCreateTransaction } from '../../../middleware'
import { queueMessagesAfterCommit } from '../../../middleware/queueMessagesAfterCommit'
import { runInRequestContext } from '../../../test'
import {
  AppealCase,
  AppealCourtSession,
  AppealCourtSessionRepositoryService,
  Case,
} from '../../repository'

describe('AppealCourtSessionController - Delete', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const sessionId = uuid()
  const theCase = { id: caseId } as Case
  const user = { id: uuid() } as User
  const appealCase = {
    id: appealCaseId,
    appealType: AppealCaseType.VERDICT,
  } as AppealCase
  const session = {
    id: sessionId,
    sessionType: AppealCourtSessionType.MAIN_HEARING,
    sessionDate: new Date(2026, 11, 12, 14, 0),
    courtRoom: '1',
  } as AppealCourtSession
  const transaction = {} as Transaction

  let mockTransaction: jest.Mock
  let mockAppealCourtSessionRepositoryService: AppealCourtSessionRepositoryService
  let remove: () => Promise<{ deleted: boolean }>

  beforeEach(async () => {
    const { sequelize, appealCourtSessionController, ...testingModule } =
      await createTestingAppealCourtSessionModule()

    const mockQueueMessagesAfterCommit = queueMessagesAfterCommit as jest.Mock
    mockQueueMessagesAfterCommit.mockClear()

    mockAppealCourtSessionRepositoryService =
      testingModule.appealCourtSessionRepositoryService
    mockTransaction = sequelize.transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)
    ;(
      mockAppealCourtSessionRepositoryService.delete as jest.Mock
    ).mockResolvedValue(true)

    // The route is guarded by CaseExistsForUpdateGuard, which opens the
    // request transaction before the handler runs. Guards do not execute in
    // controller unit tests, so the request context is set up here instead.
    remove = () =>
      runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        return appealCourtSessionController.delete(
          caseId,
          appealCaseId,
          sessionId,
          user,
          theCase,
          appealCase,
          session,
        )
      })
  })

  it('deletes the session from the appeal', async () => {
    const result = await remove()

    expect(mockAppealCourtSessionRepositoryService.delete).toHaveBeenCalledWith(
      sessionId,
      appealCaseId,
      { transaction },
    )
    expect(result).toEqual({ deleted: true })
  })

  // The row is gone once the message runs, so the message itself has to
  // say what the session was.
  it('tells the parties what was cancelled once it has committed', async () => {
    await remove()

    expect(queueMessagesAfterCommit).toHaveBeenCalledWith({
      type: MessageType.APPEAL_CASE_NOTIFICATION,
      user,
      caseId,
      elementId: appealCaseId,
      body: {
        type: AppealCaseNotificationType.APPEAL_COURT_SESSION_CANCELLED,
        appealCourtSession: {
          sessionType: session.sessionType,
          sessionDate: session.sessionDate,
          courtRoom: session.courtRoom,
        },
      },
    })
  })

  it('joins the transaction the guard opened rather than open one', async () => {
    await remove()

    expect(mockTransaction).toHaveBeenCalledTimes(1)
  })
})
