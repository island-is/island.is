import { uuid } from 'uuidv4'

import { ConfigType } from '@island.is/nest/config'
import { EmailService } from '@island.is/email-service'
import {
  CaseDecision,
  CaseType,
  NotificationType,
} from '@island.is/judicial-system/types'
import {
  CLOSED_INDICTMENT_OVERVIEW_ROUTE,
  SIGNED_VERDICT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'

import { createTestingNotificationModule } from '../createTestingNotificationModule'
import { Case } from '../../../case'
import { Defendant, DefendantService } from '../../../defendant'
import { SendNotificationResponse } from '../../models/sendNotification.resopnse'
import { SendNotificationDto } from '../../dto/sendNotification.dto'
import { notificationModuleConfig } from '../../notification.config'
import { Notification } from '../../models/notification.model'

jest.mock('../../../factories')

interface Then {
  result: SendNotificationResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  notification: SendNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send ruling notifications', () => {
  const notification: SendNotificationDto = { type: NotificationType.RULING }

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let mockNotificationModel: typeof Notification
  let mockDefendantService: DefendantService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.PRISON_EMAIL = 'prisonEmail@email.com'
    const {
      emailService,
      notificationConfig,
      notificationModel,
      defendantService,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockConfig = notificationConfig
    mockNotificationModel = notificationModel
    mockDefendantService = defendantService

    const mockFindAll = mockNotificationModel.findAll as jest.Mock
    mockFindAll.mockResolvedValue([])

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = await internalNotificationController.sendCaseNotification(
          caseId,
          theCase,
          notification,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('email to prosecutor for indictment case', () => {
    const caseId = uuid()
    const prosecutor = { name: 'Lögmaður', email: 'logmadur@gmail.com' }
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      courtCaseNumber: '007-2022-07',
      court: { name: 'Héraðsdómur Reykjavíkur' },
      prosecutor,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notification)
    })

    it('should send email to prosecutor', () => {
      const expectedLink = `<a href="${mockConfig.clientUrl}${CLOSED_INDICTMENT_OVERVIEW_ROUTE}/${caseId}">`
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: 'Dómur í máli 007-2022-07',
          html: `Dómari hefur staðfestur dóm í máli 007-2022-07 hjá Héraðsdómi Reykjavíkur.<br /><br />Skjöl málsins eru aðengileg á ${expectedLink}yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
    })
  })

  describe('email to prosecutor for restriction case', () => {
    const caseId = uuid()
    const prosecutor = { name: 'Lögmaður', email: 'logmadur@gmail.com' }
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      courtCaseNumber: '007-2022-07',
      court: { name: 'Héraðsdómur Reykjavíkur' },
      prosecutor,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notification)
    })

    it('should send email to prosecutor', () => {
      const expectedLink = `<a href="${mockConfig.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${caseId}">`
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
      expect(mockEmailService.sendEmail).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: 'Úrskurður í máli 007-2022-07',
          html: `Dómari hefur undirritað og staðfest úrskurð í máli 007-2022-07 hjá Héraðsdómi Reykjavíkur.<br /><br />Skjöl málsins eru aðengileg á ${expectedLink}yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
    })
  })

  describe('email to prosecutor for modified ruling restriction case', () => {
    const caseId = uuid()
    const prosecutor = { name: 'Lögmaður', email: 'logmadur@gmail.com' }
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      courtCaseNumber: '007-2022-07',
      court: { name: 'Héraðsdómur Reykjavíkur' },
      rulingModifiedHistory: 'Some modified ruling',
      prosecutor,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notification)
    })

    it('should send email to prosecutor', () => {
      const expectedLink = `<a href="${mockConfig.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${caseId}">`
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
      expect(mockEmailService.sendEmail).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: 'Úrskurður í máli 007-2022-07 leiðrétt',
          html: `Dómari hefur leiðrétt úrskurð í máli 007-2022-07 hjá Héraðsdómi Reykjavíkur.<br /><br />Skjöl málsins eru aðengileg á ${expectedLink}yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
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
        decision,
        courtCaseNumber: '007-2022-07',
        rulingDate: new Date('2021-07-01'),
        defendants: [{ noNationalId: true }] as Defendant[],
      } as Case

      beforeEach(async () => {
        await givenWhenThen(caseId, theCase, notification)
      })

      it('should send email to prison', () => {
        expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(3)
        expect(mockEmailService.sendEmail).toHaveBeenNthCalledWith(
          3,
          expect.objectContaining({
            to: [
              {
                name: 'Gæsluvarðhaldsfangelsi',
                address: mockConfig.email.prisonEmail,
              },
            ],
            attachments: [
              {
                filename: 'Vistunarseðill 007-2022-07.pdf',
                content: expect.any(String),
                encoding: 'binary',
              },
              {
                filename: 'Þingbók 007-2022-07.pdf',
                content: expect.any(String),
                encoding: 'binary',
              },
            ],
            subject: 'Úrskurður um gæsluvarðhald',
            html: `Meðfylgjandi er vistunarseðill aðila sem var úrskurðaður í gæsluvarðhald í héraðsdómi 1. júlí 2021, auk þingbókar þar sem úrskurðarorðin koma fram.`,
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
      decision,
      courtCaseNumber: '007-2022-07',
      rulingDate: new Date('2021-07-01'),
      defendants: [{ noNationalId: true }] as Defendant[],
    } as Case

    beforeEach(async () => {
      const mockGetDefendantsActiveCases = mockDefendantService.isDefendantInActiveCustody as jest.MockedFunction<
        typeof mockDefendantService.isDefendantInActiveCustody
      >
      mockGetDefendantsActiveCases.mockResolvedValueOnce(false)
      await givenWhenThen(caseId, theCase, notification)
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
      decision: CaseDecision.ACCEPTING,
      courtCaseNumber: '007-2022-07',
      rulingDate: new Date('2021-07-01'),
      defendants: [{ nationalId: '0000000000' }],
    } as Case

    beforeEach(async () => {
      const mockGetDefendantsActiveCases = mockDefendantService.isDefendantInActiveCustody as jest.MockedFunction<
        typeof mockDefendantService.isDefendantInActiveCustody
      >
      mockGetDefendantsActiveCases.mockResolvedValueOnce(false)
      await givenWhenThen(caseId, theCase, notification)
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
      decision: CaseDecision.ACCEPTING,
      courtCaseNumber: '007-2022-07',
      rulingDate: new Date('2021-07-01'),
      defendants: [{ nationalId: '0000000000' }],
    } as Case

    beforeEach(async () => {
      const mockGetDefendantsActiveCases = mockDefendantService.isDefendantInActiveCustody as jest.MockedFunction<
        typeof mockDefendantService.isDefendantInActiveCustody
      >
      mockGetDefendantsActiveCases.mockResolvedValueOnce(true)
      await givenWhenThen(caseId, theCase, notification)
    })

    it('should send email to prison', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(3)
      expect(mockEmailService.sendEmail).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          to: [
            {
              name: 'Gæsluvarðhaldsfangelsi',
              address: mockConfig.email.prisonEmail,
            },
          ],
          attachments: [
            {
              filename: 'Vistunarseðill 007-2022-07.pdf',
              content: expect.any(String),
              encoding: 'binary',
            },
            {
              filename: 'Þingbók 007-2022-07.pdf',
              content: expect.any(String),
              encoding: 'binary',
            },
          ],
          subject: 'Úrskurður um vistun á viðeigandi stofnun',
          html: `Meðfylgjandi er vistunarseðill aðila sem var úrskurðaður í vistun á viðeigandi stofnun í héraðsdómi 1. júlí 2021, auk þingbókar þar sem úrskurðarorðin koma fram.`,
        }),
      )
    })
  })

  describe("Admission to facility - when defendant doesn't have nationalId", () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.ADMISSION_TO_FACILITY,
      decision: CaseDecision.ACCEPTING,
      courtCaseNumber: '007-2022-07',
      rulingDate: new Date('2021-07-01'),
      defendants: [{ noNationalId: true }] as Defendant[],
    } as Case

    beforeEach(async () => {
      const mockGetDefendantsActiveCases = mockDefendantService.isDefendantInActiveCustody as jest.MockedFunction<
        typeof mockDefendantService.isDefendantInActiveCustody
      >
      mockGetDefendantsActiveCases.mockResolvedValueOnce(false)
      await givenWhenThen(caseId, theCase, notification)
    })

    it('should send email to prison', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(3)
      expect(mockEmailService.sendEmail).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          to: [
            {
              name: 'Gæsluvarðhaldsfangelsi',
              address: mockConfig.email.prisonEmail,
            },
          ],
          attachments: [
            {
              filename: 'Vistunarseðill 007-2022-07.pdf',
              content: expect.any(String),
              encoding: 'binary',
            },
            {
              filename: 'Þingbók 007-2022-07.pdf',
              content: expect.any(String),
              encoding: 'binary',
            },
          ],
          subject: 'Úrskurður um vistun á viðeigandi stofnun',
          html: `Meðfylgjandi er vistunarseðill aðila sem var úrskurðaður í vistun á viðeigandi stofnun í héraðsdómi 1. júlí 2021, auk þingbókar þar sem úrskurðarorðin koma fram.`,
        }),
      )
    })
  })

  describe('Admission to facility - when checking if defendant is in custody failes', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.ADMISSION_TO_FACILITY,
      decision: CaseDecision.ACCEPTING,
      courtCaseNumber: '007-2022-07',
      rulingDate: new Date('2021-07-01'),
      defendants: [{ nationalId: '0000000000' }] as Defendant[],
    } as Case

    beforeEach(async () => {
      const mockGetDefendantsActiveCases = mockDefendantService.isDefendantInActiveCustody as jest.MockedFunction<
        typeof mockDefendantService.isDefendantInActiveCustody
      >
      mockGetDefendantsActiveCases.mockRejectedValue(new Error('Error'))
      await givenWhenThen(caseId, theCase, notification)
    })

    it('should send email to prison', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(3)
      expect(mockEmailService.sendEmail).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          to: [
            {
              name: 'Gæsluvarðhaldsfangelsi',
              address: mockConfig.email.prisonEmail,
            },
          ],
          attachments: [
            {
              filename: 'Vistunarseðill 007-2022-07.pdf',
              content: expect.any(String),
              encoding: 'binary',
            },
            {
              filename: 'Þingbók 007-2022-07.pdf',
              content: expect.any(String),
              encoding: 'binary',
            },
          ],
          subject: 'Úrskurður um vistun á viðeigandi stofnun',
          html: `Meðfylgjandi er vistunarseðill aðila sem var úrskurðaður í vistun á viðeigandi stofnun í héraðsdómi 1. júlí 2021, auk þingbókar þar sem úrskurðarorðin koma fram.`,
        }),
      )
    })
  })
})
