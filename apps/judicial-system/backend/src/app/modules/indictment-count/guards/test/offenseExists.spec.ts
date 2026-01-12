import { v4 as uuid } from 'uuid'

import { ExecutionContext, NotFoundException } from '@nestjs/common'

import { OffenseExistsGuard } from '../offenseExists.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Offense Exists Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    givenWhenThen = async (): Promise<Then> => {
      const guard = new OffenseExistsGuard()
      const then = {} as Then

      try {
        then.result = guard.canActivate({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })
  describe('offense exists', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const offenseId = uuid()

    const offense = { id: offenseId, indictmentCountId }
    const indictmentCount = {
      id: indictmentCountId,
      caseId,
      offenses: [offense],
    }
    const theCase = { id: caseId, indictmentCounts: [indictmentCount] }
    const request = {
      params: { caseId, indictmentCountId, offenseId },
      case: theCase,
      indictmentCount: indictmentCount,
      offense: undefined,
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
      expect(request.offense).toBe(offense)
    })
  })

  describe('offense does not exist', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const offenseId = uuid()

    const indictmentCount = { id: indictmentCountId, caseId, offenses: [] }
    const theCase = { id: caseId, indictmentCounts: [indictmentCount] }

    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({
        params: { caseId, indictmentCountId, offenseId },
        case: theCase,
        indictmentCount: indictmentCount,
      })

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `Offense ${offenseId} of indictment count ${indictmentCountId} of case ${theCase.id} does not exist`,
      )
    })
  })
})
