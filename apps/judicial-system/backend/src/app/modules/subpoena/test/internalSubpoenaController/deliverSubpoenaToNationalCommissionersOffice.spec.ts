import { uuid } from 'uuidv4'

import { createTestingSubpoenaModule } from '../createTestingSubpoenaModule'

import { Case, PdfService } from '../../../case'
import { Defendant } from '../../../defendant'
import { DeliverDto } from '../../dto/deliver.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { Subpoena } from '../../models/subpoena.model'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalSubpoenaController - Deliver subpoena to national commissioners office', () => {
  const caseId = uuid()
  const subpoenaId = uuid()
  const defendantId = uuid()

  const subpoena = { id: subpoenaId } as Subpoena
  const defendant = { id: defendantId, subpoenas: [subpoena] } as Defendant
  const theCase = { id: caseId, defendants: [defendant] } as Case
  const user = { id: uuid() }
  const dto = { user } as DeliverDto

  let mockPdfService: PdfService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { pdfService, internalSubpoenaController } =
      await createTestingSubpoenaModule()

    mockPdfService = pdfService
    const mockGetSubpoenaPdf = mockPdfService.getSubpoenaPdf as jest.Mock
    mockGetSubpoenaPdf.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (): Promise<Then> => {
      const then = {} as Then

      await internalSubpoenaController
        .deliverSubpoenaToNationalCommissionersOffice(
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

  describe('subpoena delivered to police central file system', () => {
    const subpoenaPdf = uuid()

    beforeEach(async () => {
      const mockGetSubpoenaPdf = mockPdfService.getSubpoenaPdf as jest.Mock
      mockGetSubpoenaPdf.mockResolvedValue(subpoenaPdf)

      await givenWhenThen()
    })

    it('should call deliverSubpoenaToPolice', () => {
      expect(mockPdfService.getSubpoenaPdf).toBeCalledWith(
        theCase,
        defendant,
        subpoena,
      )
      // TODO: complete tests when all indictments are generated
    })
  })
})
