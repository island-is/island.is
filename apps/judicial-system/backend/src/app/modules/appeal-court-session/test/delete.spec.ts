import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { AppealCaseType } from '@island.is/judicial-system/types'

import { createTestingAppealCourtSessionModule } from './createTestingAppealCourtSessionModule'

import { getOrCreateTransaction } from '../../../middleware'
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
  const appealCase = {
    id: appealCaseId,
    appealType: AppealCaseType.VERDICT,
  } as AppealCase
  const session = { id: sessionId } as AppealCourtSession
  const transaction = {} as Transaction

  let mockTransaction: jest.Mock
  let mockAppealCourtSessionRepositoryService: AppealCourtSessionRepositoryService
  let remove: () => Promise<{ deleted: boolean }>

  beforeEach(async () => {
    const { sequelize, appealCourtSessionController, ...testingModule } =
      await createTestingAppealCourtSessionModule()

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

  it('joins the transaction the guard opened rather than open one', async () => {
    await remove()

    expect(mockTransaction).toHaveBeenCalledTimes(1)
  })
})
