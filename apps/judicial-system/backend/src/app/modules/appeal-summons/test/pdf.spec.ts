import { Response } from 'express'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import {
  AppealEventType,
  AppealSummonsAppellantSide,
  InstitutionType,
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
import { AppealSummonsRepositoryService } from '../../repository'
import { PreviewAppealSummonsDto } from '../dto/previewAppealSummons.dto'

describe('AppealSummonsController - PDF', () => {
  const caseId = uuid()
  const summonsId = uuid()
  const defendantId = uuid()
  const theCase = { id: caseId } as Case
  const summons = { id: summonsId } as AppealSummons
  const pdf = Buffer.from('pdf')
  const res = { end: jest.fn() } as unknown as Response

  let mockPdfService: PdfService
  let mockAppealSummonsRepositoryService: AppealSummonsRepositoryService
  let appealSummonsController: Awaited<
    ReturnType<typeof createTestingAppealSummonsModule>
  >['appealSummonsController']

  beforeEach(async () => {
    const testingModule = await createTestingAppealSummonsModule()
    mockPdfService = testingModule.pdfService
    mockAppealSummonsRepositoryService =
      testingModule.appealSummonsRepositoryService
    appealSummonsController = testingModule.appealSummonsController
    ;(mockPdfService.getAppealSummonsPdf as jest.Mock).mockResolvedValue(pdf)
  })

  const user = {
    id: uuid(),
    name: 'Test Skrifstofa Ríkissaksóknara',
    title: 'Skrifstofa Ríkissaksóknara',
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    institution: { type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE },
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

  it('rejects a court of appeals user before the summons has been sent', async () => {
    const courtOfAppealsJudge = {
      id: uuid(),
      name: 'Landsréttardómari',
      title: 'dómari',
      role: UserRole.COURT_OF_APPEALS_JUDGE,
      institution: { type: InstitutionType.COURT_OF_APPEALS },
    }

    await expect(
      appealSummonsController.getPdf(
        caseId,
        summonsId,
        theCase,
        { ...summons, sentToCourtOfAppealsDate: null } as AppealSummons,
        courtOfAppealsJudge as never,
        res,
      ),
    ).rejects.toThrow(ForbiddenException)

    expect(mockPdfService.getAppealSummonsPdf).not.toHaveBeenCalled()
  })

  it('allows a court of appeals user after the summons has been sent', async () => {
    const courtOfAppealsJudge = {
      id: uuid(),
      name: 'Landsréttardómari',
      title: 'dómari',
      role: UserRole.COURT_OF_APPEALS_JUDGE,
      institution: { type: InstitutionType.COURT_OF_APPEALS },
    }
    const sentSummons = {
      ...summons,
      confirmedDate: new Date('2026-06-05T09:15:00.000Z'),
      sentToCourtOfAppealsDate: new Date('2026-06-10T10:00:00.000Z'),
    } as AppealSummons

    await appealSummonsController.getPdf(
      caseId,
      summonsId,
      theCase,
      sentSummons,
      courtOfAppealsJudge as never,
      res,
    )

    expect(mockPdfService.getAppealSummonsPdf).toHaveBeenCalledWith(
      theCase,
      courtOfAppealsJudge,
      sentSummons,
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

    const dto: PreviewAppealSummonsDto = {
      defendants: [
        {
          defendantId,
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

  it('keeps a withdrawn defendant when previewing an existing summons', async () => {
    const withdrawnDefendantId = uuid()
    const previewCase = {
      id: caseId,
      defendants: [
        { id: defendantId } as Defendant,
        { id: withdrawnDefendantId } as Defendant,
      ],
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
        ],
      },
    } as Case
    const existingSummons = {
      id: summonsId,
      defendants: [
        {
          defendantId: withdrawnDefendantId,
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims: 'Old claims',
        },
      ],
    } as AppealSummons
    ;(
      mockAppealSummonsRepositoryService.findByIdAndCaseId as jest.Mock
    ).mockResolvedValueOnce(existingSummons)

    const dto: PreviewAppealSummonsDto = {
      appealSummonsId: summonsId,
      defendants: [
        {
          defendantId: withdrawnDefendantId,
          claims: 'Kept claims',
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
          defendantId: withdrawnDefendantId,
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims: 'Kept claims',
        },
      ],
    )
  })
})
