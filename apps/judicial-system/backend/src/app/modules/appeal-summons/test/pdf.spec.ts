import { Response } from 'express'
import { v4 as uuid } from 'uuid'

import { AppealSummonsAppellantSide } from '@island.is/judicial-system/types'

import { createTestingAppealSummonsModule } from './createTestingAppealSummonsModule'

import { PdfService } from '../../case'
import { AppealSummons, Case } from '../../repository'
import { CreateAppealSummonsDto } from '../dto/createAppealSummons.dto'

describe('AppealSummonsController - PDF', () => {
  const caseId = uuid()
  const summonsId = uuid()
  const theCase = { id: caseId } as Case
  const summons = { id: summonsId } as AppealSummons
  const pdf = Buffer.from('pdf')
  const res = { end: jest.fn() } as unknown as Response

  let mockPdfService: PdfService
  let appealSummonsController: Awaited<
    ReturnType<typeof createTestingAppealSummonsModule>
  >['appealSummonsController']

  beforeEach(async () => {
    const testingModule = await createTestingAppealSummonsModule()
    mockPdfService = testingModule.pdfService
    appealSummonsController = testingModule.appealSummonsController
    ;(mockPdfService.getAppealSummonsPdf as jest.Mock).mockResolvedValue(pdf)
  })

  it('returns the saved summons as a pdf', async () => {
    await appealSummonsController.getPdf(
      caseId,
      summonsId,
      theCase,
      summons,
      res,
    )

    expect(mockPdfService.getAppealSummonsPdf).toHaveBeenCalledWith(
      theCase,
      summons,
    )
    expect(res.end).toHaveBeenCalledWith(pdf)
  })

  it('returns a preview pdf from the form body', async () => {
    const dto: CreateAppealSummonsDto = {
      defendants: [
        {
          defendantId: uuid(),
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims: 'Kröfur',
        },
      ],
    }

    await appealSummonsController.preview(caseId, theCase, dto, res)

    expect(mockPdfService.getAppealSummonsPdf).toHaveBeenCalledWith(
      theCase,
      undefined,
      dto.defendants,
    )
    expect(res.end).toHaveBeenCalledWith(pdf)
  })
})
