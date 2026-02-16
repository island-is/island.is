import fetch from 'node-fetch'

import { Logger } from '@island.is/logging'

import { MessageService } from '@island.is/judicial-system/message'

import { appModuleConfig } from '../app.config'
import { now } from '../date.factory'
import { createTestingAppModule } from './createTestingAppModule'

jest.mock('node-fetch')
jest.mock('@island.is/logging')
jest.mock('../date.factory')

interface Then {
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('AppService - Run', () => {
  const mockNow = now as jest.Mock
  const mockFetch = fetch as unknown as jest.Mock
  let mockLogger: Logger
  let mockMessageService: MessageService
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    mockNow.mockClear()
    mockFetch.mockClear()

    mockNow.mockReturnValue(new Date('2020-01-01T02:01:00.000Z'))

    givenWhenThen = async (): Promise<Then> => {
      const { logger, messageService, appService } =
        await createTestingAppModule()

      mockLogger = logger
      mockMessageService = messageService

      const mockSendMessagesToQueue =
        mockMessageService.addMessagesToQueue as jest.Mock
      mockSendMessagesToQueue.mockRejectedValue(new Error('Some error'))

      const then = {} as Then

      await appService.run().catch((error) => (then.error = error))

      return then
    }
  })

  // At 2:00 AM tests
  describe('Jobs at 2:00 AM: Run service', () => {
    beforeEach(async () => {
      mockFetch
        .mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ caseArchived: false }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ caseArchived: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ caseArchived: true }),
        })

      await givenWhenThen()
    })

    it('should archive cases until done and call post hearing arrangements', () => {
      // in given test setting we call:
      // fetch for archive cases 3x
      // fetch for resetting lawyer-registry 1x
      // fetch for post daily hearing 1x
      // fetch for delivering service certificates to police 1x
      expect(fetch).toHaveBeenCalledTimes(6)
      expect(fetch).toHaveBeenCalledWith(
        `${appModuleConfig().backendUrl}/api/internal/cases/archive`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${appModuleConfig().backendAccessToken}`,
          },
        },
      )
      expect(fetch).toHaveBeenCalledWith(
        `${
          appModuleConfig().backendUrl
        }/api/internal/cases/postHearingArrangements`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${appModuleConfig().backendAccessToken}`,
          },
          body: JSON.stringify({ date: new Date('2020-01-01T02:01:00.000Z') }),
        },
      )
      expect(fetch).toHaveBeenCalledWith(
        `${appModuleConfig().backendUrl}/api/lawyer-registry/reset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${appModuleConfig().backendAccessToken}`,
          },
        },
      )
      expect(fetch).toHaveBeenCalledWith(
        `${
          appModuleConfig().backendUrl
        }/api/internal/verdict/deliverVerdictServiceCertificates`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${appModuleConfig().backendAccessToken}`,
          },
        },
      )
    })
  })

  describe('Jobs at 2:00 AM: Continue archiving cases until time is up', () => {
    beforeEach(async () => {
      mockNow
        .mockReturnValueOnce(new Date('2020-01-01T02:00:00.000Z')) // time set when finding relevant job schedule type
        .mockReturnValueOnce(new Date('2020-01-01T02:00:00.000Z')) // time set when archive cases starts
        .mockReturnValueOnce(new Date('2020-01-01T02:00:00.000Z')) // time set after one iteration of archive cases
      // default date above defined earlier us used when return value once is not specified for future now() calls

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ caseArchived: true }),
      })

      await givenWhenThen()
    })

    it('should attempt archiving twice and post hearing assignment once', () => {
      expect(fetch).toHaveBeenNthCalledWith(
        1,
        `${appModuleConfig().backendUrl}/api/internal/cases/archive`,
        expect.any(Object),
      )
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        `${appModuleConfig().backendUrl}/api/internal/cases/archive`,
        expect.any(Object),
      )
      expect(fetch).toHaveBeenNthCalledWith(
        3,
        `${
          appModuleConfig().backendUrl
        }/api/internal/cases/postHearingArrangements`,
        expect.any(Object),
      )
    })
  })

  describe('Jobs at 2:00 AM: Remote call not ok', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve('Some error'),
      })

      await givenWhenThen()
    })

    it('should log error', () => {
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to archive cases', {
        response: 'Some error',
      })
    })
  })

  describe('Jobs at 2:00 AM: Remote call fails', () => {
    const error = new Error('Some error')

    beforeEach(async () => {
      mockFetch.mockRejectedValueOnce(error)

      await givenWhenThen()
    })

    it('should log error', () => {
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to archive cases', {
        reason: error,
      })
    })
  })

  // At 9:00 AM tests
  describe('Jobs at 9:00 AM: Run service', () => {
    beforeEach(async () => {
      // change the default value to 9:00
      mockNow.mockReturnValue(new Date('2020-01-01T09:01:00.000Z'))

      await givenWhenThen()
    })

    it('should send waiting for confirmation notification to the message queue', () => {
      expect(mockMessageService.addMessagesToQueue).toHaveBeenCalledWith([
        {
          type: 'NOTIFICATION_DISPATCH',
          body: { type: 'INDICTMENTS_WAITING_FOR_CONFIRMATION' },
        },
      ])
    })
  })
})
