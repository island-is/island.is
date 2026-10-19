import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ConflictException, ForbiddenException } from '@nestjs/common'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealEventType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealSummonsModule } from './createTestingAppealSummonsModule'

import {
  getOrCreateTransaction,
  queueMessagesAfterCommit,
} from '../../../middleware'
import { runInRequestContext } from '../../../test'
import {
  AppealCase,
  AppealEventLogRepositoryService,
  AppealSummons,
  AppealSummonsRepositoryService,
  Case,
} from '../../repository'
import { AppealSummonsController } from '../appealSummons.controller'

jest.mock('../../../middleware/queueMessagesAfterCommit')

describe('AppealSummonsController - Send to court of appeals', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const summonsId = uuid()
  const user = {
    id: uuid(),
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    nationalId: '0000009999',
    name: 'Skrifstofa',
    title: 'fulltrúi',
    institution: {
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      name: 'Ríkissaksóknari',
    },
  } as User

  const theCase = {
    id: caseId,
    verdictAppealCase: { id: appealCaseId } as AppealCase,
  } as Case

  const confirmed = {
    id: summonsId,
    caseId,
    confirmedDate: new Date('2026-06-05T09:15:00.000Z'),
    sentToCourtOfAppealsDate: null,
  } as AppealSummons

  let mockAppealSummonsRepositoryService: AppealSummonsRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockSequelize: Sequelize
  let transaction: Transaction
  let appealSummonsController: AppealSummonsController

  // The route is guarded by CaseExistsForUpdateGuard, so the request
  // transaction is already open - and holding a lock on this case row - by
  // the time the handler runs. Guards do not execute in controller unit
  // tests, so the request context and that transaction are set up here
  // instead.
  const sendToCourtOfAppeals = (
    summons: AppealSummons,
    actingUser: User = user,
  ) =>
    runInRequestContext(async () => {
      await getOrCreateTransaction(mockSequelize)

      return appealSummonsController.sendToCourtOfAppeals(
        caseId,
        summonsId,
        theCase,
        summons,
        actingUser,
      )
    })

  beforeEach(async () => {
    const {
      sequelize,
      appealSummonsRepositoryService,
      appealEventLogRepositoryService,
      appealSummonsController: controller,
    } = await createTestingAppealSummonsModule()

    mockAppealSummonsRepositoryService = appealSummonsRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    appealSummonsController = controller
    mockSequelize = sequelize

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)
    ;(queueMessagesAfterCommit as jest.Mock).mockClear()
  })

  it('sets the send date, logs the event and queues the CoA email', async () => {
    const sentToCourtOfAppealsDate = expect.any(Date)
    const afterSend = {
      ...confirmed,
      sentToCourtOfAppealsDate: new Date(),
    } as AppealSummons

    ;(
      mockAppealSummonsRepositoryService.update as jest.Mock
    ).mockResolvedValueOnce(afterSend)
    ;(
      mockAppealSummonsRepositoryService.findByIdAndCaseId as jest.Mock
    ).mockResolvedValueOnce(afterSend)
    ;(
      mockAppealEventLogRepositoryService.create as jest.Mock
    ).mockResolvedValueOnce({})

    const result = await sendToCourtOfAppeals(confirmed)

    expect(mockAppealSummonsRepositoryService.update).toHaveBeenCalledWith(
      summonsId,
      caseId,
      { sentToCourtOfAppealsDate },
      {
        transaction,
        where: {
          sentToCourtOfAppealsDate: null,
          confirmedDate: confirmed.confirmedDate,
        },
      },
    )
    expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
      {
        caseId,
        appealCaseId,
        eventType: AppealEventType.APPEAL_SUMMONS_SENT_TO_COURT_OF_APPEALS,
        userRole: user.role,
        userId: user.id,
        nationalId: user.nationalId,
        userName: user.name,
        userTitle: user.title,
        institutionName: user.institution?.name,
      },
      { transaction },
    )
    expect(queueMessagesAfterCommit).toHaveBeenCalledWith({
      type: MessageType.APPEAL_CASE_NOTIFICATION,
      user,
      caseId,
      elementId: appealCaseId,
      body: {
        type: AppealCaseNotificationType.APPEAL_SUMMONS_SENT_TO_COURT_OF_APPEALS,
      },
    })
    expect(result).toBe(afterSend)
  })

  it('rejects a draft that has not been confirmed', async () => {
    await expect(
      sendToCourtOfAppeals({
        ...confirmed,
        confirmedDate: null,
      } as AppealSummons),
    ).rejects.toThrow(ForbiddenException)

    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })

  it('rejects a summons that has already been sent', async () => {
    await expect(
      sendToCourtOfAppeals({
        ...confirmed,
        sentToCourtOfAppealsDate: new Date(),
      } as AppealSummons),
    ).rejects.toThrow(ForbiddenException)

    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })

  it('rejects when a concurrent send already set the date', async () => {
    ;(
      mockAppealSummonsRepositoryService.update as jest.Mock
    ).mockRejectedValueOnce(
      new ConflictException(
        `Could not update appeal summons ${summonsId} of case ${caseId}`,
      ),
    )

    await expect(sendToCourtOfAppeals(confirmed)).rejects.toThrow(
      ConflictException,
    )

    expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })

  it('rejects a prosecutor, who cannot send', async () => {
    const prosecutor = {
      ...user,
      role: UserRole.PROSECUTOR,
    } as User

    await expect(sendToCourtOfAppeals(confirmed, prosecutor)).rejects.toThrow(
      ForbiddenException,
    )

    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })
})
