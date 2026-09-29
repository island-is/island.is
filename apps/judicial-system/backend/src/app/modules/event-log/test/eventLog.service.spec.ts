import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import * as MessageModule from '@island.is/judicial-system/message'
import { MessageType } from '@island.is/judicial-system/message'
import {
  EventNotificationType,
  EventType,
} from '@island.is/judicial-system/types'

import { EventLogRepositoryService } from '../../repository'
import { CreateEventLogDto } from '../dto/createEventLog.dto'
import { EventLogService } from '../eventLog.service'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../repository/services/eventLogRepository.service')

describe('EventLogService - create', () => {
  const caseId = uuid()
  const userName = uuid()
  const institutionName = uuid()
  const transaction = {} as Transaction

  const event = {
    eventType: EventType.COURT_DATE_SCHEDULED,
    caseId,
    userName,
    institutionName,
  } as CreateEventLogDto
  const message = {
    type: MessageType.EVENT_NOTIFICATION_DISPATCH,
    caseId,
    body: {
      type: EventNotificationType.COURT_DATE_SCHEDULED,
      userDescriptor: {
        name: userName,
        institution: { name: institutionName },
      },
    },
  }

  let mockEventLogRepositoryService: EventLogRepositoryService
  let mockAddMessagesToQueueAfterCommit: jest.Mock
  let eventLogService: EventLogService

  beforeEach(async () => {
    jest.resetAllMocks()

    const eventLogModule = await Test.createTestingModule({
      providers: [
        EventLogRepositoryService,
        { provide: LOGGER_PROVIDER, useValue: { error: jest.fn() } },
        EventLogService,
      ],
    }).compile()

    mockEventLogRepositoryService = eventLogModule.get(
      EventLogRepositoryService,
    )
    eventLogService = eventLogModule.get(EventLogService)
    mockAddMessagesToQueueAfterCommit = (
      jest.requireMock(
        '@island.is/judicial-system/message',
      ) as typeof MessageModule
    ).addMessagesToQueueAfterCommit as jest.Mock
  })

  it('queues the event notification against the transaction', async () => {
    const result = await eventLogService.create(event, transaction)

    expect(mockEventLogRepositoryService.create).toHaveBeenCalledWith(event, {
      transaction,
    })
    // Queued against the transaction, so a rollback sends nothing
    expect(mockAddMessagesToQueueAfterCommit).toHaveBeenCalledWith(
      transaction,
      message,
    )
    expect(result).toBe(true)
  })

  it('queues the event notification right away when there is no transaction', async () => {
    await eventLogService.create(event)

    expect(mockEventLogRepositoryService.create).toHaveBeenCalledWith(event, {
      transaction: undefined,
    })
    expect(mockAddMessagesToQueueAfterCommit).toHaveBeenCalledWith(
      undefined,
      message,
    )
  })

  it('still queues the notification when the event log row cannot be written', async () => {
    const mockCreate = mockEventLogRepositoryService.create as jest.Mock
    mockCreate.mockRejectedValueOnce(new Error('Some error'))

    const result = await eventLogService.create(event, transaction)

    expect(mockAddMessagesToQueueAfterCommit).toHaveBeenCalledWith(
      transaction,
      message,
    )
    expect(result).toBe(false)
  })

  it('queues nothing for an event type without a notification', async () => {
    await eventLogService.create(
      { ...event, eventType: EventType.LOGIN } as CreateEventLogDto,
      transaction,
    )

    expect(mockEventLogRepositoryService.create).toHaveBeenCalled()
    expect(mockAddMessagesToQueueAfterCommit).not.toHaveBeenCalled()
  })
})
