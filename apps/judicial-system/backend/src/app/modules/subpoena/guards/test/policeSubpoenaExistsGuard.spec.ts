import { uuid } from 'uuidv4'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { createTestingSubpoenaModule } from '../../test/createTestingSubpoenaModule'

import { Subpoena } from '../../../repository'
import { include } from '../../subpoena.service'
import { PoliceSubpoenaExistsGuard } from '../policeSubpoenaExists.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Police Subpoena Exists Guard', () => {
  const mockRequest = jest.fn()
  let mockSubpoenaModel: typeof Subpoena
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { subpoenaModel, subpoenaService } =
      await createTestingSubpoenaModule()

    mockSubpoenaModel = subpoenaModel

    givenWhenThen = async (): Promise<Then> => {
      const guard = new PoliceSubpoenaExistsGuard(subpoenaService)
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
    const policeSubpoenaId = uuid()
    const subpoena = { id: uuid(), policeSubpoenaId }
    const request = {
      params: { policeSubpoenaId },
      subpoena: undefined,
    }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)
      const mockFindOne = mockSubpoenaModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(subpoena)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(mockSubpoenaModel.findOne).toHaveBeenCalledWith({
        include,
        where: { policeSubpoenaId },
      })
      expect(then.result).toBe(true)
      expect(request.subpoena).toBe(subpoena)
    })
  })

  describe('subpoena does not exist', () => {
    const policeSubpoenaId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({
        params: { policeSubpoenaId },
      })

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `Subpoena with police subpoena id ${policeSubpoenaId} does not exist`,
      )
    })
  })

  describe('missing subpoena id', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: {} })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing police subpoena id')
    })
  })
})
