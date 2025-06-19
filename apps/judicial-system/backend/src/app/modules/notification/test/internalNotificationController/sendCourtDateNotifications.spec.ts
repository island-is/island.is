import { uuid } from 'uuidv4'

import { ConfigType } from '@nestjs/config'

import { EmailService } from '@island.is/email-service'

import {
  CaseNotificationType,
  CaseType,
  NotificationType,
  User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { Case } from '../../../case'
import { CaseNotificationDto } from '../../dto/caseNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { Notification } from '../../models/notification.model'
import { notificationModuleConfig } from '../../notification.config'

jest.mock('../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  notificationDto: CaseNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send court date notifications', () => {
  const userId = uuid()
  const userName = 'Test'
  const caseId = uuid()

  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = uuid()

  const { prosecutor, defender } = createTestUsers(['prosecutor', 'defender'])

  let mockConfig: ConfigType<typeof notificationModuleConfig>

  let mockEmailService: EmailService
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      internalNotificationController,
      notificationConfig,
      notificationModel,
    } = await createTestingNotificationModule()

    mockConfig = notificationConfig
    mockEmailService = emailService
    mockNotificationModel = notificationModel

    givenWhenThen = async (
      theCase: Case,
      notificationDto: CaseNotificationDto,
    ) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(caseId, theCase, notificationDto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('notification sent', () => {
    let then: Then

    const notificationDto: CaseNotificationDto = {
      user: { id: userId } as User,
      userDescriptor: { name: userName },
      type: CaseNotificationType.COURT_DATE,
    }

    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      prosecutor: { name: prosecutor.name, email: prosecutor.email },
      court: { name: courtName },
      courtCaseNumber,
      defenderName: defender.name,
      defenderEmail: defender.email,
    } as Case

    beforeEach(async () => {
      then = await givenWhenThen(theCase, notificationDto)
    })

    it('should send notifications to prosecutor and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Fyrirtaka í máli: ${courtCaseNumber}`,
          html: `Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um gæsluvarðhald.<br /><br />Fyrirtaka mun fara fram á ótilgreindum tíma.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari hefur ekki verið skráður.<br /><br />Verjandi sakbornings: ${defender.name}. Hægt er að nálgast yfirlitssíðu málsins í <a href="${mockConfig.clientUrl}">Réttarvörslugátt</a>.`,
        }),
      )

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Fyrirtaka í máli ${courtCaseNumber}`,
          html: `Héraðsdómur Reykjavíkur hefur boðað þig í fyrirtöku sem verjanda sakbornings.<br /><br />Fyrirtaka mun fara fram á ótilgreindum tíma.<br /><br />Málsnúmer: ${courtCaseNumber}.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari: .<br /><br />Sækjandi: ${prosecutor.name} ().`,
        }),
      )

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Yfirlit máls ${courtCaseNumber}`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('link not sent to defender', () => {
    let then: Then

    const notificationDto: CaseNotificationDto = {
      user: { id: userId } as User,
      userDescriptor: { name: userName },
      type: CaseNotificationType.COURT_DATE,
    }

    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      prosecutor: { name: prosecutor.name, email: prosecutor.email },
      court: { name: courtName },
      courtCaseNumber,
      defenderName: defender.name,
      defenderEmail: defender.email,
    } as Case

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)

      then = await givenWhenThen(
        {
          ...theCase,
          notifications: [
            {
              caseId,
              type: NotificationType.READY_FOR_COURT,
              recipients: [{ address: defender.email, success: true }],
            },
          ],
        } as Case,
        notificationDto,
      )
    })

    it('should not send link to case to defender', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Yfirlit máls ${courtCaseNumber}`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })
})
