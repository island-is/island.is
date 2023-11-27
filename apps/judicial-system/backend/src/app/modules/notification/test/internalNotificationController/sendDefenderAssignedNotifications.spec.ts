import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import {
  DEFENDER_INDICTMENT_ROUTE,
  DEFENDER_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  CaseType,
  Defendant,
  NotificationType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../case'
import { SendInternalNotificationDto } from '../../dto/sendInternalNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { Notification } from '../../models/notification.model'
import { notificationModuleConfig } from '../../notification.config'

jest.mock('../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  notificationDto: SendInternalNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send defender assigned notifications', () => {
  const userId = uuid()
  const court = { name: 'Héraðsdómur Reykjavíkur' } as Case['court']

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      notificationConfig,
      notificationModel,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockConfig = notificationConfig
    mockNotificationModel = notificationModel

    const mockFindAll = mockNotificationModel.findAll as jest.Mock
    mockFindAll.mockResolvedValue([])

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      notificationDto: SendInternalNotificationDto,
    ) => {
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

  describe('when sending defender assigned notifications', () => {
    const notificationDto: SendInternalNotificationDto = {
      user: { id: userId } as User,
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()
    const defendant = {
      defenderNationalId: '1234567890',
      defenderEmail: 'recipient@gmail.com',
      defenderName: 'John Doe',
    }
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      court,
      courtCaseNumber: 'S-123/2022',
      defendants: [defendant],
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDto)
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
            name: defendant.defenderName,
            address: defendant.defenderEmail,
          },
        ],
        replyTo: {
          name: mockConfig.email.replyToName,
          address: mockConfig.email.replyToEmail,
        },
        attachments: undefined,
        subject: 'Héraðsdómur Reykjavíkur - aðgangur að málsgögnum',
        text: expect.anything(), // same as hmtl but stripped hmtl tags
        html: `Héraðsdómur Reykjavíkur hefur skráð þig verjanda í máli ${theCase.courtCaseNumber}.<br /><br />Gögn málsins eru aðgengileg á <a href="${mockConfig.clientUrl}${DEFENDER_INDICTMENT_ROUTE}/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
      })
    })
  })

  describe('when sending defender data is missing', () => {
    const notificationDto: SendInternalNotificationDto = {
      user: { id: userId } as User,
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()
    const theCase = {
      type: CaseType.INDICTMENT,
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)
      then = await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should not send notification', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(mockNotificationModel.create).not.toHaveBeenCalled()
      expect(then.result).toStrictEqual({ delivered: true })
    })
  })

  describe('record notification', () => {
    const notificationDto: SendInternalNotificationDto = {
      user: { id: userId } as User,
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()
    const defendant = {
      defenderEmail: 'recipient@gmail.com',
      defenderNationalId: '1234567890',
      defenderName: 'Sibbi',
    }
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [defendant],
    } as Case

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should record notfication', () => {
      expect(mockNotificationModel.create).toHaveBeenCalledTimes(1)
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId,
        type: notificationDto.type,
        recipients: [
          {
            address: defendant.defenderEmail,
            success: true,
          },
        ],
      })
    })
  })

  describe('returns that the notification was sent', () => {
    const notificationDto: SendInternalNotificationDto = {
      user: { id: userId } as User,
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [
        {
          defenderEmail: 'recipient@gmail.com',
          defenderNationalId: '1234567890',
          defenderName: 'Sibbi',
        },
      ],
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)
      then = await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should return notification was sent', () => {
      expect(then.result).toEqual(expect.objectContaining({ delivered: true }))
    })
  })

  describe('only send notification once to defender', () => {
    const notificationDto: SendInternalNotificationDto = {
      user: { id: userId } as User,
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()
    const defendant = {
      defenderEmail: 'recipient@gmail.com',
      defenderNationalId: '1234567890',
      defenderName: 'Sibbi',
    }
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [defendant],
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)
      const mockFindAll = mockNotificationModel.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce([
        {
          caseId,
          type: notificationDto.type,
          recipients: [{ address: defendant.defenderEmail, success: true }],
        } as Notification,
      ])

      then = await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should return notification was not sent', () => {
      expect(mockNotificationModel.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual(expect.objectContaining({ delivered: true }))
    })
  })

  describe('should send email to every defender', () => {
    const notificationDto: SendInternalNotificationDto = {
      user: { id: userId } as User,
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()
    const defender1 = { defenderEmail: 'some-email@island.is' } as Defendant
    const defender2 = { defenderEmail: 'other-email@island.is' } as Defendant
    const defendants = [defender1, defender2] as Defendant[] | undefined
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants,
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)
      then = await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should return notification was sent', () => {
      expect(mockNotificationModel.create).toHaveBeenCalled()
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
      expect(then.result).toEqual(expect.objectContaining({ delivered: true }))
    })
  })

  describe('should only send one email to each defender', () => {
    const notificationDto: SendInternalNotificationDto = {
      user: { id: userId } as User,
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()
    const defender1 = {
      defenderNationalId: '1234567890',
      defenderEmail: 'some-email@island.is',
      defenderName: 'Saul',
    } as Defendant
    const defendants = [defender1, defender1] as Defendant[] | undefined
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants,
      court,
      courtCaseNumber: 'S-123/2022',
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)
      then = await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should return notification was sent', () => {
      expect(mockNotificationModel.create).toHaveBeenCalled()
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        from: {
          name: mockConfig.email.fromName,
          address: mockConfig.email.fromEmail,
        },
        to: [
          {
            name: defender1.defenderName,
            address: defender1.defenderEmail,
          },
        ],
        replyTo: {
          name: mockConfig.email.replyToName,
          address: mockConfig.email.replyToEmail,
        },
        attachments: undefined,
        subject: 'Héraðsdómur Reykjavíkur - aðgangur að málsgögnum',
        text: expect.anything(), // same as hmtl but stripped hmtl tags
        html: `Héraðsdómur Reykjavíkur hefur skráð þig verjanda í máli ${theCase.courtCaseNumber}.<br /><br />Gögn málsins eru aðgengileg á <a href="${mockConfig.clientUrl}${DEFENDER_INDICTMENT_ROUTE}/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
      })
      expect(then.result).toEqual(expect.objectContaining({ delivered: true }))
    })
  })

  describe('when sending assigned defender notifications in a restriction case', () => {
    const notificationDto: SendInternalNotificationDto = {
      user: { id: userId } as User,
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()

    const theCase = {
      id: caseId,
      type: CaseType.ADMISSION_TO_FACILITY,
      court,
      courtCaseNumber: 'R-123/2022',
      defenderEmail: 'recipient@gmail.com',
      defenderName: 'John Doe',
      defenderNationalId: '1234567890',
      courtDate: new Date(),
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should send email with link', () => {
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
        subject: `Yfirlit máls ${theCase.courtCaseNumber}`,
        text: expect.anything(),
        html: `Héraðsdómur Reykjavíkur hefur skráð þig sem verjanda/talsmann sakbornings í máli ${theCase.courtCaseNumber}.<br /><br />Þú getur nálgast yfirlit málsins á <a href="${mockConfig.clientUrl}${DEFENDER_ROUTE}/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
      })
    })
  })

  describe('when sending assigned defender without national id notifications in a restriction case', () => {
    const notificationDto: SendInternalNotificationDto = {
      user: { id: userId } as User,
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()

    const theCase = {
      id: caseId,
      type: CaseType.ADMISSION_TO_FACILITY,
      court,
      courtCaseNumber: 'R-123/2022',
      defenderEmail: 'recipient@gmail.com',
      defenderName: 'John Doe',
      courtDate: new Date(),
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should send an email without a link', () => {
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
        subject: `Yfirlit máls ${theCase.courtCaseNumber}`,
        text: expect.anything(),
        html: `Héraðsdómur Reykjavíkur hefur skráð þig sem verjanda/talsmann sakbornings í máli ${theCase.courtCaseNumber}.<br /><br />Þú getur nálgast yfirlit málsins hjá Héraðsdómi Reykjavíkur ef það hefur ekki þegar verið afhent.`,
      })
    })
  })

  describe('when sending notifications in an investigation case', () => {
    const notificationDto: SendInternalNotificationDto = {
      user: { id: userId } as User,
      type: NotificationType.DEFENDER_ASSIGNED,
    }
    const caseId = uuid()

    const theCase = {
      id: caseId,
      type: CaseType.PHONE_TAPPING,
      court,
      courtCaseNumber: 'R-123/2022',
      defenderEmail: 'recipient@gmail.com',
      defenderName: 'John Doe',
      courtDate: new Date(),
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should not send email', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(0)
    })
  })
})
