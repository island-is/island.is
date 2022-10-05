import { uuid } from 'uuidv4'
import fetch from 'node-fetch'

import { appModuleConfig } from '../app.config'
import { CaseDeliveryService } from '../caseDelivery.service'

jest.mock('@island.is/logging')
jest.mock('node-fetch')

describe('CaseDeliveryService - Deliver case', () => {
  const config = appModuleConfig()
  const caseId = uuid()

  beforeEach(async () => {
    const mockFetch = (fetch as unknown) as jest.Mock
    mockFetch.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
      }),
    )

    const caseDeliveryService = new CaseDeliveryService(config)
    await caseDeliveryService.deliverCase(caseId)
  })

  it('should deliver a case', () => {
    expect(fetch).toHaveBeenCalledWith(
      `${config.backendUrl}/api/internal/case/${caseId}/deliver`,
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
