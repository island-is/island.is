import { uuid } from 'uuidv4'

import { createTestingSubpoenaModule } from '../createTestingSubpoenaModule'

import { Case, PdfService } from '../../../case'
import { CourtService } from '../../../court'
import { Defendant } from '../../../defendant'
import { DeliverDto } from '../../dto/deliver.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { Subpoena } from '../../models/subpoena.model'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalSubpoenaController - Deliver subpoena certificate to court', () => {
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
    const mockGetServiceCertificatePdf =
      mockPdfService.getServiceCertificatePdf as jest.Mock
    mockGetServiceCertificatePdf.mockRejectedValue(new Error('Some error'))

    mockCourtService = courtService
    const mockCreateDocument = mockCourtService.createDocument as jest.Mock
    mockCreateDocument.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async () => {
      const then = {} as Then

      await internalSubpoenaController
        .deliverServiceCertificateToCourt(
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

  describe('service certificate delivered to court', () => {
    const serviceCertificatePdf = uuid()
    let then: Then

    beforeEach(async () => {
      const mockGetServiceCertificatePdf =
        mockPdfService.getServiceCertificatePdf as jest.Mock
      mockGetServiceCertificatePdf.mockResolvedValue(serviceCertificatePdf)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValue('')

      then = await givenWhenThen()
    })

    it('should deliver the service certificate', () => {
      expect(mockPdfService.getServiceCertificatePdf).toBeCalledWith(
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
        `Birtingarvottorð - ${defendantName}`,
        `Birtingarvottorð - ${defendantName}.pdf`,
        'application/pdf',
        serviceCertificatePdf,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
