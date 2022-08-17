import { uuid } from 'uuidv4'
import fetch from 'node-fetch'

import { CaseFileState } from '@island.is/judicial-system/types'

import { appModuleConfig } from '../app.config'
import { CaseDeliveryService } from '../caseDelivery.service'

jest.mock('@island.is/logging')
jest.mock('node-fetch')

describe('CaseDeliveryService - Deliver case', () => {
  const config = appModuleConfig()
  const caseId = uuid()
  const caseFileId1 = uuid()
  const caseFileId2 = uuid()

  beforeAll(async () => {
    const mockFetch = (fetch as unknown) as jest.Mock
    mockFetch.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
        json: () => [
          { id: caseFileId1, state: CaseFileState.STORED_IN_RVG },
          { id: caseFileId2, state: CaseFileState.STORED_IN_COURT },
        ],
      }),
    )

    const caseDeliveryService = new CaseDeliveryService(config)
    await caseDeliveryService.deliverCase(caseId)
  })

  it('should deliver a case', () => {
    expect(fetch).toHaveBeenCalledWith(
      `${config.backendUrl}/api/internal/case/${caseId}/deliver`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${config.backendAccessToken}`,
        },
      },
    )
  })
})
