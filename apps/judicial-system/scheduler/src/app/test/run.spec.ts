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

    mockNow.mockReturnValue(new Date('2020-01-01T00:01:00.000Z'))

    givenWhenThen = async (): Promise<Then> => {
      const { logger, messageService, appService } =
        await createTestingAppModule()

      mockLogger = logger
      mockMessageService = messageService

      const mockSendMessagesToQueue =
        mockMessageService.sendMessagesToQueue as jest.Mock
      mockSendMessagesToQueue.mockRejectedValue(new Error('Some error'))

      const then = {} as Then

      await appService.run().catch((error) => (then.error = error))

      return then
    }
  })

  describe('run', () => {
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

    it('should continue until done', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: 'NOTIFICATION_DISPATCH',
          body: { type: 'INDICTMENTS_WAITING_FOR_CONFIRMATION' },
        },
      ])
      expect(fetch).toHaveBeenCalledTimes(4)
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
          body: JSON.stringify({ date: new Date('2020-01-01T00:01:00.000Z') }),
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
    })
  })

  describe('continue until time is up', () => {
    beforeEach(async () => {
      mockNow
        .mockReturnValueOnce(new Date('2020-01-01T00:00:00.000Z'))
        .mockReturnValueOnce(new Date('2020-01-01T00:00:00.000Z'))
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ caseArchived: true }),
      })

      await givenWhenThen()
    })

    it('should attempt archiving twice', () => {
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
    })
  })

  describe('remote call not ok', () => {
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

  describe('remote call fails', () => {
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
})
