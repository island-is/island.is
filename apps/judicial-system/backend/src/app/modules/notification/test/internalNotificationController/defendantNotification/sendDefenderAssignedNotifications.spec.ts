import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import { DEFENDER_INDICTMENT_CASE_ROUTE } from '@island.is/judicial-system/consts'
import {
  CaseType,
  DefendantNotificationType,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../../createTestingNotificationModule'

import {
  Case,
  Defendant,
  NotificationRepositoryService,
} from '../../../../repository'
import { DefendantNotificationDto } from '../../../dto/defendantNotification.dto'
import { DeliverResponse } from '../../../models/deliver.response'
import { notificationModuleConfig } from '../../../notification.config'

jest.mock('../../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  defendantId: string,
  theCase: Case,
  defendant: Defendant,
  notificationDto: DefendantNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send defender assigned notifications', () => {
  const caseId = uuid()
  const defendantId = uuid()

  const { defender } = createTestUsers(['defender'])
  const court = { name: 'Héraðsdómur Reykjavíkur' } as Case['court']

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let mockNotificationRepositoryService: NotificationRepositoryService
  let givenWhenThen: GivenWhenThen

  let defendantNotificationDTO: DefendantNotificationDto

  beforeEach(async () => {
    const {
      emailService,
      notificationConfig,
      internalNotificationController,
      notificationRepositoryService,
    } = await createTestingNotificationModule()

    defendantNotificationDTO = {
      type: DefendantNotificationType.DEFENDER_ASSIGNED,
    }

    mockEmailService = emailService
    mockConfig = notificationConfig
    mockNotificationRepositoryService = notificationRepositoryService

    givenWhenThen = async (
      caseId: string,
      defendantId: string,
      theCase: Case,
      defendant: Defendant,
      notificationDto: DefendantNotificationDto,
    ) => {
      const then = {} as Then

      try {
        then.result =
          await internalNotificationController.sendDefendantNotification(
            caseId,
            defendantId,
            theCase,
            defendant,
            notificationDto,
          )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('when sending defender assigned notification', () => {
    const defendant = {
      id: defendantId,
      defenderNationalId: '1234567890',
      defenderName: defender.name,
      defenderEmail: defender.email,
      isDefenderChoiceConfirmed: true,
    } as Defendant

    const theCase = {
      id: caseId,
      court,
      courtCaseNumber: 'R-123-456/2024',
      type: CaseType.INDICTMENT,
      defendants: [defendant],
    } as Case

    beforeEach(async () => {
      await givenWhenThen(
        caseId,
        defendantId,
        theCase,
        defendant,
        defendantNotificationDTO,
      )
    })

    it('should send a confirmed defender assigned notification with a link to the case', () => {
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
        subject: `Héraðsdómur Reykjavíkur - aðgangur að máli`,
        html: expect.stringContaining(DEFENDER_INDICTMENT_CASE_ROUTE),
        text: expect.stringContaining(
          'Héraðsdómur Reykjavíkur hefur skráð þig sem verjanda í máli R-123-456/2024',
        ),
      })
    })

    it('should record notification', () => {
      expect(mockNotificationRepositoryService.create).toHaveBeenCalledTimes(1)
      expect(mockNotificationRepositoryService.create).toHaveBeenCalledWith({
        caseId,
        type: defendantNotificationDTO.type,
        recipients: [
          {
            address: defendant.defenderEmail,
            success: true,
          },
        ],
      })
    })
  })

  describe('when sending defender assigned notification to unconfirmed defender', () => {
    const defendant = {
      id: defendantId,
      defenderEmail: defender.email,
      isDefenderChoiceConfirmed: false,
    } as Defendant

    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [defendant],
    } as Case

    it('should not send a notification', async () => {
      await givenWhenThen(
        caseId,
        defendantId,
        theCase,
        defendant,
        defendantNotificationDTO,
      )

      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(0)
    })

    it('should not record notification', () => {
      expect(mockNotificationRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('when the case has no court name', () => {
    const defendant = {
      id: defendantId,
      defenderNationalId: '1234567890',
      defenderName: defender.name,
      defenderEmail: defender.email,
      isDefenderChoiceConfirmed: true,
    } as Defendant

    const theCase = {
      id: caseId,
      courtCaseNumber: 'R-123-456/2024',
      type: CaseType.INDICTMENT,
      defendants: [defendant],
    } as Case

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        caseId,
        defendantId,
        theCase,
        defendant,
        defendantNotificationDTO,
      )
    })

    it('should not send a notification and return a failed delivery', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(mockNotificationRepositoryService.create).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: false })
    })
  })

  describe('when sending defender assigned notification to defender without email', () => {
    const defendant = {
      id: defendantId,
      defenderName: 'Defender Name',
      isDefenderChoiceConfirmed: true,
    } as Defendant

    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [defendant],
    } as Case

    it('should not send a notification', async () => {
      await givenWhenThen(
        caseId,
        defendantId,
        theCase,
        defendant,
        defendantNotificationDTO,
      )

      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(0)
    })
  })
})
