import fetch from 'isomorphic-fetch'
import { v4 as uuid } from 'uuid'

import { CasePoliceState } from '@island.is/judicial-system/types'

import appModuleConfig from '../app.config'
import { createTestingAppModule } from './createTestingAppModule'

jest.mock('isomorphic-fetch')

const config = appModuleConfig()

describe('AppController - Get case police state', () => {
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
          state: CasePoliceState.DRAFT,
        }),
      })

      await appController.getCasePoliceState(caseId)
    })

    it('should call backend at /api/internal/case/:caseId/state', () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backend.url}/api/internal/case/${caseId}/state`,
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

  describe('state returned', () => {
    const caseId = uuid()

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          state: CasePoliceState.SUBMITTED,
        }),
      })
    })

    it('should return the state', async () => {
      const result = await appController.getCasePoliceState(caseId)

      expect(result).toEqual({
        state: CasePoliceState.SUBMITTED,
      })
    })
  })
})
