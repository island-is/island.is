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
import { CreateAppealCourtSessionDto } from '../dto/createAppealCourtSession.dto'

interface Then {
  result: AppealCourtSession
  error: Error
}

type GivenWhenThen = (appealCase: AppealCase) => Promise<Then>

describe('AppealCourtSessionController - Create', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const theCase = { id: caseId } as Case
  const verdictAppeal = {
    id: appealCaseId,
    appealType: AppealCaseType.VERDICT,
  } as AppealCase
  const dto: CreateAppealCourtSessionDto = {
    sessionType: AppealCourtSessionType.MAIN_HEARING,
    sessionDate: new Date(2026, 11, 12, 14, 0),
    courtRoom: '1',
  }
  const created = { id: uuid(), ...dto } as AppealCourtSession
  const transaction = {} as Transaction

  let mockAppealCourtSessionRepositoryService: AppealCourtSessionRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      appealCourtSessionRepositoryService,
      sequelize,
      appealCourtSessionController,
    } = await createTestingAppealCourtSessionModule()

    mockAppealCourtSessionRepositoryService =
      appealCourtSessionRepositoryService
    const mockCreate =
      mockAppealCourtSessionRepositoryService.create as jest.Mock
    mockCreate.mockResolvedValue(created)

    const mockTransaction = sequelize.transaction as jest.Mock
    mockTransaction.mockImplementation((fn) => fn(transaction))

    givenWhenThen = async (appealCase: AppealCase) => {
      const then = {} as Then

      await appealCourtSessionController
        .create(caseId, appealCase.id, theCase, appealCase, dto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  it('books the session on the verdict appeal', async () => {
    const then = await givenWhenThen(verdictAppeal)

    expect(mockAppealCourtSessionRepositoryService.create).toHaveBeenCalledWith(
      {
        caseId,
        appealCaseId,
        sessionType: dto.sessionType,
        sessionDate: dto.sessionDate,
        courtRoom: dto.courtRoom,
      },
      { transaction },
    )
    expect(then.result).toBe(created)
  })

  // The guard matches any of the case's appeals to the id in the URL. A ruling
  // appeal is decided on the papers, so a session in one is a mistake.
  it('refuses a ruling appeal', async () => {
    const then = await givenWhenThen({
      id: appealCaseId,
      appealType: AppealCaseType.RULING,
    } as AppealCase)

    expect(then.error).toBeInstanceOf(BadRequestException)
    expect(
      mockAppealCourtSessionRepositoryService.create,
    ).not.toHaveBeenCalled()
  })
})
