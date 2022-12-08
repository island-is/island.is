import format from 'date-fns/format'
import { uuid } from 'uuidv4'

import { ConfigType } from '@island.is/nest/config'
import { EmailService } from '@island.is/email-service'
import { SmsService } from '@island.is/nova-sms'
import {
  DEFENDER_ROUTE,
  RESTRICTION_CASE_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  User,
  NotificationType,
  CaseType,
  CaseState,
} from '@island.is/judicial-system/types'

import { randomDate } from '../../../../test'
import { nowFactory } from '../../../../factories'
import { CourtDocumentFolder, CourtService } from '../../../court'
import { Case } from '../../../case/models/case.model'
import { SendNotificationDto } from '../../dto/sendNotification.dto'
import { SendNotificationResponse } from '../../models/sendNotification.resopnse'
import { Notification } from '../../models/notification.model'
import { notificationModuleConfig } from '../../notification.config'
import { createTestingNotificationModule } from '../createTestingNotificationModule'

jest.mock('../../../../factories/date.factory')

interface Then {
  result: SendNotificationResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
  notification: SendNotificationDto,
) => Promise<Then>

describe('NotificationController - Send ready for court notifications', () => {
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
    sendRequestToDefender: true,
  } as Case
  const user = { id: uuid() } as User
  const notification = { type: NotificationType.READY_FOR_COURT }
  const now = randomDate()
  const courtMobileNumber = uuid()
  let mockEmailService: EmailService
  let mockSmsService: SmsService
  let mockCourtService: CourtService
  let mockNotificationConfig: ConfigType<typeof notificationModuleConfig>
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_MOBILE_NUMBERS = `{"${courtId}": "${courtMobileNumber}"}`

    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)

    const {
      emailService,
      smsService,
      courtService,
      notificationConfig,
      notificationModel,
      notificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockSmsService = smsService
    mockCourtService = courtService
    mockNotificationConfig = notificationConfig
    mockNotificationModel = notificationModel

    givenWhenThen = async (caseId, user, theCase, notification) => {
      const then = {} as Then

      await notificationController
        .sendCaseNotification(caseId, user, theCase, notification)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('first notification', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase, notification)
    })

    it('should lookup previous ready for court notifications', () => {
      expect(mockNotificationModel.findOne).toHaveBeenCalledWith({
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

    it('should upload request to court', () => {
      expect(mockCourtService.createDocument).toHaveBeenCalledWith(
        caseId,
        courtId,
        courtCaseNumber,
        CourtDocumentFolder.REQUEST_DOCUMENTS,
        `Krafa um gæsluvarðhald-${format(now, 'yyyy-MM-dd')}`,
        `Krafa um gæsluvarðhald-${format(now, 'yyyy-MM-dd')}.pdf`,
        'application/pdf',
        expect.any(Buffer),
        user,
      )
    })

    it('should send ready for court sms notification to court', () => {
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [courtMobileNumber],
        'Gæsluvarðhaldskrafa tilbúin til afgreiðslu. Sækjandi: Derrick (Héraðsdómur Derricks).',
      )
    })

    it('succeed', () => {
      expect(then.result.notificationSent).toBe(true)
    })
  })

  describe('subsequent notifications', () => {
    beforeEach(async () => {
      const mockFindOne = mockNotificationModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce({} as Notification)

      await givenWhenThen(caseId, user, theCase, notification)
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

    it('should upload request to court', () => {
      expect(mockCourtService.createDocument).toHaveBeenCalledWith(
        caseId,
        courtId,
        courtCaseNumber,
        CourtDocumentFolder.REQUEST_DOCUMENTS,
        `Krafa um gæsluvarðhald-${format(now, 'yyyy-MM-dd')}`,
        `Krafa um gæsluvarðhald-${format(now, 'yyyy-MM-dd')}.pdf`,
        'application/pdf',
        expect.any(Buffer),
        user,
      )
    })

    it('should send ready for court sms notification to court', () => {
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [courtMobileNumber],
        `Sækjandi í máli ${courtCaseNumber} hefur breytt kröfunni og sent aftur á héraðsdómstól. Nýtt kröfuskjal hefur verið vistað í Auði.`,
      )
    })

    it('should lookup previous court date notifications', () => {
      expect(mockNotificationModel.findAll).toHaveBeenCalledWith({
        where: { caseId, type: NotificationType.COURT_DATE },
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

  describe('defender notification', () => {
    beforeEach(async () => {
      const mockFindOne = mockNotificationModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce({} as Notification)
      const mockFindAll = mockNotificationModel.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce([
        { recipients: [{ name: 'Saul Goodman', address: '' }] },
      ])

      await givenWhenThen(caseId, user, theCase, notification)
    })

    it('should send ready for court email notification to defender', () => {
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
          html: `Sækjandi í máli ${courtCaseNumber} hjá Héraðsdómi Reykjavíkur hefur breytt kröfunni og sent hana aftur á dóminn.<br /><br />Þú getur nálgast gögn málsins í <a href="${mockNotificationConfig.clientUrl}${DEFENDER_ROUTE}/${caseId}">Réttarvörslugátt</a> með rafrænum skilríkjum.`,
          attachments: undefined,
        }),
      )
    })
  })
})
