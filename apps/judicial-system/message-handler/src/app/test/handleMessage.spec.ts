import fetch from 'node-fetch'
import { uuid } from 'uuidv4'

import type { Logger } from '@island.is/logging'

import {
  CaseMessage,
  messageEndpoint,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import { NotificationType, User } from '@island.is/judicial-system/types'

import { appModuleConfig } from '../app.config'
import { InternalDeliveryService } from '../internalDelivery.service'
import { MessageHandlerService } from '../messageHandler.service'

jest.mock('@island.is/logging')
jest.mock('node-fetch')

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = (message: CaseMessage) => Promise<Then>

describe('MessageHandlerService - Handle message', () => {
  const config = appModuleConfig()
  const logger = { debug: jest.fn() } as unknown as Logger
  const user = { id: uuid() } as User
  const caseId = uuid()
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const mockFetch = fetch as unknown as jest.Mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ delivered: true }),
    })

    givenWhenThen = async (message: CaseMessage) => {
      const messageHandlerService = new MessageHandlerService(
        undefined as unknown as MessageService,
        new InternalDeliveryService(config, logger),
        config,
        logger,
      )
      const then = {} as Then

      try {
        then.result = await messageHandlerService.handleMessage(message)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('handle message', () => {
    let then: Then
    const type = MessageType.DELIVERY_TO_COURT_PROSECUTOR

    beforeEach(async () => {
      then = await givenWhenThen({
        type,
        user,
        caseId,
      })
    })

    it('should handle message', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/${messageEndpoint[type]}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ user }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('handle message with element id', () => {
    let then: Then
    const type = MessageType.DELIVERY_TO_COURT_DEFENDANT
    const elementId = uuid()

    beforeEach(async () => {
      then = await givenWhenThen({
        type,
        user,
        caseId,
        elementId,
      })
    })

    it('should handle message', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/${messageEndpoint[type]}/${elementId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ user }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('handle message with body', () => {
    let then: Then
    const messageType = MessageType.NOTIFICATION
    const notificationType = NotificationType.HEADS_UP

    beforeEach(async () => {
      then = await givenWhenThen({
        type: messageType,
        user,
        caseId,
        body: { type: notificationType },
      })
    })

    it('should handle message', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/${messageEndpoint[messageType]}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ type: notificationType, user }),
        },
      )
      expect(then.result).toBe(true)
    })
  })
})
