import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import {
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealSummonsModule } from './createTestingAppealSummonsModule'

import { getOrCreateTransaction } from '../../../middleware'
import { runInRequestContext } from '../../../test'
import { AwsS3Service } from '../../aws-s3'
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
  let mockAwsS3Service: AwsS3Service
  let mockSequelize: Sequelize
  let transaction: Transaction
  let appealSummonsController: AppealSummonsController

  // The route is guarded by CaseExistsForUpdateGuard, so the request
  // transaction is already open - and holding a lock on this case row - by
  // the time the handler runs. Guards do not execute in controller unit
  // tests, so the request context and that transaction are set up here
  // instead.
  const remove = (summons: AppealSummons) =>
    runInRequestContext(async () => {
      await getOrCreateTransaction(mockSequelize)

      return appealSummonsController.delete(
        caseId,
        summonsId,
        theCase,
        summons,
        user,
      )
    })

  beforeEach(async () => {
    const testingModule = await createTestingAppealSummonsModule()

    mockAppealSummonsRepositoryService =
      testingModule.appealSummonsRepositoryService
    mockAwsS3Service = testingModule.awsS3Service
    mockSequelize = testingModule.sequelize
    transaction = {
      afterCommit: jest.fn((callback: () => void) => {
        void callback()
      }),
    } as unknown as Transaction
    appealSummonsController = testingModule.appealSummonsController
    ;(testingModule.sequelize.transaction as jest.Mock).mockResolvedValue(
      transaction,
    )
    ;(mockAppealSummonsRepositoryService.delete as jest.Mock).mockResolvedValue(
      true,
    )
    ;(mockAwsS3Service.deleteObject as jest.Mock).mockResolvedValue(true)
  })

  it('deletes a draft summons in the transaction the guard opened, and its cached PDF', async () => {
    const result = await remove(draft)

    // Once, by the stand-in for CaseExistsForUpdateGuard above. A second call
    // would be the handler opening a transaction of its own, which would
    // block on the guard's row lock and deadlock the request.
    expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
    expect(mockAppealSummonsRepositoryService.delete).toHaveBeenCalledWith(
      summonsId,
      caseId,
      { transaction },
    )
    expect(mockAwsS3Service.deleteObject).toHaveBeenCalledWith(
      theCase.type,
      `${caseId}/appealSummons/${summonsId}.pdf`,
    )
    expect(result).toEqual({ deleted: true })
  })

  it('deletes a confirmed summons and its cached PDF', async () => {
    const confirmed = {
      id: summonsId,
      confirmedDate: new Date('2026-06-05T09:15:00.000Z'),
    } as AppealSummons

    const result = await remove(confirmed)

    expect(mockAppealSummonsRepositoryService.delete).toHaveBeenCalledWith(
      summonsId,
      caseId,
      { transaction },
    )
    expect(mockAwsS3Service.deleteObject).toHaveBeenCalledWith(
      theCase.type,
      `${caseId}/appealSummons/${summonsId}.pdf`,
    )
    expect(result).toEqual({ deleted: true })
  })

  it('rejects delete once the summons has been sent to the court of appeals', async () => {
    await expect(remove(sent)).rejects.toThrow(ForbiddenException)

    expect(mockAppealSummonsRepositoryService.delete).not.toHaveBeenCalled()
    expect(mockAwsS3Service.deleteObject).not.toHaveBeenCalled()
  })
})
