import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { BadRequestException, ForbiddenException } from '@nestjs/common'

import { MessageType } from '@island.is/judicial-system/message'
import {
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

describe('AppealSummonsController - Send to service', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const summonsId = uuid()
  const defendantId = uuid()
  const civilClaimantId = uuid()
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
    defendants: [{ id: defendantId, nationalId: '0000000000' }],
    civilClaimants: [{ id: civilClaimantId, nationalId: '0000000001' }],
    verdictAppealCase: { id: appealCaseId } as AppealCase,
  } as Case

  const confirmed = {
    id: summonsId,
    caseId,
    confirmedDate: new Date('2026-06-05T09:15:00.000Z'),
    defendants: [{ defendantId }],
    services: [],
  } as AppealSummons

  let mockAppealSummonsRepositoryService: AppealSummonsRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockSequelize: Sequelize
  let transaction: Transaction
  let appealSummonsController: AppealSummonsController

  const sendToService = (
    summons: AppealSummons,
    recipients: { defendantId?: string; civilClaimantId?: string }[],
    actingUser: User = user,
  ) =>
    runInRequestContext(async () => {
      await getOrCreateTransaction(mockSequelize)

      return appealSummonsController.sendToService(
        caseId,
        summonsId,
        theCase,
        summons,
        { recipients },
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

  it('creates service rows, logs the event and queues CreateDocument deliveries', async () => {
    const defendantService = { id: uuid(), defendantId }
    const civilClaimantService = { id: uuid(), civilClaimantId }
    const afterSend = {
      ...confirmed,
      services: [defendantService, civilClaimantService],
    } as AppealSummons

    ;(mockAppealSummonsRepositoryService.createServiceRecipient as jest.Mock)
      .mockResolvedValueOnce(defendantService)
      .mockResolvedValueOnce(civilClaimantService)
    ;(
      mockAppealSummonsRepositoryService.findByIdAndCaseId as jest.Mock
    ).mockResolvedValueOnce(afterSend)

    const result = await sendToService(confirmed, [
      { defendantId },
      { civilClaimantId },
    ])

    expect(
      mockAppealSummonsRepositoryService.createServiceRecipient,
    ).toHaveBeenCalledTimes(2)
    expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: AppealEventType.APPEAL_SUMMONS_SENT_TO_SERVICE,
      }),
      { transaction },
    )
    expect(queueMessagesAfterCommit).toHaveBeenCalledTimes(2)
    expect(queueMessagesAfterCommit).toHaveBeenCalledWith({
      type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_APPEAL_SUMMONS,
      user,
      caseId,
      elementId: [summonsId, defendantService.id],
    })
    expect(result).toBe(afterSend)
  })

  it('skips recipients that were already sent', async () => {
    const summons = {
      ...confirmed,
      services: [{ id: uuid(), defendantId }],
    } as AppealSummons
    const civilClaimantService = { id: uuid(), civilClaimantId }
    const afterSend = {
      ...summons,
      services: [...(summons.services ?? []), civilClaimantService],
    } as AppealSummons

    ;(
      mockAppealSummonsRepositoryService.createServiceRecipient as jest.Mock
    ).mockResolvedValueOnce(civilClaimantService)
    ;(
      mockAppealSummonsRepositoryService.findByIdAndCaseId as jest.Mock
    ).mockResolvedValueOnce(afterSend)

    await sendToService(summons, [{ defendantId }, { civilClaimantId }])

    expect(
      mockAppealSummonsRepositoryService.createServiceRecipient,
    ).toHaveBeenCalledTimes(1)
    expect(
      mockAppealSummonsRepositoryService.createServiceRecipient,
    ).toHaveBeenCalledWith(expect.objectContaining({ civilClaimantId }), {
      transaction,
    })
  })

  it('rejects when no new recipients remain', async () => {
    const summons = {
      ...confirmed,
      services: [{ id: uuid(), defendantId }],
    } as AppealSummons

    await expect(sendToService(summons, [{ defendantId }])).rejects.toThrow(
      BadRequestException,
    )
  })

  it('rejects a draft summons', async () => {
    await expect(
      sendToService({ id: summonsId, caseId } as AppealSummons, [
        { defendantId },
      ]),
    ).rejects.toThrow(ForbiddenException)
  })

  it('rejects a defendant without a national id before creating a service row', async () => {
    const caseWithoutNationalId = {
      ...theCase,
      defendants: [{ id: defendantId, noNationalId: true }],
    } as Case

    await expect(
      runInRequestContext(async () => {
        await getOrCreateTransaction(mockSequelize)

        return appealSummonsController.sendToService(
          caseId,
          summonsId,
          caseWithoutNationalId,
          confirmed,
          { recipients: [{ defendantId }] },
          user,
        )
      }),
    ).rejects.toThrow(BadRequestException)

    expect(
      mockAppealSummonsRepositoryService.createServiceRecipient,
    ).not.toHaveBeenCalled()
    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })
})
