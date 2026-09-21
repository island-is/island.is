import { v4 as uuid } from 'uuid'

import { createTestingSubpoenaModule } from '../createTestingSubpoenaModule'

import { PdfService } from '../../../case'
import { EventService } from '../../../event'
import { Case, Defendant, Subpoena } from '../../../repository'
import { DeliverDto } from '../../dto/deliver.dto'
import { DeliverResponse } from '../../models/deliver.response'

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
  const transaction = undefined

  let mockPdfService: PdfService
  let mockEventService: EventService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { pdfService, eventService, internalSubpoenaController } =
      await createTestingSubpoenaModule()

    mockPdfService = pdfService
    mockEventService = eventService
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
      expect(mockPdfService.getSubpoenaPdf).toHaveBeenCalledWith(
        theCase,
        defendant,
        transaction,
        subpoena,
      )
      // TODO: complete tests when all indictments are generated
    })
  })

  describe('delivery fails', () => {
    // The top-level beforeEach makes subpoena PDF generation reject, so the
    // delivery fails.
    beforeEach(async () => {
      await givenWhenThen()
    })

    it('should report the failure to the Slack error channel', () => {
      expect(mockEventService.postErrorEvent).toHaveBeenCalledWith(
        'Villa við að senda fyrirkall til RLS',
        { caseId, defendantId, subpoenaId },
        expect.any(Error),
      )
    })
  })
})
