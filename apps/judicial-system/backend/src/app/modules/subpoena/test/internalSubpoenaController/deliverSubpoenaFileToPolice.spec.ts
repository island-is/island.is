import { Base64 } from 'js-base64'
import { uuid } from 'uuidv4'

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

describe('InternalSubpoenaController - Deliver subpoena to police', () => {
  const caseId = uuid()
  const subpoenaId = uuid()
  const defendantId = uuid()

  const subpoena = { id: subpoenaId } as Subpoena
  const defendant = { id: defendantId, subpoenas: [subpoena] } as Defendant
  const theCase = { id: caseId, defendants: [defendant] } as Case
  const user = { id: uuid() }
  const dto = { user } as DeliverDto

  let mockPdfService: PdfService
  let mockInternalCaseService: InternalCaseService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { pdfService, internalCaseService, internalSubpoenaController } =
      await createTestingSubpoenaModule()

    mockPdfService = pdfService
    const mockGetSubpoenaPdf = mockPdfService.getSubpoenaPdf as jest.Mock
    mockGetSubpoenaPdf.mockRejectedValue(new Error('Some error'))

    mockInternalCaseService = internalCaseService
    const mockDeliverCsaeToPoliceWithFiles =
      mockInternalCaseService.deliverCaseToPoliceWithFiles as jest.Mock
    mockDeliverCsaeToPoliceWithFiles.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async () => {
      const then = {} as Then

      await internalSubpoenaController
        .deliverSubpoenaFileToPolice(
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

  describe('subpoena delivered to police', () => {
    const subpoenaPdf = Buffer.from(uuid())
    let then: Then

    beforeEach(async () => {
      const mockGetSubpoenaPdf = mockPdfService.getSubpoenaPdf as jest.Mock
      mockGetSubpoenaPdf.mockResolvedValue(subpoenaPdf)
      const mockDeliverCsaeToPoliceWithFiles =
        mockInternalCaseService.deliverCaseToPoliceWithFiles as jest.Mock
      mockDeliverCsaeToPoliceWithFiles.mockResolvedValue(true)

      then = await givenWhenThen()
    })

    it('should call deliverSubpoenaFileToPolice', () => {
      expect(mockPdfService.getSubpoenaPdf).toBeCalledWith(
        theCase,
        defendant,
        subpoena,
      )
      expect(
        mockInternalCaseService.deliverCaseToPoliceWithFiles,
      ).toBeCalledWith(theCase, user, [
        {
          type: PoliceDocumentType.RVFK,
          courtDocument: Base64.btoa(subpoenaPdf.toString('binary')),
        },
      ])
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('subpoena delivery to police fails', () => {
    const subpoenaPdf = uuid()
    let then: Then

    beforeEach(async () => {
      const mockGetSubpoenaPdf = mockPdfService.getSubpoenaPdf as jest.Mock
      mockGetSubpoenaPdf.mockResolvedValue(subpoenaPdf)

      then = await givenWhenThen()
    })

    it('should call deliverSubpoenaFileToPolice', () => {
      expect(then.result).toEqual({ delivered: false })
    })
  })
})
