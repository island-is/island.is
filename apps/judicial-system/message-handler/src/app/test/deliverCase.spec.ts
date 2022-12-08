import { uuid } from 'uuidv4'
import fetch from 'node-fetch'

import type { Logger } from '@island.is/logging'

import { appModuleConfig } from '../app.config'
import { CaseDeliveryService } from '../caseDelivery.service'

jest.mock('@island.is/logging')
jest.mock('node-fetch')

describe('CaseDeliveryService - Deliver case', () => {
  const config = appModuleConfig()
  const caseId = uuid()
  let result: boolean

  beforeEach(async () => {
    const mockFetch = (fetch as unknown) as jest.Mock
    mockFetch.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          caseFilesDeliveredToCourt: true,
          caseDeliveredToPolice: true,
        }),
      }),
    )

    const caseDeliveryService = new CaseDeliveryService(config, ({
      debug: jest.fn(),
    } as unknown) as Logger)
    result = await caseDeliveryService.deliverCase(caseId)
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
    expect(result).toBe(true)
  })
})
