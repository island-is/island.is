import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import {
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealSummonsModule } from './createTestingAppealSummonsModule'

import {
  AppealSummons,
  AppealSummonsRepositoryService,
  Case,
} from '../../repository'
import { AppealSummonsController } from '../appealSummons.controller'

describe('AppealSummonsController - Delete', () => {
  const caseId = uuid()
  const summonsId = uuid()
  const user = {
    id: uuid(),
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    nationalId: '0000007777',
    name: 'Staff',
    institution: { type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE },
  } as User

  const theCase = { id: caseId } as Case
  const draft = { id: summonsId } as AppealSummons
  const sent = {
    id: summonsId,
    sentToCourtOfAppealsDate: new Date('2026-06-10T10:00:00.000Z'),
  } as AppealSummons

  let mockAppealSummonsRepositoryService: AppealSummonsRepositoryService
  let transaction: Transaction
  let appealSummonsController: AppealSummonsController

  beforeEach(async () => {
    const testingModule = await createTestingAppealSummonsModule()

    mockAppealSummonsRepositoryService =
      testingModule.appealSummonsRepositoryService
    transaction = {} as Transaction
    appealSummonsController = testingModule.appealSummonsController
    ;(testingModule.sequelize.transaction as jest.Mock).mockImplementation(
      (callback) => callback(transaction),
    )
    ;(mockAppealSummonsRepositoryService.delete as jest.Mock).mockResolvedValue(
      true,
    )
  })

  it('deletes a draft summons', async () => {
    const result = await appealSummonsController.delete(
      caseId,
      summonsId,
      theCase,
      draft,
      user,
    )

    expect(mockAppealSummonsRepositoryService.delete).toHaveBeenCalledWith(
      summonsId,
      caseId,
      { transaction },
    )
    expect(result).toEqual({ deleted: true })
  })

  it('rejects delete once the summons has been sent to the court of appeals', async () => {
    await expect(
      appealSummonsController.delete(caseId, summonsId, theCase, sent, user),
    ).rejects.toThrow(ForbiddenException)

    expect(mockAppealSummonsRepositoryService.delete).not.toHaveBeenCalled()
  })
})
