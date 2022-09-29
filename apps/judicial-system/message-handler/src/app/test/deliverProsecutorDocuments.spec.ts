import { uuid } from 'uuidv4'
import fetch from 'node-fetch'

import { appModuleConfig } from '../app.config'
import { ProsecutorDocumentsDeliveryService } from '../prosecutorDocumentsDelivery.service'

jest.mock('@island.is/logging')
jest.mock('node-fetch')

describe('ProsecutorDocumentsDeliveryService - Deliver prosecutor documents', () => {
  const config = appModuleConfig()
  const caseId = uuid()

  beforeEach(async () => {
    const mockFetch = (fetch as unknown) as jest.Mock
    mockFetch.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
      }),
    )

    const prosecutorDocumentsDeliveryService = new ProsecutorDocumentsDeliveryService(
      config,
    )
    await prosecutorDocumentsDeliveryService.deliverProsecutorDocuments(caseId)
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
  })
})
