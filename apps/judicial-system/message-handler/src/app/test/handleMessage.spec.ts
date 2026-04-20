import fetch from 'node-fetch'
import { v4 as uuid } from 'uuid'

import type { Logger } from '@island.is/logging'

import {
  Message,
  messageEndpoint,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import { User } from '@island.is/judicial-system/types'

import { appModuleConfig } from '../app.config'
import { InternalDeliveryService } from '../internalDelivery.service'
import { MessageHandlerService } from '../messageHandler.service'

jest.mock('@island.is/logging')
jest.mock('node-fetch')

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = (message: Message) => Promise<Then>

describe('MessageHandlerService - Handle message', () => {
  const type = MessageType.NOTIFICATION // just a random type
  const config = appModuleConfig()
  const logger = { debug: jest.fn() } as unknown as Logger
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const mockFetch = fetch as unknown as jest.Mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ delivered: true }),
    })

    givenWhenThen = async (message: Message) => {
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

    beforeEach(async () => {
      then = await givenWhenThen({
        type,
      })
    })

    it('should handle message', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/${messageEndpoint[type]}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({}),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('handle message with case id', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type,
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
          body: JSON.stringify({}),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('handle message with element id', () => {
    const caseId = uuid()
    const elementId = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type,
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
          body: JSON.stringify({}),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('handle message extra info', () => {
    const user = { id: uuid() } as User
    const caseId = uuid()
    const elementId = uuid()
    const body = { something: uuid() }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type,
        user,
        caseId,
        elementId,
        body,
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
          body: JSON.stringify({ ...body, user }),
        },
      )
      expect(then.result).toBe(true)
    })
  })
})
