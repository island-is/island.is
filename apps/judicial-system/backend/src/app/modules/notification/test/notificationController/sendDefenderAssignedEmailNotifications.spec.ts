import { uuid } from 'uuidv4'

import { ConfigType } from '@island.is/nest/config'
import { EmailService } from '@island.is/email-service'
import { NotificationType, User } from '@island.is/judicial-system/types'
import { DEFENDER_ROUTE } from '@island.is/judicial-system/consts'

import { createTestingNotificationModule } from '../createTestingNotificationModule'
import { Case } from '../../../case'
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
  user: User,
  theCase: Case,
  notification: SendNotificationDto,
) => Promise<Then>

describe('NotificationController - Send defender assigned notifications', () => {
  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      notificationController,
      notificationConfig,
      notificationModel,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockConfig = notificationConfig
    mockNotificationModel = notificationModel

    const mockFindAll = mockNotificationModel.findAll as jest.Mock
    mockFindAll.mockResolvedValue([])

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
      notification: SendNotificationDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await notificationController.sendCaseNotification(
          caseId,
          user,
          theCase,
          notification,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('when sending defender assigned notifications', () => {
    const notification: SendNotificationDto = {
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()
    const court = { name: 'Héraðsdómur Reykjavíkur' } as Case['court']
    const theCase = {
      id: caseId,
      court,
      courtCaseNumber: 'S-123/2022',
      defenderNationalId: '1234567890',
      defenderEmail: 'recipient@gmail.com',
      defenderName: 'John Doe',
    } as Case
    const user = {} as User

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, notification)
    })

    it('should send correct email', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        from: {
          name: mockConfig.email.fromName,
          address: mockConfig.email.fromEmail,
        },
        to: [
          {
            name: theCase.defenderName,
            address: theCase.defenderEmail,
          },
        ],
        replyTo: {
          name: mockConfig.email.replyToName,
          address: mockConfig.email.replyToEmail,
        },
        attachments: undefined,
        subject: 'Héraðsdómur Reykjavíkur - aðgangur að málsgögnum',
        text: expect.anything(), // same as hmtl but stripped hmtl tags
        html: `Héraðsdómur Reykjavíkur hefur skipað þig verjanda í máli S-123/2022.<br /><br />Gögn málsins eru aðgengileg í <a href="${mockConfig.clientUrl}${DEFENDER_ROUTE}/${caseId}">Réttarvörslugátt</a> með rafrænum skilríkjum.`,
      })
    })
  })

  describe('when sending defender data is missing', () => {
    const notification: SendNotificationDto = {
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()
    const theCase = {} as Case
    const user = {} as User
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)
      then = await givenWhenThen(caseId, user, theCase, notification)
    })

    it('should not send notification', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(mockNotificationModel.create).not.toHaveBeenCalled()
      expect(then.result).toStrictEqual({ notificationSent: false })
    })
  })

  describe('record notification', () => {
    const notification: SendNotificationDto = {
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()
    const theCase = {
      id: caseId,
      defenderEmail: 'recipient@gmail.com',
      defenderNationalId: '1234567890',
      defenderName: 'Sibbi',
    } as Case
    const user = {} as User

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)
      await givenWhenThen(caseId, user, theCase, notification)
    })

    it('should record notfication', () => {
      expect(mockNotificationModel.create).toHaveBeenCalledTimes(1)
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId,
        type: notification.type,
        recipients: [
          {
            address: theCase.defenderEmail,
            success: true,
          },
        ],
      })
    })
  })

  describe('returns that the notification was sent', () => {
    const notification: SendNotificationDto = {
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()
    const theCase = {
      id: caseId,
      defenderEmail: 'recipient@gmail.com',
      defenderNationalId: '1234567890',
      defenderName: 'Sibbi',
    } as Case
    const user = {} as User
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)
      then = await givenWhenThen(caseId, user, theCase, notification)
    })

    it('should return notification was sent', () => {
      expect(then.result).toEqual(
        expect.objectContaining({ notificationSent: true }),
      )
    })
  })

  describe('only send notification once to defender', () => {
    const notification: SendNotificationDto = {
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()
    const theCase = {
      id: caseId,
      defenderEmail: 'recipient@gmail.com',
      defenderNationalId: '1234567890',
      defenderName: 'Sibbi',
    } as Case
    const user = {} as User
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)
      const mockFindAll = mockNotificationModel.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce([
        {
          caseId,
          type: notification.type,
          recipients: [{ address: theCase.defenderEmail, success: true }],
        } as Notification,
      ])

      then = await givenWhenThen(caseId, user, theCase, notification)
    })

    it('should return notification was not sent', () => {
      expect(mockNotificationModel.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual(
        expect.objectContaining({ notificationSent: false }),
      )
    })
  })
})
