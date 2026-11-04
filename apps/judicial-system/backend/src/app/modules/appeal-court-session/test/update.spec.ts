import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  AppealCaseType,
  AppealCourtSessionType,
} from '@island.is/judicial-system/types'

import { createTestingAppealCourtSessionModule } from './createTestingAppealCourtSessionModule'

import { getOrCreateTransaction } from '../../../middleware'
import { runInRequestContext } from '../../../test'
import {
  AppealCase,
  AppealCourtSession,
  AppealCourtSessionRepositoryService,
  Case,
} from '../../repository'
import { UpdateAppealCourtSessionDto } from '../dto/updateAppealCourtSession.dto'

describe('AppealCourtSessionController - Update', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const sessionId = uuid()
  const theCase = { id: caseId } as Case
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
  const updated = { ...session, courtRoom: '2' } as AppealCourtSession
  const transaction = {} as Transaction

  let mockTransaction: jest.Mock
  let mockAppealCourtSessionRepositoryService: AppealCourtSessionRepositoryService
  let update: (dto: UpdateAppealCourtSessionDto) => Promise<AppealCourtSession>

  beforeEach(async () => {
    const { sequelize, appealCourtSessionController, ...testingModule } =
      await createTestingAppealCourtSessionModule()

    mockAppealCourtSessionRepositoryService =
      testingModule.appealCourtSessionRepositoryService
    mockTransaction = sequelize.transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)
    ;(
      mockAppealCourtSessionRepositoryService.update as jest.Mock
    ).mockResolvedValue(updated)

    // The route is guarded by CaseExistsForUpdateGuard, which opens the
    // request transaction before the handler runs. Guards do not execute in
    // controller unit tests, so the request context is set up here instead.
    update = (dto) =>
      runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        return appealCourtSessionController.update(
          caseId,
          appealCaseId,
          sessionId,
          theCase,
          appealCase,
          session,
          dto,
        )
      })
  })

  it('writes the given fields to the session on the appeal', async () => {
    const dto: UpdateAppealCourtSessionDto = {
      sessionType: AppealCourtSessionType.VERDICT,
      sessionDate: new Date(2027, 0, 5, 9, 30),
      courtRoom: '2',
    }

    const result = await update(dto)

    expect(mockAppealCourtSessionRepositoryService.update).toHaveBeenCalledWith(
      sessionId,
      appealCaseId,
      {
        sessionType: dto.sessionType,
        sessionDate: dto.sessionDate,
        courtRoom: dto.courtRoom,
      },
      { transaction },
    )
    expect(result).toBe(updated)
  })

  it('joins the transaction the guard opened rather than open one', async () => {
    await update({ courtRoom: '2' })

    expect(mockTransaction).toHaveBeenCalledTimes(1)
  })

  it('leaves out the fields that are not given', async () => {
    await update({ courtRoom: '2' })

    expect(mockAppealCourtSessionRepositoryService.update).toHaveBeenCalledWith(
      sessionId,
      appealCaseId,
      { courtRoom: '2' },
      { transaction },
    )
  })

  it('refuses an empty update', async () => {
    await expect(update({})).rejects.toBeInstanceOf(BadRequestException)

    expect(
      mockAppealCourtSessionRepositoryService.update,
    ).not.toHaveBeenCalled()
  })
})
