import { Response } from 'express'
import { uuid } from 'uuidv4'

import { createTestingSubpoenaModule } from '../createTestingSubpoenaModule'

import { PdfService } from '../../../case'
import { Case, Defendant, Subpoena } from '../../../repository'

interface Then {
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('SubpoenaController - Get subpoena pdf', () => {
  const caseId = uuid()
  const subpoenaId = uuid()
  const subpoena = { id: subpoenaId } as Subpoena
  const defendantId = uuid()
  const defendant = { id: defendantId, subpoenas: [subpoena] } as Defendant
  const theCase = { id: caseId } as Case
  const res = { end: jest.fn() } as unknown as Response
  const pdf = Buffer.from(uuid())
  let mockPdfService: PdfService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { pdfService, subpoenaController } =
      await createTestingSubpoenaModule()

    mockPdfService = pdfService
    const getSubpoenaPdfMock = mockPdfService.getSubpoenaPdf as jest.Mock
    getSubpoenaPdfMock.mockResolvedValueOnce(pdf)

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        await subpoenaController.getSubpoenaPdf(
          caseId,
          defendantId,
          subpoenaId,
          theCase,
          defendant,
          res,
          subpoena,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('pdf generated', () => {
    beforeEach(async () => {
      await givenWhenThen()
    })

    it('should generate pdf', () => {
      expect(mockPdfService.getSubpoenaPdf).toHaveBeenCalledWith(
        theCase,
        defendant,
        subpoena,
        undefined,
        undefined,
        undefined,
      )
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })
})
