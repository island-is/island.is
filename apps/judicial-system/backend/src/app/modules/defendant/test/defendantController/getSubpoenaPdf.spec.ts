import { Response } from 'express'
import { uuid } from 'uuidv4'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { Case, PdfService } from '../../../case'
import { Defendant } from '../../models/defendant.model'

interface Then {
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('DefendantController - Get subpoena pdf', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const defendant = { id: defendantId } as Defendant
  const theCase = { id: caseId } as Case
  const res = { end: jest.fn() } as unknown as Response
  const pdf = Buffer.from(uuid())
  let mockPdfService: PdfService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { pdfService, defendantController } =
      await createTestingDefendantModule()

    mockPdfService = pdfService
    const getSubpoenaPdfMock = mockPdfService.getSubpoenaPdf as jest.Mock
    getSubpoenaPdfMock.mockResolvedValueOnce(pdf)

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        await defendantController.getSubpoenaPdf(
          caseId,
          defendantId,
          theCase,
          defendant,
          res,
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
        undefined,
        undefined,
        undefined,
      )
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })
})
