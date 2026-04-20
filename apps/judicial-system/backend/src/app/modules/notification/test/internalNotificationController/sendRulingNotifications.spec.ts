import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import {
  CLOSED_INDICTMENT_OVERVIEW_ROUTE,
  SIGNED_VERDICT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseNotificationType,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { DefendantService } from '../../../defendant'
import { Case, Defendant } from '../../../repository'
import { CaseNotificationDto } from '../../dto/caseNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'

jest.mock('../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  notificationDto: CaseNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send ruling notifications', () => {
  const userId = uuid()
  const notificationDto: CaseNotificationDto = {
    user: { id: userId } as User,
    type: CaseNotificationType.RULING,
  }
  const { testProsecutor } = createTestUsers(['testProsecutor'])

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let mockDefendantService: DefendantService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.PRISON_EMAIL =
      'prisonEmail@omnitrix.is,prisonEmail2@omnitrix.is'

    const {
      emailService,
      notificationConfig,
      defendantService,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockConfig = notificationConfig
    mockDefendantService = defendantService

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = await internalNotificationController.sendCaseNotification(
          caseId,
          theCase,
          notificationDto,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('email to prosecutor for indictment case', () => {
    const caseId = uuid()

    const prosecutor = {
      name: testProsecutor.name,
      email: testProsecutor.email,
    }
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      courtCaseNumber: '007-2022-07',
      court: { name: 'Héraðsdómur Reykjavíkur' },
      indictmentRulingDecision: CaseIndictmentRulingDecision.MERGE,
      prosecutor,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should send email to prosecutor', () => {
      const expectedLink = `<a href="${mockConfig.clientUrl}${CLOSED_INDICTMENT_OVERVIEW_ROUTE}/${caseId}">`
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: 'Máli lokið 007-2022-07',
          html: `Máli 007-2022-07 hjá Héraðsdómi Reykjavíkur hefur verið lokið.<br /><br />Niðurstaða: Sameinað<br /><br />Skjöl málsins eru aðgengileg á ${expectedLink}yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
    })
  })

  describe('email to prosecutor for restriction case', () => {
    const caseId = uuid()
    const prosecutor = {
      name: testProsecutor.name,
      email: testProsecutor.email,
    }
    const theCase = {
      id: caseId,
      state: CaseState.ACCEPTED,
      type: CaseType.CUSTODY,
      courtCaseNumber: '007-2022-07',
      court: { name: 'Héraðsdómur Reykjavíkur' },
      prosecutor,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should send email to prosecutor', () => {
      const expectedLink = `<a href="${mockConfig.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${caseId}">`
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: 'Úrskurður í máli 007-2022-07',
          html: `Dómari hefur undirritað og staðfest úrskurð í máli 007-2022-07 hjá Héraðsdómi Reykjavíkur.<br /><br />Skjöl málsins eru aðgengileg á ${expectedLink}yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
    })
  })

  describe('email to prosecutor for modified ruling restriction case', () => {
    const caseId = uuid()
    const prosecutor = {
      name: testProsecutor.name,
      email: testProsecutor.email,
    }
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
      courtCaseNumber: '007-2022-07',
      court: { name: 'Héraðsdómur Reykjavíkur' },
      rulingModifiedHistory: 'Some modified ruling',
      prosecutor,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should send email to prosecutor', () => {
      const expectedLink = `<a href="${mockConfig.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${caseId}">`
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: testProsecutor.name, address: testProsecutor.email }],
          subject: 'Úrskurður í máli 007-2022-07 leiðréttur',
          html: `Dómari hefur leiðrétt úrskurð í máli 007-2022-07 hjá Héraðsdómi Reykjavíkur.<br /><br />Skjöl málsins eru aðgengileg á ${expectedLink}yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
    })
  })

  describe.each([CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY])(
    'Custody - when case descision is %s',
    (decision) => {
      const caseId = uuid()
      const theCase = {
        id: caseId,
        type: CaseType.CUSTODY,
        state: CaseState.ACCEPTED,
        decision,
        courtCaseNumber: '007-2022-07',
        rulingSignatureDate: new Date('2021-07-01'),
        defendants: [{ noNationalId: true }] as Defendant[],
        court: { name: 'Héraðsdómur Reykjavíkur' },
      } as Case

      beforeEach(async () => {
        await givenWhenThen(caseId, theCase, notificationDto)
      })

      it('should send email to prison', () => {
        const expectedLink = `<a href="${mockConfig.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${caseId}">`
        expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(3)
        expect(mockEmailService.sendEmail).toHaveBeenNthCalledWith(
          3,
          expect.objectContaining({
            to: [
              {
                name: 'Gæsluvarðhaldsfangelsi',
                address: mockConfig.email.prisonEmail.split(',')[0],
              },
            ],
            cc: mockConfig.email.prisonEmail.split(',').slice(1),

            subject: `Úrskurður í máli ${theCase.courtCaseNumber}`,
            html: `Héraðsdómur Reykjavíkur hefur úrskurðað aðila í gæsluvarðhald í þinghaldi sem lauk rétt í þessu. Hægt er að nálgast þingbók og vistunarseðil á ${expectedLink}yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
          }),
        )
      })
    },
  )

  describe.each([
    CaseDecision.REJECTING,
    CaseDecision.DISMISSING,
    CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
  ])('Custody - when case descision is %s', (decision) => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
      decision,
      courtCaseNumber: '007-2022-07',
      rulingSignatureDate: new Date('2021-07-01'),
      defendants: [{ noNationalId: true }] as Defendant[],
    } as Case

    beforeEach(async () => {
      const mockGetDefendantsActiveCases =
        mockDefendantService.isDefendantInActiveCustody as jest.MockedFunction<
          typeof mockDefendantService.isDefendantInActiveCustody
        >
      mockGetDefendantsActiveCases.mockResolvedValueOnce(false)
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should not send email to prison', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
    })
  })

  describe('Admission to facility - when defendant is not in custody', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.ADMISSION_TO_FACILITY,
      state: CaseState.ACCEPTED,
      decision: CaseDecision.ACCEPTING,
      courtCaseNumber: '007-2022-07',
      rulingSignatureDate: new Date('2021-07-01'),
      defendants: [{ nationalId: '0000000000' }],
    } as Case

    beforeEach(async () => {
      const mockGetDefendantsActiveCases =
        mockDefendantService.isDefendantInActiveCustody as jest.MockedFunction<
          typeof mockDefendantService.isDefendantInActiveCustody
        >
      mockGetDefendantsActiveCases.mockResolvedValueOnce(false)
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should not send email to prison', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
    })
  })

  describe('Admission to facility - when defendant is in active custody in another case', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.ADMISSION_TO_FACILITY,
      state: CaseState.ACCEPTED,
      decision: CaseDecision.ACCEPTING,
      courtCaseNumber: '007-2022-07',
      rulingSignatureDate: new Date('2021-07-01'),
      defendants: [{ nationalId: '0000000000' }],
      court: { name: 'Héraðsdómur Reykjavíkur' },
    } as Case

    beforeEach(async () => {
      const mockGetDefendantsActiveCases =
        mockDefendantService.isDefendantInActiveCustody as jest.MockedFunction<
          typeof mockDefendantService.isDefendantInActiveCustody
        >
      mockGetDefendantsActiveCases.mockResolvedValueOnce(true)
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should send email to prison', () => {
      const expectedLink = `<a href="${mockConfig.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${caseId}">`
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(3)
      expect(mockEmailService.sendEmail).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          to: [
            {
              name: 'Gæsluvarðhaldsfangelsi',
              address: mockConfig.email.prisonEmail.split(',')[0],
            },
          ],
          cc: mockConfig.email.prisonEmail.split(',').slice(1),
          subject: `Úrskurður í máli ${theCase.courtCaseNumber}`,
          html: `Héraðsdómur Reykjavíkur hefur úrskurðað aðila í vistun á viðeigandi stofnun í þinghaldi sem lauk rétt í þessu. Hægt er að nálgast þingbók og vistunarseðil á ${expectedLink}yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
    })
  })

  describe("Admission to facility - when defendant doesn't have nationalId", () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.ADMISSION_TO_FACILITY,
      state: CaseState.ACCEPTED,
      decision: CaseDecision.ACCEPTING,
      courtCaseNumber: '007-2022-07',
      rulingSignatureDate: new Date('2021-07-01'),
      defendants: [{ noNationalId: true }] as Defendant[],
      court: { name: 'Héraðsdómur Reykjavíkur' },
    } as Case

    beforeEach(async () => {
      const mockGetDefendantsActiveCases =
        mockDefendantService.isDefendantInActiveCustody as jest.MockedFunction<
          typeof mockDefendantService.isDefendantInActiveCustody
        >
      mockGetDefendantsActiveCases.mockResolvedValueOnce(false)
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should send email to prison', () => {
      const expectedLink = `<a href="${mockConfig.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${caseId}">`
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(3)
      expect(mockEmailService.sendEmail).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          to: [
            {
              name: 'Gæsluvarðhaldsfangelsi',
              address: mockConfig.email.prisonEmail.split(',')[0],
            },
          ],
          cc: mockConfig.email.prisonEmail.split(',').slice(1),
          subject: `Úrskurður í máli ${theCase.courtCaseNumber}`,
          html: `Héraðsdómur Reykjavíkur hefur úrskurðað aðila í vistun á viðeigandi stofnun í þinghaldi sem lauk rétt í þessu. Hægt er að nálgast þingbók og vistunarseðil á ${expectedLink}yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
    })
  })
})
