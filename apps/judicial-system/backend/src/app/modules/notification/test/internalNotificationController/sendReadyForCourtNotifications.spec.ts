import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'
import { SmsService } from '@island.is/nova-sms'

import {
  DEFENDER_ROUTE,
  INDICTMENTS_COURT_OVERVIEW_ROUTE,
  RESTRICTION_CASE_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  CaseNotificationType,
  CaseState,
  CaseType,
  DateType,
  IndictmentSubtype,
  NotificationType,
  RequestSharedWithDefender,
  User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { randomDate } from '../../../../test'
import { Case, Institution, Notification, Recipient } from '../../../repository'
import { CaseNotificationDto } from '../../dto/caseNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  notificationDto: CaseNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send ready for court notifications for restriction and investigation cases', () => {
  const userId = uuid()
  const caseId = uuid()
  const policeCaseNumber = uuid()
  const courtCaseNumber = uuid()

  const { prosecutor, defender, testCourt } = createTestUsers([
    'prosecutor',
    'defender',
    'testCourt',
  ])

  const theCase = {
    id: caseId,
    type: CaseType.CUSTODY,
    state: CaseState.RECEIVED,
    policeCaseNumbers: [policeCaseNumber],
    prosecutor: {
      name: prosecutor.name,
      email: prosecutor.email,
    },
    courtId: testCourt.id,
    court: { name: 'Héraðsdómur Reykjavíkur' },
    courtCaseNumber,
    defenderNationalId: defender.nationalId,
    defenderName: defender.name,
    defenderEmail: defender.email,
    requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
    prosecutorsOffice: { name: 'Héraðsdómur Derricks' },
    dateLogs: [{ date: randomDate(), dateType: DateType.ARRAIGNMENT_DATE }],
  } as Case
  const notificationDto = {
    user: { id: userId } as User,
    type: CaseNotificationType.READY_FOR_COURT,
  }

  let mockEmailService: EmailService
  let mockSmsService: SmsService
  let mockNotificationConfig: ConfigType<typeof notificationModuleConfig>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_MOBILE_NUMBERS = `{"${testCourt.id}": "${testCourt.mobile}"}`

    const {
      emailService,
      smsService,
      notificationConfig,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockSmsService = smsService
    mockNotificationConfig = notificationConfig

    givenWhenThen = async (caseId, theCase, notificationDto) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(caseId, theCase, notificationDto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('first notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should send ready for court email notification to prosecutor', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        from: {
          name: mockNotificationConfig.email.fromName,
          address: mockNotificationConfig.email.fromEmail,
        },
        replyTo: {
          name: mockNotificationConfig.email.replyToName,
          address: mockNotificationConfig.email.replyToEmail,
        },
        to: [{ name: prosecutor.name, address: prosecutor.email }],
        subject: 'Krafa um gæsluvarðhald send',
        text: `Þú hefur sent kröfu á Héraðsdóm Reykjavíkur vegna LÖKE máls ${policeCaseNumber}. Skjalið er aðgengilegt undir málinu í Réttarvörslugátt.`,
        html: `Þú hefur sent kröfu á Héraðsdóm Reykjavíkur vegna LÖKE máls ${policeCaseNumber}. Skjalið er aðgengilegt undir <a href="${mockNotificationConfig.clientUrl}${RESTRICTION_CASE_OVERVIEW_ROUTE}/${caseId}">málinu í Réttarvörslugátt</a>.`,
        attachments: undefined,
      })
    })

    it('should send ready for court sms notification to court', () => {
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [testCourt.mobile],
        `Gæsluvarðhaldskrafa tilbúin til afgreiðslu. Sækjandi: ${prosecutor.name} (Héraðsdómur Derricks). Sjá nánar á rettarvorslugatt.island.is.`,
      )
    })

    it('succeed', () => {
      expect(then.result.delivered).toBe(true)
    })
  })

  describe('subsequent notifications', () => {
    beforeEach(async () => {
      await givenWhenThen(
        caseId,
        {
          ...theCase,
          notifications: [
            {
              caseId,
              type: NotificationType.READY_FOR_COURT,
              recipients: [
                {
                  address:
                    mockNotificationConfig.sms.courtsMobileNumbers[
                      testCourt.id
                    ],
                  success: true,
                },
              ],
            },
          ],
        } as Case,
        notificationDto,
      )
    })

    it('should send ready for court email notification to prosecutor', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        from: {
          name: mockNotificationConfig.email.fromName,
          address: mockNotificationConfig.email.fromEmail,
        },
        replyTo: {
          name: mockNotificationConfig.email.replyToName,
          address: mockNotificationConfig.email.replyToEmail,
        },
        to: [{ name: prosecutor.name, address: prosecutor.email }],
        subject: 'Krafa um gæsluvarðhald send',
        text: `Þú hefur sent kröfu á Héraðsdóm Reykjavíkur vegna LÖKE máls ${policeCaseNumber}. Skjalið er aðgengilegt undir málinu í Réttarvörslugátt.`,
        html: `Þú hefur sent kröfu á Héraðsdóm Reykjavíkur vegna LÖKE máls ${policeCaseNumber}. Skjalið er aðgengilegt undir <a href="${mockNotificationConfig.clientUrl}${RESTRICTION_CASE_OVERVIEW_ROUTE}/${caseId}">málinu í Réttarvörslugátt</a>.`,
        attachments: undefined,
      })
    })

    it('should send ready for court sms notification to court', () => {
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [testCourt.mobile],
        `Sækjandi í máli ${courtCaseNumber} hefur breytt kröfunni og sent aftur á héraðsdómstól. Nýtt kröfuskjal hefur verið vistað í Auði. Sjá nánar á rettarvorslugatt.island.is.`,
      )
    })

    it('should not send ready for court email notification to defender', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
        }),
      )
    })
  })

  describe('defender receives notification if request is shared when case is ready for court', () => {
    beforeEach(async () => {
      theCase.requestSharedWithDefender =
        RequestSharedWithDefender.READY_FOR_COURT
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should send ready for court email notification to defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          subject: `Krafa í máli ${policeCaseNumber}`,
          html: `Sækjandi hefur valið að deila kröfu með þér sem verjanda varnaraðila í máli ${policeCaseNumber}.<br /><br />Þú getur nálgast málið á <a href="${mockNotificationConfig.clientUrl}${DEFENDER_ROUTE}/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
          attachments: undefined,
        }),
      )
    })
  })

  describe('defender notification', () => {
    beforeEach(async () => {
      await givenWhenThen(
        caseId,
        {
          ...theCase,
          notifications: [
            {
              type: NotificationType.READY_FOR_COURT,
              recipients: [{ address: defender.email, success: true }],
            },
          ],
        } as Case,
        notificationDto,
      )
    })

    it('should send ready for court email updated notification to defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          from: {
            name: mockNotificationConfig.email.fromName,
            address: mockNotificationConfig.email.fromEmail,
          },
          replyTo: {
            name: mockNotificationConfig.email.replyToName,
            address: mockNotificationConfig.email.replyToEmail,
          },
          to: [{ name: defender.name, address: defender.email }],
          subject: `Krafa í máli ${courtCaseNumber}`,
          html: `Sækjandi í máli ${courtCaseNumber} hjá Héraðsdómi Reykjavíkur hefur breytt kröfunni og sent hana aftur á dóminn.<br /><br />Þú getur nálgast gögn málsins á <a href="${mockNotificationConfig.clientUrl}${DEFENDER_ROUTE}/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
          attachments: undefined,
        }),
      )
    })
  })
})

