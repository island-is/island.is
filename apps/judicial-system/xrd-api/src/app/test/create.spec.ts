import fetch from 'isomorphic-fetch'
import { v4 as uuid } from 'uuid'

import { BadGatewayException, BadRequestException } from '@nestjs/common'

import { CaseType } from '@island.is/judicial-system/types'

import appModuleConfig from '../app.config'
import { CreateCaseDto } from '../dto/createCase.dto'
import { CreateCaseV2Dto } from '../dto/createCaseV2.dto'
import { Case } from '../models/case.model'
import { createTestingAppModule } from './createTestingAppModule'

jest.mock('isomorphic-fetch')

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (caseToCreate: CreateCaseDto) => Promise<Then>

const config = appModuleConfig()
describe('AppController - Greate', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const appController = await createTestingAppModule()

    givenWhenThen = async (caseToCreate: CreateCaseDto): Promise<Then> => {
      const then = {} as Then

      await appController
        .create(caseToCreate)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('remote call', () => {
    const caseToCreate: CreateCaseDto = {
      policeCaseNumber: '007-2022-1',
      type: CaseType.CUSTODY,
      prosecutorNationalId: '1111111111',
      prosecutorsOfficeNationalId: '2222222222',
      accusedNationalId: '00000000000',
    }

    beforeEach(async () => {
      await givenWhenThen(caseToCreate)
    })

    it('should initiate case creation', () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backend.url}/api/internal/case/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${config.backend.accessToken}`,
          },
          body: JSON.stringify({
            ...caseToCreate,
            policeCaseNumber: undefined,
            policeCaseNumbers: ['007-2022-1'],
          }),
        },
      )
    })
  })

  describe('case created', () => {
    const caseToCreate = {} as CreateCaseDto
    const caseId = uuid()
    const theCase = { id: caseId }
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(theCase),
      })

      then = await givenWhenThen(caseToCreate)
    })

    it('should return a new case', () => {
      expect(then.result).toEqual({ id: caseId })
    })
  })

  describe('bad request', () => {
    const caseToCreate = {} as CreateCaseDto
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValueOnce({ detail: 'Some detail' }),
      })

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Some detail')
    })
  })

  describe('creation fails', () => {
    const caseToCreate = {} as CreateCaseDto
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ detail: 'Some detail' }),
      })

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw BadGatewayException', () => {
      expect(then.error).toBeInstanceOf(BadGatewayException)
      expect(then.error.message).toBe('Failed to create a new case')
    })
  })

  describe('invalid json', () => {
    const caseToCreate = {} as CreateCaseDto
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockRejectedValueOnce(new Error('Some error')),
      })

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw a BadGatewayException', () => {
      expect(then.error).toBeInstanceOf(BadGatewayException)
      expect(then.error.message).toBe('Failed to create a new case')
    })
  })

  describe('remote call fails', () => {
    const caseToCreate = {} as CreateCaseDto
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw a BadGatewayException', () => {
      expect(then.error).toBeInstanceOf(BadGatewayException)
      expect(then.error.message).toBe('Failed to create a new case')
    })
  })
})

describe('AppController - CreateV2', () => {
  let appController: Awaited<ReturnType<typeof createTestingAppModule>>

  beforeEach(async () => {
    appController = await createTestingAppModule()
  })

  describe('remote call', () => {
    const caseToCreate: CreateCaseV2Dto = {
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

      await appController.createV2(caseToCreate)
    })

    it('should call backend at /api/internal/case/v2 with body without accused fields', () => {
      expect(fetch).toHaveBeenCalledWith(
        `${config.backend.url}/api/internal/case/v2`,
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
    const caseToCreate = {} as CreateCaseV2Dto
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
      const result = await appController.createV2(caseToCreate)
      expect(result).toEqual({ id: caseId })
    })
  })
})
