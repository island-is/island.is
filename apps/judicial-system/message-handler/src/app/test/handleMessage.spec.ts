import { uuid } from 'uuidv4'
import fetch from 'node-fetch'

import type { Logger } from '@island.is/logging'
import { NotificationType } from '@island.is/judicial-system/types'
import {
  Message,
  CaseFileMessage,
  MessageService,
  MessageType,
  PoliceCaseMessage,
} from '@island.is/judicial-system/message'

import { appModuleConfig } from '../app.config'
import { MessageHandlerService } from '../messageHandler.service'
import { RulingNotificationService } from '../rulingNotification.service'
import { InternalDeliveryService } from '../internalDelivery.service'
import { CaseDeliveryService } from '../caseDelivery.service'

jest.mock('@island.is/logging')
jest.mock('node-fetch')

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = (message: Message) => Promise<Then>

describe('MessageHandlerService - Handle message', () => {
  const config = appModuleConfig()
  const logger = ({ debug: jest.fn() } as unknown) as Logger
  const caseId = uuid()
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    givenWhenThen = async (message: Message) => {
      const messageHandlerService = new MessageHandlerService(
        (undefined as unknown) as MessageService,
        (undefined as unknown) as CaseDeliveryService,
        new InternalDeliveryService(config, logger),
        new RulingNotificationService(config, logger),
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

  describe('deliver case file to court', () => {
    const caseFileId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFetch = (fetch as unknown) as jest.Mock
      mockFetch.mockResolvedValueOnce(
        Promise.resolve({
          ok: true,
          json: jest.fn().mockResolvedValueOnce({ delivered: true }),
        }),
      )

      then = await givenWhenThen({
        type: MessageType.DELIVER_CASE_FILE_TO_COURT,
        caseId,
        caseFileId,
      } as CaseFileMessage)
    })

    it('should deliver case file to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/file/${caseFileId}/deliverToCourt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver case files record to court', () => {
    const policeCaseNumber = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFetch = (fetch as unknown) as jest.Mock
      mockFetch.mockResolvedValueOnce(
        Promise.resolve({
          ok: true,
          json: jest.fn().mockResolvedValueOnce({ delivered: true }),
        }),
      )

      then = await givenWhenThen({
        type: MessageType.DELIVER_CASE_FILES_RECORD_TO_COURT,
        caseId,
        policeCaseNumber,
      } as PoliceCaseMessage)
    })

    it('should deliver case files record to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverCaseFilesRecordToCourt/${policeCaseNumber}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver request to court', () => {
    let then: Then

    beforeEach(async () => {
      const mockFetch = (fetch as unknown) as jest.Mock
      mockFetch.mockResolvedValueOnce(
        Promise.resolve({
          ok: true,
          json: jest.fn().mockResolvedValueOnce({ delivered: true }),
        }),
      )

      then = await givenWhenThen({
        type: MessageType.DELIVER_REQUEST_TO_COURT,
        caseId,
      })
    })

    it('should deliver request to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverRequestToCourt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver court record to court', () => {
    let then: Then

    beforeEach(async () => {
      const mockFetch = (fetch as unknown) as jest.Mock
      mockFetch.mockResolvedValueOnce(
        Promise.resolve({
          ok: true,
          json: jest.fn().mockResolvedValueOnce({ delivered: true }),
        }),
      )

      then = await givenWhenThen({
        type: MessageType.DELIVER_COURT_RECORD_TO_COURT,
        caseId,
      })
    })

    it('should deliver court record to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverCourtRecordToCourt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver signed ruling to court', () => {
    let then: Then

    beforeEach(async () => {
      const mockFetch = (fetch as unknown) as jest.Mock
      mockFetch.mockResolvedValueOnce(
        Promise.resolve({
          ok: true,
          json: jest.fn().mockResolvedValueOnce({ delivered: true }),
        }),
      )

      then = await givenWhenThen({
        type: MessageType.DELIVER_SIGNED_RULING_TO_COURT,
        caseId,
      })
    })

    it('should deliver signed ruling to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverSignedRulingToCourt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send ruling notification', () => {
    let then: Then

    beforeEach(async () => {
      const mockFetch = (fetch as unknown) as jest.Mock
      mockFetch.mockResolvedValueOnce(
        Promise.resolve({
          ok: true,
          json: jest.fn().mockResolvedValueOnce({ notificationSent: true }),
        }),
      )

      then = await givenWhenThen({
        type: MessageType.SEND_RULING_NOTIFICATION,
        caseId,
      })
    })

    it('should send a ruling notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ type: NotificationType.RULING }),
        },
      )
      expect(then.result).toBe(true)
    })
  })
})
