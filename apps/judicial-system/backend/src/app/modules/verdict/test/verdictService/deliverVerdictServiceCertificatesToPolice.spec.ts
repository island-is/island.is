import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { DefendantEventType } from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { InternalCaseService, PdfService } from '../../../case'
import { DefendantService } from '../../../defendant'
import { Case, Defendant, Verdict } from '../../../repository'
import { VerdictService } from '../../verdict.service'

describe('VerdictService - deliverVerdictServiceCertificatesToPolice', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const olderVerdictId = uuid()
  const newerVerdictId = uuid()
  const transaction = {} as Transaction

  let verdictService: VerdictService
  let mockInternalCaseService: InternalCaseService
  let mockPdfService: PdfService
  let mockDefendantService: DefendantService

  beforeEach(async () => {
    jest.resetAllMocks()

    const {
      verdictService: service,
      internalCaseService,
      pdfService,
      defendantService,
    } = await createTestingVerdictModule()

    verdictService = service
    mockInternalCaseService = internalCaseService
    mockPdfService = pdfService
    mockDefendantService = defendantService
  })

  it('uses the newest verdict for the pdf and the delivery event', async () => {
    const olderVerdict = {
      id: olderVerdictId,
      created: new Date('2026-01-01'),
    } as Verdict
    const newerVerdict = {
      id: newerVerdictId,
      created: new Date('2026-06-01'),
    } as Verdict

    const defendant = {
      id: defendantId,
      // Older first: must not use verdicts[0]
      verdicts: [olderVerdict, newerVerdict],
    } as Defendant

    const theCase = {
      id: caseId,
      judge: {
        id: uuid(),
        created: new Date(),
        modified: new Date(),
      },
      defendants: [defendant],
    } as Case

    const mockGetDefendants =
      mockInternalCaseService.getIndictmentCaseDefendantsWithExpiredAppealDeadline as jest.Mock
    mockGetDefendants.mockResolvedValue([{ theCase, defendant }])

    const mockGetPdf =
      mockPdfService.getVerdictServiceCertificatePdf as jest.Mock
    mockGetPdf.mockResolvedValue(Buffer.from('pdf'))

    const mockDeliver =
      mockInternalCaseService.deliverCaseToPoliceWithFiles as jest.Mock
    mockDeliver.mockResolvedValue(true)

    const mockCreateEvent =
      mockDefendantService.createDefendantEvent as jest.Mock
    mockCreateEvent.mockResolvedValue(undefined)

    await verdictService.deliverVerdictServiceCertificatesToPolice(transaction)

    expect(mockGetPdf).toHaveBeenCalledWith(theCase, defendant, newerVerdict)
    expect(mockCreateEvent).toHaveBeenCalledWith(
      {
        caseId,
        defendantId,
        eventType:
          DefendantEventType.VERDICT_SERVICE_CERTIFICATE_DELIVERED_TO_POLICE,
        verdictId: newerVerdictId,
      },
      transaction,
    )
  })
})
