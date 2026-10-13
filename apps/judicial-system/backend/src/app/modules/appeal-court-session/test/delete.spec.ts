import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { AppealCaseType } from '@island.is/judicial-system/types'

import { createTestingAppealCourtSessionModule } from './createTestingAppealCourtSessionModule'

import {
  AppealCase,
  AppealCourtSession,
  AppealCourtSessionRepositoryService,
  Case,
} from '../../repository'
import { AppealCourtSessionController } from '../appealCourtSession.controller'

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

  let mockAppealCourtSessionRepositoryService: AppealCourtSessionRepositoryService
  let appealCourtSessionController: AppealCourtSessionController

  beforeEach(async () => {
    const testingModule = await createTestingAppealCourtSessionModule()

    mockAppealCourtSessionRepositoryService =
      testingModule.appealCourtSessionRepositoryService
    appealCourtSessionController = testingModule.appealCourtSessionController
    ;(testingModule.sequelize.transaction as jest.Mock).mockImplementation(
      (callback) => callback(transaction),
    )
    ;(
      mockAppealCourtSessionRepositoryService.delete as jest.Mock
    ).mockResolvedValue(true)
  })

  it('deletes the session from the appeal', async () => {
    const result = await appealCourtSessionController.delete(
      caseId,
      appealCaseId,
      sessionId,
      theCase,
      appealCase,
      session,
    )

    expect(mockAppealCourtSessionRepositoryService.delete).toHaveBeenCalledWith(
      sessionId,
      appealCaseId,
      { transaction },
    )
    expect(result).toEqual({ deleted: true })
  })
})
