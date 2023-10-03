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
  CaseState,
  CaseType,
  IndictmentSubtype,
  NotificationType,
  Recipient,
  RequestSharedWithDefender,
  User,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { randomDate } from '../../../../test'
import { Case } from '../../../case'
import { Institution } from '../../../institution/institution.model'
import { SendInternalNotificationDto } from '../../dto/sendInternalNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { Notification } from '../../models/notification.model'
import { notificationModuleConfig } from '../../notification.config'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  notificationDto: SendInternalNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send ready for court notifications for restriction and investigation cases', () => {
  const userId = uuid()
  const caseId = uuid()
  const policeCaseNumber = uuid()
  const courtId = uuid()
  const courtCaseNumber = uuid()
  const theCase = {
    id: caseId,
    type: CaseType.CUSTODY,
    state: CaseState.RECEIVED,
    policeCaseNumbers: [policeCaseNumber],
    prosecutor: {
      name: 'Derrick',
      email: 'derrick@dummy.is',
      institution: { name: 'Héraðsdómur Derricks' },
    },
    courtId,
    court: { name: 'Héraðsdómur Reykjavíkur' },
    courtCaseNumber,
    courtDate: randomDate(),
    defenderNationalId: uuid(),
    defenderName: 'Saul Goodman',
    defenderEmail: 'saul@dummy.is',
    requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
  } as Case
  const notificationDto = {
    user: { id: userId } as User,
    type: NotificationType.READY_FOR_COURT,
  }
  const courtMobileNumber = uuid()

  let mockEmailService: EmailService
  let mockSmsService: SmsService
  let mockNotificationConfig: ConfigType<typeof notificationModuleConfig>
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_MOBILE_NUMBERS = `{"${courtId}": "${courtMobileNumber}"}`

    const {
      emailService,
      smsService,
      notificationConfig,
      notificationModel,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockSmsService = smsService
    mockNotificationConfig = notificationConfig
    mockNotificationModel = notificationModel

    const mockFindAll = mockNotificationModel.findAll as jest.Mock
    mockFindAll.mockResolvedValue([])

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

    it('should lookup previous ready for court notifications', () => {
      expect(mockNotificationModel.findAll).toHaveBeenCalledWith({
        where: { caseId, type: NotificationType.READY_FOR_COURT },
      })
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
        to: [{ name: 'Derrick', address: 'derrick@dummy.is' }],
        subject: 'Krafa um gæsluvarðhald send',
        text: `Þú hefur sent kröfu á Héraðsdóm Reykjavíkur vegna LÖKE máls ${policeCaseNumber}. Skjalið er aðgengilegt undir málinu í Réttarvörslugátt.`,
        html: `Þú hefur sent kröfu á Héraðsdóm Reykjavíkur vegna LÖKE máls ${policeCaseNumber}. Skjalið er aðgengilegt undir <a href="${mockNotificationConfig.clientUrl}${RESTRICTION_CASE_OVERVIEW_ROUTE}/${caseId}">málinu í Réttarvörslugátt</a>.`,
        attachments: undefined,
      })
    })

    it('should send ready for court sms notification to court', () => {
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [courtMobileNumber],
        'Gæsluvarðhaldskrafa tilbúin til afgreiðslu. Sækjandi: Derrick (Héraðsdómur Derricks).',
      )
    })

    it('succeed', () => {
      expect(then.result.delivered).toBe(true)
    })
  })

  describe('subsequent notifications', () => {
    beforeEach(async () => {
      const mockFindOne = mockNotificationModel.findAll as jest.Mock
      mockFindOne.mockResolvedValueOnce([
        {
          caseId,
          type: NotificationType.READY_FOR_COURT,
          recipients: [
            {
              address: mockNotificationConfig.sms.courtsMobileNumbers[courtId],
              success: true,
            },
          ],
        },
      ])

      await givenWhenThen(caseId, theCase, notificationDto)
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
        to: [{ name: 'Derrick', address: 'derrick@dummy.is' }],
        subject: 'Krafa um gæsluvarðhald send',
        text: `Þú hefur sent kröfu á Héraðsdóm Reykjavíkur vegna LÖKE máls ${policeCaseNumber}. Skjalið er aðgengilegt undir málinu í Réttarvörslugátt.`,
        html: `Þú hefur sent kröfu á Héraðsdóm Reykjavíkur vegna LÖKE máls ${policeCaseNumber}. Skjalið er aðgengilegt undir <a href="${mockNotificationConfig.clientUrl}${RESTRICTION_CASE_OVERVIEW_ROUTE}/${caseId}">málinu í Réttarvörslugátt</a>.`,
        attachments: undefined,
      })
    })

    it('should send ready for court sms notification to court', () => {
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [courtMobileNumber],
        `Sækjandi í máli ${courtCaseNumber} hefur breytt kröfunni og sent aftur á héraðsdómstól. Nýtt kröfuskjal hefur verið vistað í Auði.`,
      )
    })

    it('should lookup previous court date notifications', () => {
      expect(mockNotificationModel.findAll).toHaveBeenCalledWith({
        where: {
          caseId,
          type: [NotificationType.READY_FOR_COURT, NotificationType.COURT_DATE],
        },
      })
    })

    it('should not send ready for court email notification to defender', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Saul Goodman', address: 'saul@dummy.is' }],
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
      const mockFindAll = mockNotificationModel.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce([]).mockResolvedValueOnce([
        {
          recipients: [
            { name: 'Saul Goodman', address: 'saul@dummy.is', success: true },
          ],
        },
      ])

      await givenWhenThen(caseId, theCase, notificationDto)
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
          to: [{ name: 'Saul Goodman', address: 'saul@dummy.is' }],
          subject: `Gögn í máli ${courtCaseNumber}`,
          html: `Sækjandi í máli ${courtCaseNumber} hjá Héraðsdómi Reykjavíkur hefur breytt kröfunni og sent hana aftur á dóminn.<br /><br />Þú getur nálgast gögn málsins á <a href="${mockNotificationConfig.clientUrl}${DEFENDER_ROUTE}/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
          attachments: undefined,
        }),
      )
    })
  })
})

describe('InternalNotificationController - Send ready for court notifications for indictment cases', () => {
  const userId = uuid()
  const courtId = uuid()
  const courtEmail = uuid()
  const notificationDto = {
    user: { id: userId } as User,
    type: NotificationType.READY_FOR_COURT,
  }

  let mockEmailService: EmailService
  let mockNotificationConfig: ConfigType<typeof notificationModuleConfig>
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_EMAILS = `{"${courtId}": "${courtEmail}"}`

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
      id: courtId,
      name: 'Héraðsdómur Reykjavíkur',
    } as Institution
    const prosecutor = {
      institution: { name: 'Lögreglan á höfuðborgarsvæðinu' },
    } as User

    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.RECEIVED,
      policeCaseNumbers,
      indictmentSubtypes: {
        [policeCaseNumbers[0]]: [IndictmentSubtype.MURDER],
      },
      courtId,
      court,
      prosecutor,
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
              address: courtEmail,
            },
          ],
          subject: 'Ákæra tilbúin til afgreiðslu',
          html: `Lögreglan á höfuðborgarsvæðinu hefur sent inn nýja ákæru. Ákæran varðar eftirfarandi brot: manndráp. Ákæran og öll skjöl málsins eru <a href="${mockNotificationConfig.clientUrl}${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${caseId}">aðgengileg í Réttarvörslugátt.</a>`,
        }),
      )
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId,
        type: NotificationType.READY_FOR_COURT,
        recipients: [{ success: true, address: courtEmail }] as Recipient[],
      })
    })
  })

  describe('indictment notification with multiple indictment subtype', () => {
    const caseId = uuid()
    const policeCaseNumbers = [uuid(), uuid()]
    const court = {
      id: courtId,
      name: 'Héraðsdómur Reykjavíkur',
    } as Institution
    const prosecutor = {
      institution: { name: 'Lögreglan á höfuðborgarsvæðinu' },
    } as User

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
      courtId,
      court,
      prosecutor,
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
              address: courtEmail,
            },
          ],
          subject: 'Ákæra tilbúin til afgreiðslu',
          html: `Lögreglan á höfuðborgarsvæðinu hefur sent inn nýja ákæru. Ákæran varðar eftirfarandi brot: manndráp, gripdeild og þjófnaður. Ákæran og öll skjöl málsins eru <a href="${mockNotificationConfig.clientUrl}${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${caseId}">aðgengileg í Réttarvörslugátt.</a>`,
        }),
      )
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId,
        type: NotificationType.READY_FOR_COURT,
        recipients: [{ success: true, address: courtEmail }] as Recipient[],
      })
    })
  })
})
