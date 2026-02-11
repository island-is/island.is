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
    const defendantId = uuid()
    const caseId = uuid()
    const subpoena = { id: subpoenaId }
    const defendant = { id: defendantId, caseId, subpoenas: [subpoena] }
    const theCase = { id: caseId, defendants: [defendant] }
    const request = {
      params: { subpoenaId },
      case: theCase,
      defendant,
      subpoena: undefined,
    }
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
    const caseId = uuid()
    const defendant = { id: defendantId, caseId, subpoenas: [] }
    const theCase = { id: caseId, defendants: [defendant] }
    const request = {
      params: { subpoenaId },
      case: theCase,
      defendant,
      subpoena: undefined,
    }
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

  describe('missing case', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: {} })

      then = await givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case')
    })
  })

  describe('missing defendant', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: {}, case: { id: uuid() } })

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
      mockRequest.mockReturnValueOnce({
        params: {},
        case: { id: uuid() },
        defendant: { id: uuid() },
      })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing subpoena id')
    })
  })

  describe('Split case does not exist', () => {
    const subpoenaId = uuid()
    const defendantId = uuid()
    const caseId = uuid()
    const splitCaseId = uuid()
    const subpoena = { id: subpoenaId }
    const defendant = {
      id: defendantId,
      caseId: splitCaseId,
      subpoenas: [subpoena],
    }
    const theCase = { id: caseId, defendants: [defendant] }
    const request = {
      params: { subpoenaId },
      case: theCase,
      defendant,
      subpoena,
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe(
        `Defendant ${defendantId} is linked to case ${splitCaseId} which is not a split case of case ${caseId}`,
      )
    })
  })

  describe('Subpoena was created before split', () => {
    const subpoenaCreationDate = new Date()
    const splitCaseCreationDate = new Date(
      subpoenaCreationDate.getTime() + 1000,
    )
    const subpoenaId = uuid()
    const defendantId = uuid()
    const splitCaseId = uuid()
    const caseId = uuid()
    const subpoena = { id: subpoenaId, created: subpoenaCreationDate }
    const defendant = {
      id: defendantId,
      caseId: splitCaseId,
      subpoenas: [subpoena],
    }
    const theCase = {
      id: caseId,
      defendants: [defendant],
      splitCases: [{ id: splitCaseId, created: splitCaseCreationDate }],
    }
    const request = {
      params: { subpoenaId },
      case: theCase,
      defendant,
      subpoena,
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)

      then = await givenWhenThen()
    })

    it('should not activate', () => {
      expect(then.result).toBe(true)
      expect(request.subpoena).toBe(subpoena)
    })
  })

  describe('Subpoena was created after split', () => {
    const splitCaseCreationDate = new Date()
    const subpoenaCreationDate = new Date(
      splitCaseCreationDate.getTime() + 1000,
    )
    const subpoenaId = uuid()
    const defendantId = uuid()
    const splitCaseId = uuid()
    const caseId = uuid()
    const subpoena = { id: subpoenaId, created: subpoenaCreationDate }
    const defendant = {
      id: defendantId,
      caseId: splitCaseId,
      subpoenas: [subpoena],
    }
    const theCase = {
      id: caseId,
      defendants: [defendant],
      splitCases: [{ id: splitCaseId, created: splitCaseCreationDate }],
    }
    const request = {
      params: { subpoenaId },
      case: theCase,
      defendant,
      subpoena,
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)

      then = await givenWhenThen()
    })

    it('should not activate', () => {
      expect(then.result).toBe(false)
    })
  })
})
