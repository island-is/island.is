import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  AppealCaseType,
  AppealCourtSessionType,
} from '@island.is/judicial-system/types'

import { createTestingAppealCourtSessionModule } from './createTestingAppealCourtSessionModule'

import {
  AppealCase,
  AppealCourtSession,
  AppealCourtSessionRepositoryService,
  Case,
} from '../../repository'
import { AppealCourtSessionController } from '../appealCourtSession.controller'
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
      mockAppealCourtSessionRepositoryService.update as jest.Mock
    ).mockResolvedValue(updated)
  })

  it('writes the given fields to the session on the appeal', async () => {
    const dto: UpdateAppealCourtSessionDto = {
      sessionType: AppealCourtSessionType.VERDICT,
      sessionDate: new Date(2027, 0, 5, 9, 30),
      courtRoom: '2',
    }

    const result = await appealCourtSessionController.update(
      caseId,
      appealCaseId,
      sessionId,
      theCase,
      appealCase,
      session,
      dto,
    )

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

  it('leaves out the fields that are not given', async () => {
    await appealCourtSessionController.update(
      caseId,
      appealCaseId,
      sessionId,
      theCase,
      appealCase,
      session,
      { courtRoom: '2' },
    )

    expect(mockAppealCourtSessionRepositoryService.update).toHaveBeenCalledWith(
      sessionId,
      appealCaseId,
      { courtRoom: '2' },
      { transaction },
    )
  })

  it('refuses an empty update', async () => {
    await expect(
      appealCourtSessionController.update(
        caseId,
        appealCaseId,
        sessionId,
        theCase,
        appealCase,
        session,
        {},
      ),
    ).rejects.toBeInstanceOf(BadRequestException)

    expect(
      mockAppealCourtSessionRepositoryService.update,
    ).not.toHaveBeenCalled()
  })
})
