import fetch from 'isomorphic-fetch'
import { v4 as uuid } from 'uuid'

import { CaseFileClassification } from '@island.is/judicial-system/types'

import appModuleConfig from '../app.config'
import { createTestingAppModule } from './createTestingAppModule'

jest.mock('isomorphic-fetch')

const config = appModuleConfig()

describe('AppController - Get case file classification', () => {
  let appController: Awaited<ReturnType<typeof createTestingAppModule>>

  beforeEach(async () => {
    appController = await createTestingAppModule()
  })

  describe('remote call', () => {
    const caseId = uuid()

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          classification: CaseFileClassification.CASE_FILES_RECORD,
        }),
      })

      await appController.getCaseFileClassification(caseId)
    })

    it('should call backend at /api/internal/case/:caseId/caseFileClassification', () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backend.url}/api/internal/case/${caseId}/caseFileClassification`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backend.accessToken}`,
          },
        },
      )
    })
  })

  describe('classification returned', () => {
    const caseId = uuid()

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          classification: CaseFileClassification.ADDITIONAL_CASE_FILE,
        }),
      })
    })

    it('should return the classification', async () => {
      const result = await appController.getCaseFileClassification(caseId)

      expect(result).toEqual({
        classification: CaseFileClassification.ADDITIONAL_CASE_FILE,
      })
    })
  })
})