describe('InternalNotificationController - Send ready for court notifications for indictment cases', () => {
  const userId = uuid()
  const { testCourt } = createTestUsers(['testCourt'])

  const notificationDto = {
    user: { id: userId } as User,
    type: CaseNotificationType.READY_FOR_COURT,
  }

  let mockEmailService: EmailService
  let mockNotificationConfig: ConfigType<typeof notificationModuleConfig>
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_EMAILS = `{"${testCourt.id}": "${testCourt.email}"}`

    const {
      emailService,
      notificationConfig,
      notificationModel,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockNotificationModel = notificationModel
    mockNotificationConfig = notificationConfig

    givenWhenThen = async (caseId, theCase, notification) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(caseId, theCase, notification)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('indictment notification with single indictment subtype', () => {
    const caseId = uuid()
    const policeCaseNumbers = [uuid()]

    const court = {
      id: testCourt.id,
      name: 'Héraðsdómur Reykjavíkur',
    } as Institution
    const prosecutorsOffice = { name: 'Lögreglan á höfuðborgarsvæðinu' }

    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.RECEIVED,
      policeCaseNumbers,
      indictmentSubtypes: {
        [policeCaseNumbers[0]]: [IndictmentSubtype.MURDER],
      },
      courtId: court.id,
      court,
      prosecutorsOffice,
    } as unknown as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should send email to court', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Héraðsdómur Reykjavíkur',
              address: testCourt.email,
            },
          ],
          subject: 'Ákæra tilbúin til afgreiðslu',
          html: `Lögreglan á höfuðborgarsvæðinu hefur sent inn nýja ákæru. Ákæran varðar eftirfarandi brot: manndráp. Ákæran og öll skjöl málsins eru <a href="${mockNotificationConfig.clientUrl}${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${caseId}">aðgengileg í Réttarvörslugátt.</a>`,
        }),
      )
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId,
        type: CaseNotificationType.READY_FOR_COURT,
        recipients: [
          { success: true, address: testCourt.email },
        ] as Recipient[],
      })
    })
  })

  describe('indictment notification with multiple indictment subtype', () => {
    const caseId = uuid()
    const policeCaseNumbers = [uuid(), uuid()]
    const court = {
      id: testCourt.id,
      name: 'Héraðsdómur Reykjavíkur',
    } as Institution
    const prosecutorsOffice = { name: 'Lögreglan á höfuðborgarsvæðinu' }

    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.RECEIVED,
      policeCaseNumbers,
      indictmentSubtypes: {
        [policeCaseNumbers[0]]: [
          IndictmentSubtype.MURDER,
          IndictmentSubtype.LOOTING,
        ],
        [policeCaseNumbers[1]]: [
          IndictmentSubtype.MURDER,
          IndictmentSubtype.THEFT,
        ],
      },
      courtId: court.id,
      court,
      prosecutorsOffice,
    } as unknown as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should send email to court', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Héraðsdómur Reykjavíkur',
              address: testCourt.email,
            },
          ],
          subject: 'Ákæra tilbúin til afgreiðslu',
          html: `Lögreglan á höfuðborgarsvæðinu hefur sent inn nýja ákæru. Ákæran varðar eftirfarandi brot: manndráp, gripdeild og þjófnaður. Ákæran og öll skjöl málsins eru <a href="${mockNotificationConfig.clientUrl}${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${caseId}">aðgengileg í Réttarvörslugátt.</a>`,
        }),
      )
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId,
        type: CaseNotificationType.READY_FOR_COURT,
        recipients: [
          { success: true, address: testCourt.email },
        ] as Recipient[],
      })
    })
  })
})
