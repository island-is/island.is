import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { IndictmentCountService } from '../../indictmentCount.service'
import { IndictmentCountExistsGuard } from '../indictmentCountExists.guard'

interface Then {
  result?: boolean
  error?: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Indictment Count Exists Guard', () => {
  let mockRequest: jest.Mock
  let mockFindById: jest.Mock
  let mockIndictmentCountService: Partial<IndictmentCountService>
  let guard: IndictmentCountExistsGuard
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    mockRequest = jest.fn()
    mockFindById = jest.fn()

    mockIndictmentCountService = {
      findById: mockFindById,
    }

    guard = new IndictmentCountExistsGuard(
      mockIndictmentCountService as IndictmentCountService,
    )

    givenWhenThen = async (): Promise<Then> => {
      const then = {} as Then

      try {
        then.result = await guard.canActivate({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('indictment count exists', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const indictmentCount = { id: indictmentCountId, caseId }
    const theCase = { id: caseId }
    const request = {
      params: { caseId, indictmentCountId },
      case: theCase,
      indictmentCount: undefined,
    }

    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue(request)
      mockFindById.mockResolvedValue(indictmentCount)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
      expect(request.indictmentCount).toBe(indictmentCount)
    })
  })

  describe('indictment count does not exist', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const theCase = { id: caseId }

    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue({
        params: { caseId, indictmentCountId },
        case: theCase,
      })
      mockFindById.mockResolvedValue(null)

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error?.message).toBe(
        `Indictment count ${indictmentCountId} of case ${caseId} does not exist`,
      )
    })
  })

  describe('missing case', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue({ params: {} })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error?.message).toBe('Missing case')
    })
  })

  describe('missing indictment count id', () => {
    const caseId = uuid()
    const theCase = { id: caseId }

    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValue({ params: { caseId }, case: theCase })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error?.message).toBe('Missing indictment count id')
    })
  })
})
