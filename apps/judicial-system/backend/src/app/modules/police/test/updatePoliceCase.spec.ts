import { Agent } from 'https'
import fetch from 'node-fetch'
import { v4 as uuid } from 'uuid'

import { PayloadTooLargeException } from '@nestjs/common'

import { ConfigType } from '@island.is/nest/config'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

import { CaseState, CaseType, User } from '@island.is/judicial-system/types'

import { createTestingPoliceModule } from './createTestingPoliceModule'

import { randomDate } from '../../../test'
import { policeModuleConfig } from '../police.config'
import { PoliceDocumentType } from '../police.service'

jest.mock('node-fetch')

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('PoliceController - Update Police Case', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const caseType = CaseType.CUSTODY
  const caseState = CaseState.ACCEPTED
  const policeCaseNumber = uuid()
  const courtCaseNumber = uuid()
  const defendantNationalId = uuid()
  const validToDate = randomDate()
  const caseConclusion = 'test conclusion'
  const courtDocuments = [
    { type: PoliceDocumentType.RVKR, courtDocument: 'test request pdf' },
    { type: PoliceDocumentType.RVTB, courtDocument: 'test court record pdf' },
  ]

  let mockConfig: ConfigType<typeof policeModuleConfig>
  let xRoadPath: string
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const mockFetch = fetch as unknown as jest.Mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ ok: true }),
    })

    const { config, policeService } = await createTestingPoliceModule()

    mockConfig = config
    xRoadPath = createXRoadAPIPath(
      config.tlsBasePathWithEnv,
      XRoadMemberClass.GovernmentInstitution,
      config.policeMemberCode,
      config.policeApiPath,
    )

    givenWhenThen = async (): Promise<Then> => {
      const then = {} as Then

      await policeService
        .updatePoliceCase(
          user,
          caseId,
          caseType,
          caseState,
          policeCaseNumber,
          courtCaseNumber,
          defendantNationalId,
          validToDate,
          caseConclusion,
          courtDocuments,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('update police case with defendant national id', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should update the police case using the v2 endpoint', async () => {
      expect(fetch).toHaveBeenCalledWith(
        `${xRoadPath}/V2/UpdateRVCase/${caseId}`,
        {
          method: 'PUT',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            'X-Road-Client': mockConfig.clientId,
            'X-API-KEY': mockConfig.policeApiKey,
          },
          agent: expect.any(Agent),
          body: JSON.stringify({
            rvMal_ID: caseId,
            caseNumber: policeCaseNumber,
            courtCaseNumber,
            ssn: defendantNationalId,
            type: caseType,
            courtVerdict: caseState,
            expiringDate: validToDate,
            courtVerdictString: caseConclusion,
            courtDocuments,
          }),
        },
      )
      expect(then.result).toBe(true)
    })
  })

  describe('update police case without defendant national id', () => {
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as unknown as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ ok: true }),
      })

      const { policeService } = await createTestingPoliceModule()

      then = await policeService
        .updatePoliceCase(
          user,
          caseId,
          caseType,
          caseState,
          policeCaseNumber,
          courtCaseNumber,
          '',
          validToDate,
          caseConclusion,
          courtDocuments,
        )
        .then((result) => ({ result } as Then))
        .catch((error) => ({ error } as Then))
    })

    it('should update the police case using the v4 endpoint without ssn', async () => {
      expect(fetch).toHaveBeenCalledWith(`${xRoadPath}/V4/case/${caseId}`, {
        method: 'PUT',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          'X-Road-Client': mockConfig.clientId,
          'X-API-KEY': mockConfig.policeApiKey,
        },
        agent: expect.any(Agent),
        body: JSON.stringify({
          rvMal_ID: caseId,
          caseNumber: policeCaseNumber,
          courtCaseNumber,
          type: caseType,
          courtVerdict: caseState,
          expiringDate: validToDate,
          courtVerdictString: caseConclusion,
          courtDocuments,
        }),
      })
      expect(then.result).toBe(true)
    })
  })

  describe('update police case fails with an empty response body', () => {
    let mockLogger: { error: jest.Mock }
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as unknown as jest.Mock
      mockFetch.mockReset()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: jest.fn().mockResolvedValueOnce(''),
      })

      const { policeService, logger } = await createTestingPoliceModule()
      mockLogger = logger

      then = await policeService
        .updatePoliceCase(
          user,
          caseId,
          caseType,
          caseState,
          policeCaseNumber,
          courtCaseNumber,
          defendantNationalId,
          validToDate,
          caseConclusion,
          courtDocuments,
        )
        .then((result) => ({ result } as Then))
        .catch((error) => ({ error } as Then))
    })

    it('should log the HTTP status and a non-empty error summary', () => {
      expect(then.result).toBe(false)
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Failed to update police case ${caseId}`,
        expect.objectContaining({
          caseId,
          statusCode: '500',
          errorSummary: expect.stringContaining('500'),
        }),
      )
    })
  })

  describe('update police case fails because a file is too large', () => {
    const prosecutor = {
      name: 'Prosecutor One',
      email: 'prosecutor@omnitrix.is',
    }
    const caseIdForNotification = uuid()
    let mockEmailService: { sendEmail: jest.Mock }
    let mockEventService: { postErrorEvent: jest.Mock }
    let mockFindByIdWithProsecutor: jest.Mock
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as unknown as jest.Mock
      mockFetch.mockReset()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 413,
        text: jest.fn().mockResolvedValueOnce('Payload Too Large'),
      })

      const {
        policeService,
        emailService,
        eventService,
        caseRepositoryService,
      } = await createTestingPoliceModule()
      mockEmailService = emailService as unknown as { sendEmail: jest.Mock }
      mockEventService = eventService as unknown as {
        postErrorEvent: jest.Mock
      }

      mockFindByIdWithProsecutor =
        caseRepositoryService.findByIdWithProsecutor as jest.Mock
      mockFindByIdWithProsecutor.mockResolvedValueOnce({
        prosecutor,
        policeCaseNumbers: [policeCaseNumber],
      })

      then = await policeService
        .updatePoliceCase(
          user,
          caseId,
          caseType,
          caseState,
          policeCaseNumber,
          courtCaseNumber,
          defendantNationalId,
          validToDate,
          caseConclusion,
          [
            {
              type: PoliceDocumentType.RVVS,
              courtDocument: 'large file',
            },
          ],
          caseIdForNotification,
        )
        .then((result) => ({ result } as Then))
        .catch((error) => ({ error } as Then))
    })

    it('should notify the prosecutor', () => {
      expect(mockFindByIdWithProsecutor).toHaveBeenCalledWith(
        caseIdForNotification,
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Ekki tókst að hlaða upp skjali í LÖKE í máli ${policeCaseNumber}`,
          text: 'Ekki tókst að hlaða upp skjali í LÖKE vegna stærðartakmarkana. Vinsamlegast hlaðið skjali upp handvirkt í LÖKE.',
        }),
      )
    })

    it('should throw a payload too large exception', () => {
      expect(then.result).toBeUndefined()
      expect(then.error).toBeInstanceOf(PayloadTooLargeException)
    })

    it('should not post a Slack error for an expected size limit', () => {
      expect(mockEventService.postErrorEvent).not.toHaveBeenCalled()
    })
  })

  describe('update police case fails because a file is too large and prosecutor notification fails', () => {
    const caseIdForNotification = uuid()
    let mockEventService: { postErrorEvent: jest.Mock }
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as unknown as jest.Mock
      mockFetch.mockReset()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 413,
        text: jest.fn().mockResolvedValueOnce('Payload Too Large'),
      })

      const {
        policeService,
        emailService,
        eventService,
        caseRepositoryService,
      } = await createTestingPoliceModule()
      mockEventService = eventService as unknown as {
        postErrorEvent: jest.Mock
      }

      const mockSendEmail = emailService.sendEmail as jest.Mock
      mockSendEmail.mockRejectedValueOnce(new Error('SMTP unavailable'))

      const mockFindByIdWithProsecutor =
        caseRepositoryService.findByIdWithProsecutor as jest.Mock
      mockFindByIdWithProsecutor.mockResolvedValueOnce({
        prosecutor: {
          name: 'Prosecutor One',
          email: 'prosecutor@omnitrix.is',
        },
        policeCaseNumbers: [policeCaseNumber],
      })

      then = await policeService
        .updatePoliceCase(
          user,
          caseId,
          caseType,
          caseState,
          policeCaseNumber,
          courtCaseNumber,
          defendantNationalId,
          validToDate,
          caseConclusion,
          [
            {
              type: PoliceDocumentType.RVVS,
              courtDocument: 'large file',
            },
          ],
          caseIdForNotification,
        )
        .then((result) => ({ result } as Then))
        .catch((error) => ({ error } as Then))
    })

    it('should not treat the size limit as terminal without a successful notification', () => {
      expect(then.error).toBeUndefined()
      expect(then.result).toBe(false)
      expect(mockEventService.postErrorEvent).toHaveBeenCalled()
    })
  })

  describe('update police case fails with a response body', () => {
    const responseBody = '{"type":"Server.ClientProxy.IOError"}'
    let mockLogger: { error: jest.Mock }
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as unknown as jest.Mock
      mockFetch.mockReset()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: jest.fn().mockResolvedValueOnce(responseBody),
      })

      const { policeService, logger } = await createTestingPoliceModule()
      mockLogger = logger

      then = await policeService
        .updatePoliceCase(
          user,
          caseId,
          caseType,
          caseState,
          policeCaseNumber,
          courtCaseNumber,
          defendantNationalId,
          validToDate,
          caseConclusion,
          courtDocuments,
        )
        .then((result) => ({ result } as Then))
        .catch((error) => ({ error } as Then))
    })

    it('should log the HTTP status and the response body', () => {
      expect(then.result).toBe(false)
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Failed to update police case ${caseId}`,
        expect.objectContaining({
          statusCode: '500',
          errorSummary: responseBody,
        }),
      )
    })
  })
})
