import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'

import { SubpoenaExistsGuard } from '../subpoenaExists.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Subpoena Exists Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    givenWhenThen = async (): Promise<Then> => {
      const guard = new SubpoenaExistsGuard()
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

  describe('subpoena exists', () => {
    const subpoenaId = uuid()
    const subpoena = { id: subpoenaId }
    const defendantId = uuid()
    const defendant = { id: defendantId, subpoenas: [subpoena] }
    const request = { params: { subpoenaId }, defendant, subpoena: undefined }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
      expect(request.subpoena).toBe(subpoena)
    })
  })

  describe('subpoena does not exist', () => {
    const subpoenaId = uuid()
    const defendantId = uuid()
    const defendant = { id: defendantId, subpoenas: [] }
    const request = { params: { subpoenaId }, defendant, subpoena: undefined }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `Subpoena ${subpoenaId} of defendant ${defendantId} does not exist`,
      )
    })
  })

  describe('missing defendant', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: {} })

      then = await givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing defendant')
    })
  })

  describe('missing subpoena id', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: {}, defendant: { id: uuid() } })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing subpoena id')
    })
  })
})
