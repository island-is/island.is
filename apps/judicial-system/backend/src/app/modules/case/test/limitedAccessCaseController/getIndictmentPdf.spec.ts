import { Response } from 'express'
import { uuid } from 'uuidv4'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { createIndictment } from '../../../../formatters'
import { Case } from '../../models/case.model'

jest.mock('../../../../formatters/indictmentPdf')

interface Then {
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('LimitedCaseController - Get indictment pdf', () => {
  const caseId = uuid()
  const theCase = {
    id: caseId,
  } as Case
  const pdf = uuid()
  const res = { end: jest.fn() } as unknown as Response

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { limitedAccessCaseController } = await createTestingCaseModule()

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        await limitedAccessCaseController.getIndictmentPdf(caseId, theCase, res)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('pdf generated', () => {
    beforeEach(async () => {
      const getMock = createIndictment as jest.Mock
      getMock.mockResolvedValueOnce(pdf)

      await givenWhenThen()
    })

    it('should generate pdf', () => {
      expect(createIndictment).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })
})
