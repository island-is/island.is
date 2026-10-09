import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealEventType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealSummonsModule } from './createTestingAppealSummonsModule'

import { queueMessagesAfterCommit } from '../../../middleware'
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
  let transaction: Transaction
  let appealSummonsController: AppealSummonsController

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

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => Promise<unknown>) => fn(transaction),
    )

    ;(queueMessagesAfterCommit as jest.Mock).mockClear()
  })

  it('sets the send date, logs the event and queues the CoA email', async () => {
    const sentToCourtOfAppealsDate = expect.any(Date)
    const afterSend = {
      ...confirmed,
      sentToCourtOfAppealsDate: new Date(),
    } as AppealSummons

    ;(mockAppealSummonsRepositoryService.update as jest.Mock).mockResolvedValueOnce(
      afterSend,
    )
    ;(
      mockAppealSummonsRepositoryService.findByIdAndCaseId as jest.Mock
    ).mockResolvedValueOnce(afterSend)
    ;(
      mockAppealEventLogRepositoryService.create as jest.Mock
    ).mockResolvedValueOnce({})

    const result = await appealSummonsController.sendToCourtOfAppeals(
      caseId,
      summonsId,
      theCase,
      confirmed,
      user,
    )

    expect(mockAppealSummonsRepositoryService.update).toHaveBeenCalledWith(
      summonsId,
      caseId,
      { sentToCourtOfAppealsDate },
      { transaction },
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
      appealSummonsController.sendToCourtOfAppeals(
        caseId,
        summonsId,
        theCase,
        { ...confirmed, confirmedDate: null } as AppealSummons,
        user,
      ),
    ).rejects.toThrow(ForbiddenException)

    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })

  it('rejects a summons that has already been sent', async () => {
    await expect(
      appealSummonsController.sendToCourtOfAppeals(
        caseId,
        summonsId,
        theCase,
        {
          ...confirmed,
          sentToCourtOfAppealsDate: new Date(),
        } as AppealSummons,
        user,
      ),
    ).rejects.toThrow(ForbiddenException)

    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })

  it('rejects a prosecutor, who cannot send', async () => {
    const prosecutor = {
      ...user,
      role: UserRole.PROSECUTOR,
    } as User

    await expect(
      appealSummonsController.sendToCourtOfAppeals(
        caseId,
        summonsId,
        theCase,
        confirmed,
        prosecutor,
      ),
    ).rejects.toThrow(ForbiddenException)

    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })
})
