import { uuid } from 'uuidv4'
import fetch from 'node-fetch'

import type { Logger } from '@island.is/logging'

import { appModuleConfig } from '../app.config'
import { ProsecutorDocumentsDeliveryService } from '../prosecutorDocumentsDelivery.service'

jest.mock('@island.is/logging')
jest.mock('node-fetch')

describe('ProsecutorDocumentsDeliveryService - Deliver prosecutor documents', () => {
  const config = appModuleConfig()
  const caseId = uuid()
  let result: boolean

  beforeEach(async () => {
    const mockFetch = (fetch as unknown) as jest.Mock
    mockFetch.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
        json: jest
          .fn()
          .mockResolvedValueOnce({ requestDeliveredToCourt: true }),
      }),
    )

    const prosecutorDocumentsDeliveryService = new ProsecutorDocumentsDeliveryService(
      config,
      ({ debug: jest.fn() } as unknown) as Logger,
    )
    result = await prosecutorDocumentsDeliveryService.deliverProsecutorDocuments(
      caseId,
    )
  })

  it('should deliver prosecutor documents', () => {
    expect(fetch).toHaveBeenCalledWith(
      `${config.backendUrl}/api/internal/case/${caseId}/deliverProsecutorDocuments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${config.backendAccessToken}`,
        },
      },
    )
    expect(result).toBe(true)
  })
})
