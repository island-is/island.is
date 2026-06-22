import fetch from 'node-fetch'

import type { Logger } from '@island.is/logging'

import { Message, MessageType } from '@island.is/judicial-system/message'
import { MessageSuspensionCategory } from '@island.is/judicial-system/types'

import { appModuleConfig } from '../app.config'
import { SuspensionSettingsService } from '../suspensionSettings.service'

jest.mock('node-fetch')

describe('SuspensionSettingsService', () => {
  const config = appModuleConfig()
  const logger = { error: jest.fn() } as unknown as Logger
  let mockFetch: jest.Mock
  let service: SuspensionSettingsService

  const givenSettings = async (
    settings:
      | {
          category: MessageSuspensionCategory
          suspended: boolean
          delaySeconds: number
        }[]
      | undefined,
  ) => {
    if (settings) {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(settings),
        text: jest.fn(),
      })
    } else {
      mockFetch.mockRejectedValueOnce(new Error('Some error'))
    }

    service = new SuspensionSettingsService(config, logger)

    await service.onModuleInit()

    service.onModuleDestroy()
  }

  beforeEach(() => {
    mockFetch = fetch as unknown as jest.Mock
    mockFetch.mockReset()
  })

  it('should poll the backend with the access token', async () => {
    await givenSettings([])

    expect(mockFetch).toHaveBeenCalledWith(
      `${config.backendUrl}/api/internal/message-suspension`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${config.backendAccessToken}`,
        },
      },
    )
  })

  it('should suspend a message whose category is suspended', async () => {
    await givenSettings([
      {
        category: MessageSuspensionCategory.COURT,
        suspended: true,
        delaySeconds: 300,
      },
    ])

    expect(
      service.shouldSuspend({
        type: MessageType.DELIVERY_TO_COURT_PROSECUTOR,
      } as Message),
    ).toEqual({ suspend: true, delaySeconds: 300 })
  })

  it('should not suspend a message whose category is not suspended', async () => {
    await givenSettings([
      {
        category: MessageSuspensionCategory.COURT,
        suspended: false,
        delaySeconds: 600,
      },
    ])

    expect(
      service.shouldSuspend({
        type: MessageType.DELIVERY_TO_COURT_PROSECUTOR,
      } as Message),
    ).toEqual({ suspend: false, delaySeconds: 0 })
  })

  it('should not suspend a message from a category with no settings', async () => {
    await givenSettings([
      {
        category: MessageSuspensionCategory.COURT,
        suspended: true,
        delaySeconds: 300,
      },
    ])

    expect(
      service.shouldSuspend({
        type: MessageType.DELIVERY_TO_POLICE_CASE,
      } as Message),
    ).toEqual({ suspend: false, delaySeconds: 0 })
  })

  it('should not suspend a message type that cannot be suspended', async () => {
    await givenSettings([
      {
        category: MessageSuspensionCategory.COURT,
        suspended: true,
        delaySeconds: 300,
      },
    ])

    expect(
      service.shouldSuspend({ type: MessageType.NOTIFICATION } as Message),
    ).toEqual({ suspend: false, delaySeconds: 0 })
  })

  it('should fail open and log when the backend cannot be reached', async () => {
    await givenSettings(undefined)

    expect(logger.error).toHaveBeenCalled()
    expect(
      service.shouldSuspend({
        type: MessageType.DELIVERY_TO_COURT_PROSECUTOR,
      } as Message),
    ).toEqual({ suspend: false, delaySeconds: 0 })
  })
})
