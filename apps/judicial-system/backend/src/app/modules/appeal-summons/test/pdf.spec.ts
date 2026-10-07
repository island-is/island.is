import { Response } from 'express'
import { v4 as uuid } from 'uuid'

import {
  AppealEventType,
  AppealSummonsAppellantSide,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealSummonsModule } from './createTestingAppealSummonsModule'

import { PdfService } from '../../case'
import {
  AppealEventLog,
  AppealSummons,
  Case,
  Defendant,
} from '../../repository'
import { CreateAppealSummonsDto } from '../dto/createAppealSummons.dto'

describe('AppealSummonsController - PDF', () => {
  const caseId = uuid()
  const summonsId = uuid()
  const defendantId = uuid()
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

  const user = {
    id: uuid(),
    name: 'Test Skrifstofa Ríkissaksóknara',
    title: 'Skrifstofa Ríkissaksóknara',
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
  }

  it('returns the saved summons as a pdf', async () => {
    await appealSummonsController.getPdf(
      caseId,
      summonsId,
      theCase,
      summons,
      user as never,
      res,
    )

    expect(mockPdfService.getAppealSummonsPdf).toHaveBeenCalledWith(
      theCase,
      user,
      summons,
    )
    expect(res.end).toHaveBeenCalledWith(pdf)
  })

  it('re-derives appellant side for preview, even if the client sends defence', async () => {
    const previewCase = {
      id: caseId,
      defendants: [{ id: defendantId, name: 'Jón Jónsson' } as Defendant],
      verdictAppealCase: {
        id: uuid(),
        appealEventLogs: [
          {
            id: uuid(),
            defendantId,
            eventType: AppealEventType.APPEALED,
            userRole: UserRole.DEFENDER,
            created: new Date(),
          } as AppealEventLog,
          {
            id: uuid(),
            defendantId,
            eventType: AppealEventType.APPEALED,
            userRole: UserRole.PROSECUTOR,
            created: new Date(),
          } as AppealEventLog,
        ],
      },
    } as Case

    const dto: CreateAppealSummonsDto = {
      defendants: [
        {
          defendantId,
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims: 'Kröfur',
        },
      ],
    }

    await appealSummonsController.preview(
      caseId,
      previewCase,
      dto,
      user as never,
      res,
    )

    expect(mockPdfService.getAppealSummonsPdf).toHaveBeenCalledWith(
      previewCase,
      user,
      undefined,
      [
        {
          defendantId,
          appellantSide: AppealSummonsAppellantSide.PROSECUTION,
          claims: 'Kröfur',
        },
      ],
    )
    expect(res.end).toHaveBeenCalledWith(pdf)
  })
})
