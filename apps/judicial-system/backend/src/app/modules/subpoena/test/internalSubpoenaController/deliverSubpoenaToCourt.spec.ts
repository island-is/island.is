import { v4 as uuid } from 'uuid'

import { createTestingSubpoenaModule } from '../createTestingSubpoenaModule'

import { PdfService } from '../../../case'
import { CourtService } from '../../../court'
import { Case, Defendant, Subpoena } from '../../../repository'
import { DeliverDto } from '../../dto/deliver.dto'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalSubpoenaController - Deliver subpoena to court', () => {
  const caseId = uuid()
  const courtId = uuid()
  const courtCaseNumber = uuid()
  const subpoenaId = uuid()
  const defendantId = uuid()
  const defendantName = uuid()

  const subpoena = { id: subpoenaId } as Subpoena
  const defendant = {
    id: defendantId,
    name: defendantName,
    subpoenas: [subpoena],
  } as Defendant
  const theCase = {
    id: caseId,
    courtId,
    courtCaseNumber,
    defendants: [defendant],
  } as Case
  const user = { id: uuid() }
  const dto = { user } as DeliverDto

  let mockPdfService: PdfService
  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, pdfService, internalSubpoenaController } =
      await createTestingSubpoenaModule()

    mockPdfService = pdfService
    const mockGetSubpoenaPdf = mockPdfService.getSubpoenaPdf as jest.Mock
    mockGetSubpoenaPdf.mockRejectedValue(new Error('Some error'))

    mockCourtService = courtService
    const mockCreateDocument = mockCourtService.createDocument as jest.Mock
    mockCreateDocument.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async () => {
      const then = {} as Then

      await internalSubpoenaController
        .deliverSubpoenaToCourt(
          caseId,
          defendantId,
          subpoenaId,
          theCase,
          defendant,
          subpoena,
          dto,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('subpoena delivered to court', () => {
    const subpoenaPdf = uuid()
    let then: Then

    beforeEach(async () => {
      const mockGetSubpoenaPdf = mockPdfService.getSubpoenaPdf as jest.Mock
      mockGetSubpoenaPdf.mockResolvedValue(subpoenaPdf)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValue('')

      then = await givenWhenThen()
    })

    it('should deliver the subpoena', () => {
      expect(mockPdfService.getSubpoenaPdf).toBeCalledWith(
        theCase,
        defendant,
        subpoena,
      )
      expect(mockCourtService.createDocument).toBeCalledWith(
        user,
        caseId,
        courtId,
        courtCaseNumber,
        'Boðanir',
        `Fyrirkall - ${defendantName}`,
        `Fyrirkall - ${defendantName}.pdf`,
        'application/pdf',
        subpoenaPdf,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
