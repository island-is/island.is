import { Base64 } from 'js-base64'
import { v4 as uuid } from 'uuid'

import { createTestingSubpoenaModule } from '../createTestingSubpoenaModule'

import { InternalCaseService, PdfService } from '../../../case'
import { PoliceDocumentType } from '../../../police'
import { Case, Defendant, Subpoena } from '../../../repository'
import { DeliverDto } from '../../dto/deliver.dto'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalSubpoenaController - Deliver subpoena certificate to police', () => {
  const caseId = uuid()
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
    defendants: [defendant],
  } as Case
  const user = { id: uuid() }
  const dto = { user } as DeliverDto

  let mockPdfService: PdfService
  let mockInternalCaseService: InternalCaseService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { pdfService, internalCaseService, internalSubpoenaController } =
      await createTestingSubpoenaModule()

    mockPdfService = pdfService
    const mockGetSubpoenaServiceCertificatePdf =
      mockPdfService.getSubpoenaServiceCertificatePdf as jest.Mock
    mockGetSubpoenaServiceCertificatePdf.mockRejectedValue(
      new Error('Some error'),
    )

    mockInternalCaseService = internalCaseService
    const mockDeliverCaseToPoliceWithFiles =
      mockInternalCaseService.deliverCaseToPoliceWithFiles as jest.Mock
    mockDeliverCaseToPoliceWithFiles.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (): Promise<Then> => {
      const then = {} as Then

      await internalSubpoenaController
        .deliverServiceCertificateToPolice(
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

  describe('service certificate delivered to police', () => {
    const serviceCertificatePdf = Buffer.from(uuid())
    let then: Then

    beforeEach(async () => {
      const mockGetSubpoenaServiceCertificatePdf =
        mockPdfService.getSubpoenaServiceCertificatePdf as jest.Mock
      mockGetSubpoenaServiceCertificatePdf.mockResolvedValue(
        serviceCertificatePdf,
      )
      const mockDeliverCaseToPoliceWithFiles =
        mockInternalCaseService.deliverCaseToPoliceWithFiles as jest.Mock
      mockDeliverCaseToPoliceWithFiles.mockResolvedValue(true)

      then = await givenWhenThen()
    })

    it('should deliver the service certificate', () => {
      expect(
        mockPdfService.getSubpoenaServiceCertificatePdf,
      ).toHaveBeenCalledWith(theCase, defendant, subpoena)
      expect(
        mockInternalCaseService.deliverCaseToPoliceWithFiles,
      ).toHaveBeenCalledWith(theCase, user, [
        {
          type: PoliceDocumentType.RVBD,
          courtDocument: Base64.btoa(serviceCertificatePdf.toString('binary')),
        },
      ])
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('delivery to police fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockGetSubpoenaServiceCertificatePdf =
        mockPdfService.getSubpoenaServiceCertificatePdf as jest.Mock
      mockGetSubpoenaServiceCertificatePdf.mockResolvedValue(
        Buffer.from(uuid()),
      )
      const mockDeliverCaseToPoliceWithFiles =
        mockInternalCaseService.deliverCaseToPoliceWithFiles as jest.Mock
      mockDeliverCaseToPoliceWithFiles.mockResolvedValue(false)

      then = await givenWhenThen()
    })

    it('should return delivered false', () => {
      expect(then.result).toEqual({ delivered: false })
      expect(then.error).toBeUndefined()
    })
  })
})
