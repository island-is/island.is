import { Response } from 'express'

import { NotFoundException } from '@nestjs/common'

import { RolesGuard } from '@island.is/judicial-system/auth'
import { AppealEventType } from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
} from '../../../../guards'
import { CaseExistsGuard } from '../../../case/guards/caseExists.guard'
import { CaseReadGuard } from '../../../case/guards/caseRead.guard'
import { CivilClaimantExistsGuard } from '../../../defendant/guards/civilClaimantExists.guard'
import { DefendantExistsGuard } from '../../../defendant/guards/defendantExists.guard'
import {
  AppealCase,
  AppealEventLog,
  Case,
  CivilClaimant,
  Defendant,
} from '../../../repository'
import { AppealCaseController } from '../../appealCase.controller'

const confirmation = (fields: Partial<AppealEventLog>): AppealEventLog =>
  ({
    eventType: AppealEventType.ADVOCATE_CONFIRMED,
    userName: 'Áslaug Björk Ingólfsdóttir',
    userTitle: 'aðstoðarmaður dómara',
    created: new Date('2026-08-13'),
    ...fields,
  } as AppealEventLog)

const defendant = {
  id: 'defendant-id',
  name: 'Gervimaður Jónsson',
  isAppealDefenderConfirmed: true,
  appealDefenderName: 'Þórður Már Jónsson',
} as Defendant

const civilClaimant = {
  id: 'civil-claimant-id',
  name: 'Jónína Jónsdóttir',
  isAppealSpokespersonConfirmed: true,
  appealSpokespersonName: 'Brynjar Sveinsson',
} as CivilClaimant

const theCase = {
  id: 'case-id',
  courtCaseNumber: 'S-4275/2025',
  court: { name: 'Héraðsdómur Reykjavíkur' },
  defendants: [defendant],
  civilClaimants: [civilClaimant],
  verdictAppealCase: {
    id: 'appeal-case-id',
    appealCaseNumber: '593/2026',
    appealEventLogs: [
      confirmation({ defendantId: defendant.id }),
      confirmation({ civilClaimantId: civilClaimant.id }),
    ],
  } as AppealCase,
} as Case

describe('AppealCaseController - get appeal appointment letter pdf', () => {
  const pdf = Buffer.from('%PDF-letter')

  let appealCaseController: AppealCaseController
  let mockGetPdf: jest.Mock
  let res: Response

  beforeEach(async () => {
    const { appealCaseController: controller, pdfService } =
      await createTestingAppealCaseModule()

    appealCaseController = controller
    mockGetPdf = pdfService.getAppealAppointmentLetterPdf as jest.Mock
    mockGetPdf.mockResolvedValue(pdf)
    res = { end: jest.fn() } as unknown as Response
  })

  it('writes the defender letter to the response', async () => {
    await appealCaseController.getDefenderAppointmentLetterPdf(
      theCase.id,
      defendant.id,
      theCase,
      defendant,
      res,
    )

    expect(mockGetPdf).toHaveBeenCalledWith(
      expect.objectContaining({ advocateName: 'Þórður Már Jónsson' }),
    )
    expect(res.end).toHaveBeenCalledWith(pdf)
  })

  it('writes the spokesperson letter to the response', async () => {
    await appealCaseController.getSpokespersonAppointmentLetterPdf(
      theCase.id,
      civilClaimant.id,
      theCase,
      civilClaimant,
      res,
    )

    expect(mockGetPdf).toHaveBeenCalledWith(
      expect.objectContaining({ advocateName: 'Brynjar Sveinsson' }),
    )
    expect(res.end).toHaveBeenCalledWith(pdf)
  })

  // The screen only offers the row for a confirmed advocate, but the route is
  // a link anyone with the case open can follow.
  it('refuses when there is no letter to write', async () => {
    await expect(
      appealCaseController.getDefenderAppointmentLetterPdf(
        theCase.id,
        defendant.id,
        theCase,
        { ...defendant, isAppealDefenderConfirmed: false } as Defendant,
        res,
      ),
    ).rejects.toBeInstanceOf(NotFoundException)

    expect(res.end).not.toHaveBeenCalled()
  })
})

// The court of appeals is the only reader of its own letter, and the route it
// was modelled on - the verdict service certificate - carries no court of
// appeals rule at all, so getting this wrong would be invisible: the specs
// above call the handler directly and never consult a guard.
describe('AppealCaseController - appointment letter access', () => {
  describe.each([
    [
      'defender',
      AppealCaseController.prototype.getDefenderAppointmentLetterPdf,
      DefendantExistsGuard,
    ],
    [
      'spokesperson',
      AppealCaseController.prototype.getSpokespersonAppointmentLetterPdf,
      CivilClaimantExistsGuard,
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ])('the %s letter', (_name, handler, partyGuard: any) => {
    it('is open to the court of appeals and nobody else', () => {
      const rules = Reflect.getMetadata('roles-rules', handler)

      expect(rules).toEqual([
        courtOfAppealsJudgeRule,
        courtOfAppealsRegistrarRule,
        courtOfAppealsAssistantRule,
      ])
    })

    it('resolves the case and the party, and checks read access', () => {
      expect(Reflect.getMetadata('__guards__', handler)).toEqual([
        CaseExistsGuard,
        RolesGuard,
        CaseReadGuard,
        partyGuard,
      ])
    })
  })
})
