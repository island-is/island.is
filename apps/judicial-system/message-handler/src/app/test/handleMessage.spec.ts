import fetch from 'node-fetch'
import { uuid } from 'uuidv4'

import type { Logger } from '@island.is/logging'

import {
  CaseFileMessage,
  CaseMessage,
  DefendantMessage,
  MessageService,
  MessageType,
  PoliceCaseMessage,
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

  describe('deliver prosecutor to court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_PROSECUTOR_TO_COURT,
        user,
        caseId,
      })
    })

    it('should deliver prosecutor to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverProsecutorToCourt`,
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

  describe('deliver defendant to court', () => {
    const defendantId = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_DEFENDANT_TO_COURT,
        user,
        caseId,
        defendantId,
      } as DefendantMessage)
    })

    it('should deliver defendant to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/defendant/${defendantId}/deliverToCourt`,
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

  describe('deliver case file to court', () => {
    const caseFileId = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_CASE_FILE_TO_COURT,
        user,
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
          body: JSON.stringify({ user }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver case files record to court', () => {
    const policeCaseNumber = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_CASE_FILES_RECORD_TO_COURT,
        user,
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
          body: JSON.stringify({ user }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver request to court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_REQUEST_TO_COURT,
        user,
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
          body: JSON.stringify({ user }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver court record to court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_COURT_RECORD_TO_COURT,
        user,
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
          body: JSON.stringify({ user }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver signed ruling to court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_SIGNED_RULING_TO_COURT,
        user,
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
          body: JSON.stringify({ user }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('deliver case conclusion to court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_CASE_CONCLUSION_TO_COURT,
        user,
        caseId,
      })
    })

    it('should deliver case conclusion to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverCaseConclusionToCourt`,
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

  describe('deliver case to police', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_CASE_TO_POLICE,
        user,
        caseId,
      })
    })

    it('should deliver case to police', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverCaseToPolice`,
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

  describe('deliver appeal to police', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.DELIVER_APPEAL_TO_POLICE,
        user,
        caseId,
      })
    })

    it('should deliver appeal to police', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/deliverAppealToPolice`,
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

  describe('archive case file', () => {
    const caseFileId = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.ARCHIVE_CASE_FILE,
        user,
        caseId,
        caseFileId,
      } as CaseFileMessage)
    })

    it('should archive case file', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/file/${caseFileId}/archive`,
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

  describe('archive case files record to court', () => {
    const policeCaseNumber = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.ARCHIVE_CASE_FILES_RECORD,
        user,
        caseId,
        policeCaseNumber,
      } as PoliceCaseMessage)
    })

    it('should archive case files record to court', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/archiveCaseFilesRecord/${policeCaseNumber}`,
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

  describe('send heads up notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_HEADS_UP_NOTIFICATION,
        user,
        caseId,
      })
    })

    it('should send a heads up notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ type: NotificationType.HEADS_UP, user }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send ready for court notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_READY_FOR_COURT_NOTIFICATION,
        user,
        caseId,
      })
    })

    it('should send a ready for court notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.READY_FOR_COURT,
            user,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send received by court notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_RECEIVED_BY_COURT_NOTIFICATION,
        user,
        caseId,
      })
    })

    it('should send a received by court notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.RECEIVED_BY_COURT,
            user,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send received by court notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_COURT_DATE_NOTIFICATION,
        user,
        caseId,
      })
    })

    it('should send a received by court notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.COURT_DATE,
            user,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send defendants not updated at court notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_DEFENDANTS_NOT_UPDATED_AT_COURT_NOTIFICATION,
        user,
        caseId,
      })
    })

    it('should send a defendants not updated at court notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
            user,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send ruling notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_RULING_NOTIFICATION,
        user,
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
          body: JSON.stringify({ type: NotificationType.RULING, user }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send modified notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_MODIFIED_NOTIFICATION,
        user,
        caseId,
      })
    })

    it('should send a modified notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.MODIFIED,
            user,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send revoked notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_REVOKED_NOTIFICATION,
        user,
        caseId,
      })
    })

    it('should send a revoked notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({ type: NotificationType.REVOKED, user }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send defender assigned notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_DEFENDER_ASSIGNED_NOTIFICATION,
        user,
        caseId,
      })
    })

    it('should send a defender assigned notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.DEFENDER_ASSIGNED,
            user,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send appeal to court of appeals notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_APPEAL_TO_COURT_OF_APPEALS_NOTIFICATION,
        user,
        caseId,
      })
    })

    it('should send appeal to court of appeals notifications', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.APPEAL_TO_COURT_OF_APPEALS,
            user,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send appeal received by court notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_APPEAL_RECEIVED_BY_COURT_NOTIFICATION,
        user,
        caseId,
      })
    })

    it('should send appeal received by court notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.APPEAL_RECEIVED_BY_COURT,
            user,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send appeal statement notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_APPEAL_STATEMENT_NOTIFICATION,
        user,
        caseId,
      })
    })

    it('should send appeal statement notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.APPEAL_STATEMENT,
            user,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send appeal completed notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_APPEAL_COMPLETED_NOTIFICATION,
        user,
        caseId,
      })
    })

    it('should send appeal completed notification', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.APPEAL_COMPLETED,
            user,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('send judges assigned notification in appeal cases', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: MessageType.SEND_APPEAL_JUDGES_ASSIGNED_NOTIFICATION,
        user,
        caseId,
      })
    })

    it('should send judges assigned notification in appeal cases', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backendUrl}/api/internal/case/${caseId}/notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backendAccessToken}`,
          },
          body: JSON.stringify({
            type: NotificationType.APPEAL_JUDGES_ASSIGNED,
            user,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })
})
