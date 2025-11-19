import {
  CallHandler,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'

import { Case } from '../../../repository'
import { InternalCaseService } from '../../internalCase.service'
import { CaseOriginalAncestorInterceptor } from '../caseOriginalAncestor.interceptor'

interface Then {
  result: unknown
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Case Original Ancestor Interceptor', () => {
  const mockFindOriginalAncestor = jest.fn()
  const mockRequest = jest.fn()
  const mockHandle = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    givenWhenThen = async (): Promise<Then> => {
      const interceptor = new CaseOriginalAncestorInterceptor({
        findOriginalAncestor: mockFindOriginalAncestor,
      } as unknown as InternalCaseService)
      const then = {} as Then

      await interceptor
        .intercept(
          {
            switchToHttp: () => ({ getRequest: mockRequest }),
          } as unknown as ExecutionContext,
          { handle: mockHandle } as unknown as CallHandler,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('original ancestor lookup', () => {
    const theCase = {} as Case

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ case: theCase }))

      await givenWhenThen()
    })

    it('should request the original ancestor', () => {
      expect(mockFindOriginalAncestor).toHaveBeenCalledWith(theCase)
    })
  })

  describe('next call', () => {
    const theCase = {} as Case
    const request = { case: theCase }
    const result = {}
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => request)
      mockHandle.mockReturnValueOnce(result)

      then = await givenWhenThen()
    })

    it('should not change request case', () => {
      expect(then.result).toBe(result)
    })
  })

  describe('case has no ancestor', () => {
    const theCase = {} as Case
    const request = { case: theCase }

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => request)
      mockFindOriginalAncestor.mockResolvedValueOnce(theCase)

      await givenWhenThen()
    })

    it('should not change request case', () => {
      expect(request.case).toBe(theCase)
    })
  })

  describe('missing case', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({}))

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case')
    })
  })
})
