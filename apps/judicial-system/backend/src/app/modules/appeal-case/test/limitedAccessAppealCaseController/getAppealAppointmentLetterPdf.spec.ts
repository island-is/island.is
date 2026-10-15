import { Response } from 'express'

import { NotFoundException } from '@nestjs/common'

import { RolesGuard } from '@island.is/judicial-system/auth'
import {
  AppealEventType,
  indictmentCases,
} from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import { defenderRule } from '../../../../guards'
import { verifyGuards, verifyRolesRules } from '../../../../test'
import { CaseReadGuard } from '../../../case/guards/caseRead.guard'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { LimitedAccessCaseExistsGuard } from '../../../case/guards/limitedAccessCaseExists.guard'
import { CivilClaimantExistsGuard } from '../../../defendant/guards/civilClaimantExists.guard'
import { DefendantExistsGuard } from '../../../defendant/guards/defendantExists.guard'
import {
  AppealCase,
  AppealEventLog,
  Case,
  CivilClaimant,
  Defendant,
} from '../../../repository'
import { DefenceAdvocateOfPartyGuard } from '../../guards/defenceAdvocateOfParty.guard'
import { LimitedAccessAppealCaseController } from '../../limitedAccessAppealCase.controller'

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
  appealDefenderNationalId: '0101302989',
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

// The letter itself is assembled by the service the court of appeals' own
// route uses, and is covered there; what is left here is that the limited
// access route reaches the same letter.
describe('LimitedAccessAppealCaseController - get appeal appointment letter pdf', () => {
  const pdf = Buffer.from('%PDF-letter')

  let controller: LimitedAccessAppealCaseController
  let mockGetPdf: jest.Mock
  let res: Response

  beforeEach(async () => {
    const {
      limitedAccessAppealCaseController,
      pdfService,
      lawyerRegistryService,
    } = await createTestingAppealCaseModule()

    controller = limitedAccessAppealCaseController
    mockGetPdf = pdfService.getAppealAppointmentLetterPdf as jest.Mock
    mockGetPdf.mockResolvedValue(pdf)
    ;(lawyerRegistryService.getByNationalId as jest.Mock).mockResolvedValue({
      practice: 'Vivos lögmenn',
    })
    res = { end: jest.fn() } as unknown as Response
  })

  it('writes the defender letter to the response', async () => {
    await controller.getDefenderAppointmentLetterPdf(
      theCase.id,
      defendant.id,
      theCase,
      defendant,
      res,
    )

    expect(mockGetPdf).toHaveBeenCalledWith(
      expect.objectContaining({
        advocateName: 'Þórður Már Jónsson',
        advocatePractice: 'Vivos lögmenn',
      }),
    )
    expect(res.end).toHaveBeenCalledWith(pdf)
  })

  it('writes the spokesperson letter to the response', async () => {
    await controller.getSpokespersonAppointmentLetterPdf(
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

  it('refuses when there is no letter to write', async () => {
    await expect(
      controller.getDefenderAppointmentLetterPdf(
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

// A defence user holds the case through the district court's confirmation,
// which the read guard checks; the party guard then keeps them to their own
// client's letter. Both are skipped when the handler is called directly, so
// the chain is pinned here.
describe('LimitedAccessAppealCaseController - appointment letter access', () => {
  describe('the defender letter', () => {
    verifyGuards(
      LimitedAccessAppealCaseController,
      'getDefenderAppointmentLetterPdf',
      [
        LimitedAccessCaseExistsGuard,
        RolesGuard,
        CaseTypeGuard,
        CaseReadGuard,
        DefendantExistsGuard,
        DefenceAdvocateOfPartyGuard,
      ],
      [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
    )

    verifyRolesRules(
      LimitedAccessAppealCaseController,
      'getDefenderAppointmentLetterPdf',
      [defenderRule],
    )
  })

  describe('the spokesperson letter', () => {
    verifyGuards(
      LimitedAccessAppealCaseController,
      'getSpokespersonAppointmentLetterPdf',
      [
        LimitedAccessCaseExistsGuard,
        RolesGuard,
        CaseTypeGuard,
        CaseReadGuard,
        CivilClaimantExistsGuard,
        DefenceAdvocateOfPartyGuard,
      ],
      [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
    )

    verifyRolesRules(
      LimitedAccessAppealCaseController,
      'getSpokespersonAppointmentLetterPdf',
      [defenderRule],
    )
  })
})
