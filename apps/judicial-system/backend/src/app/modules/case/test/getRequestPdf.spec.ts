import { uuid } from 'uuidv4'
import { Response } from 'express'

import { getRequestPdfAsBuffer } from '../../../formatters/requestPdf'
import { Case } from '../models'
import { createTestingCaseModule } from './createTestingCaseModule'

jest.mock('../../../formatters/requestPdf')

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

    beforeEach(async () => {
      const getMock = getRequestPdfAsBuffer as jest.Mock
      getMock

      await givenWhenThen(caseId, theCase, {} as Response)
    })

    it('should generate pdf', () => {
      expect(getRequestPdfAsBuffer).toHaveBeenCalledWith(
        theCase,
        undefined, // TODO Mock IntlService
      )
    })
  })
})
