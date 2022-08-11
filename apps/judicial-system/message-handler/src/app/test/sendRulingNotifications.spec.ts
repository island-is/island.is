import { uuid } from 'uuidv4'
import fetch from 'node-fetch'

import { NotificationType } from '@island.is/judicial-system/types'

import { appModuleConfig } from '../app.config'
import { RulingNotificationService } from '../rulingNotification.service'

jest.mock('@island.is/logging')
jest.mock('node-fetch')

describe('RulingNotificationService - send ruling notification', () => {
  const config = appModuleConfig()
  const caseId = uuid()

  beforeEach(async () => {
    const mockFetch = (fetch as unknown) as jest.Mock
    mockFetch.mockResolvedValueOnce(Promise.resolve({ ok: true }))

    const rulingNotificationService = new RulingNotificationService(config)
    await rulingNotificationService.sendRulingNotification(caseId)
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
  })
})
