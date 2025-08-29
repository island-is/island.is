import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import { ROUTE_HANDLER_ROUTE } from '@island.is/judicial-system/consts'
import {
  CaseType,
  DefendantNotificationType,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../../createTestingNotificationModule'

import { Case, Defendant, Notification } from '../../../../repository'
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

describe('InternalNotificationController - Send defendant delegated defender choice notifications', () => {
  const caseId = uuid()
  const defendantId = uuid()

  const court = { name: 'Héraðsdómur Reykjavíkur' } as Case['court']

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  let defendantNotificationDTO: DefendantNotificationDto

  beforeEach(async () => {
    const {
      emailService,
      notificationConfig,
      internalNotificationController,
      notificationModel,
    } = await createTestingNotificationModule()

    defendantNotificationDTO = {
      type: DefendantNotificationType.DEFENDANT_DELEGATED_DEFENDER_CHOICE,
    }

    mockEmailService = emailService
    mockConfig = notificationConfig
    mockNotificationModel = notificationModel

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

  describe('when sending defendant delegated defender choice notification', () => {
    const defendant = {
      id: defendantId,
    } as Defendant

    const { registrar, judge } = createTestUsers(['registrar', 'judge'])

    const theCase = {
      id: caseId,
      court,
      courtCaseNumber: 'R-123-456/2024',
      type: CaseType.INDICTMENT,
      defendants: [defendant],
      judge: { name: judge.name, email: judge.email },
      registrar: { name: registrar.name, email: registrar.email },
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
      expect(mockEmailService.sendEmail).toBeCalledTimes(2)
      expect(mockEmailService.sendEmail).toBeCalledWith({
        from: {
          name: mockConfig.email.fromName,
          address: mockConfig.email.fromEmail,
        },
        to: [
          {
            name: judge.name,
            address: judge.email,
          },
        ],
        replyTo: {
          name: mockConfig.email.replyToName,
          address: mockConfig.email.replyToEmail,
        },
        attachments: undefined,
        subject: `Afstaða til verjanda í máli ${theCase.courtCaseNumber}`,
        html: expect.stringContaining(ROUTE_HANDLER_ROUTE),
        text: expect.stringContaining(
          'Afstaða: Ég fel dómara málsins að tilnefna og skipa mér verjanda.',
        ),
      })

      expect(mockEmailService.sendEmail).toBeCalledWith({
        from: {
          name: mockConfig.email.fromName,
          address: mockConfig.email.fromEmail,
        },
        to: [
          {
            name: registrar.name,
            address: registrar.email,
          },
        ],
        replyTo: {
          name: mockConfig.email.replyToName,
          address: mockConfig.email.replyToEmail,
        },
        attachments: undefined,
        subject: `Afstaða til verjanda í máli ${theCase.courtCaseNumber}`,
        html: expect.stringContaining(ROUTE_HANDLER_ROUTE),
        text: expect.stringContaining(
          'Afstaða: Ég fel dómara málsins að tilnefna og skipa mér verjanda.',
        ),
      })
    })

    it('should record notification', () => {
      expect(mockNotificationModel.create).toHaveBeenCalledTimes(1)
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId,
        type: defendantNotificationDTO.type,
        recipients: [
          {
            address: judge.email,
            success: true,
          },
          {
            address: registrar.email,
            success: true,
          },
        ],
      })
    })
  })
})
