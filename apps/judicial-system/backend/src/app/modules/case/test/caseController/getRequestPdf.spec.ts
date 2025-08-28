import { Response } from 'express'
import { uuid } from 'uuidv4'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { getRequestPdfAsBuffer } from '../../../../formatters'
import { Case } from '../../../repository'

jest.mock('../../../../formatters/requestPdf')

interface Then {
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  res: Response,
) => Promise<Then>

describe('CaseController - Get request pdf', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseController } = await createTestingCaseModule()

    givenWhenThen = async (caseId: string, theCase: Case, res: Response) => {
      const then = {} as Then

      try {
        await caseController.getRequestPdf(caseId, theCase, res)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('pdf generated', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const res = {} as Response

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, res)
    })

    it('should generate pdf', () => {
      expect(getRequestPdfAsBuffer).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
    })
  })

  describe('pdf returned', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const res = { end: jest.fn() } as unknown as Response
    const pdf = {}

    beforeEach(async () => {
      const getMock = getRequestPdfAsBuffer as jest.Mock
      getMock.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, theCase, res)
    })

    it('should generate pdf', () => {
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('pdf generation fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then
    const res = {} as Response

    beforeEach(async () => {
      const getMock = getRequestPdfAsBuffer as jest.Mock
      getMock.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase, res)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
