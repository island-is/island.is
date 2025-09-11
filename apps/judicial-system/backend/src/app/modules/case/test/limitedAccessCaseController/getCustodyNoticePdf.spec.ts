import { Response } from 'express'
import { uuid } from 'uuidv4'

import { BadRequestException } from '@nestjs/common'

import { CaseState } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { getCustodyNoticePdfAsBuffer } from '../../../../formatters'
import { Case } from '../../../repository'

jest.mock('../../../../formatters/custodyNoticePdf')

interface Then {
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  res: Response,
) => Promise<Then>

describe('LimitedAccessCaseController - Get custody notice pdf', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { limitedAccessCaseController } = await createTestingCaseModule()

    givenWhenThen = async (caseId: string, theCase: Case, res: Response) => {
      const then = {} as Then

      try {
        await limitedAccessCaseController.getCustodyNoticePdf(
          caseId,
          theCase,
          res,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('generate pdf', () => {
    const caseId = uuid()
    const theCase = { id: caseId, state: CaseState.ACCEPTED } as Case
    const res = { end: jest.fn() } as unknown as Response
    const pdf = 'Custody notice pdf'

    beforeEach(async () => {
      const getMock = getCustodyNoticePdfAsBuffer as jest.Mock
      getMock.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, theCase, res)
    })

    it('should generate pdf', () => {
      expect(getCustodyNoticePdfAsBuffer).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('case not accepted', () => {
    const caseId = uuid()
    const theCase = { id: caseId, state: CaseState.REJECTED } as Case
    let then: Then
    const res = {} as Response

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase, res)
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        'Cannot generate a custody notice for REJECTED cases',
      )
    })
  })

  describe('pdf generation fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId, state: CaseState.ACCEPTED } as Case
    let then: Then
    const res = {} as Response

    beforeEach(async () => {
      const getMock = getCustodyNoticePdfAsBuffer as jest.Mock
      getMock.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase, res)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
