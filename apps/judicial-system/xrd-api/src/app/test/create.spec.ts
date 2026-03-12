import fetch from 'isomorphic-fetch'
import { v4 as uuid } from 'uuid'

import { CaseType } from '@island.is/judicial-system/types'

import appModuleConfig from '../app.config'
import { CreateCaseDto } from '../dto/createCase.dto'
import { Case } from '../models/case.model'
import { createTestingAppModule } from './createTestingAppModule'

jest.mock('isomorphic-fetch')

const config = appModuleConfig()
describe('AppController - Create', () => {
  let appController: Awaited<ReturnType<typeof createTestingAppModule>>

  beforeEach(async () => {
    appController = await createTestingAppModule()
  })

  describe('remote call', () => {
    const caseToCreate: CreateCaseDto = {
      policeCaseNumber: '007-2022-2',
      type: CaseType.CUSTODY,
      prosecutorNationalId: '1111111111',
      prosecutorsOfficeNationalId: '2222222222',
      leadInvestigator: 'The Boss',
    }

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ id: 'case-id-v2' }),
      })

      await appController.create(caseToCreate)
    })

    it('should call backend at /api/internal/case/create with body without accused fields', () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backend.url}/api/internal/case/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backend.accessToken}`,
          },
          body: JSON.stringify({
            ...caseToCreate,
            policeCaseNumber: undefined,
            policeCaseNumbers: ['007-2022-2'],
          }),
        },
      )
    })
  })

  describe('case created', () => {
    const caseToCreate = {} as CreateCaseDto
    const caseId = uuid()
    const theCase = { id: caseId }

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(theCase),
      })
    })

    it('should return a new case', async () => {
      const result = await appController.create(caseToCreate)
      expect(result).toEqual({ id: caseId })
    })
  })
})
