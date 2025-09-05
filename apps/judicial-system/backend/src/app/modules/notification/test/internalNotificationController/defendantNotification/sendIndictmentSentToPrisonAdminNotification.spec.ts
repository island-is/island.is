import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import { CASE_TABLE_GROUPS_ROUTE } from '@island.is/judicial-system/consts'
import {
  CaseType,
  DefendantNotificationType,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../../createTestingNotificationModule'

import { Case, Defendant, Notification } from '../../../../repository'
import { DefendantNotificationDto } from '../../../dto/defendantNotification.dto'
import { DeliverResponse } from '../../../models/deliver.response'

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

describe('InternalNotificationController - Defendant - Send indictment sent to prison admin notification', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const emails = [
    'prisonadminindictment@omnitrix.is',
    'prisonadminindictment2@omnitrix.is',
  ]

  let mockEmailService: EmailService
  let mockNotificationModel: typeof Notification
  let defendantNotificationDTO: DefendantNotificationDto

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.PRISON_ADMIN_INDICTMENT_EMAILS = emails.join(',')

    const { emailService, internalNotificationController, notificationModel } =
      await createTestingNotificationModule()

    defendantNotificationDTO = {
      type: DefendantNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN,
    }

    mockEmailService = emailService
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

  describe('when sending indictment to prison admin', () => {
    const defendant = {
      id: defendantId,
    } as Defendant

    const theCase = {
      id: caseId,
      courtCaseNumber: 'S-123-456/2024',
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

    it('should send a notification to prison admin emails', () => {
      expect(mockEmailService.sendEmail).toBeCalledTimes(emails.length)
      emails.forEach((email) => {
        expect(mockEmailService.sendEmail).toBeCalledWith(
          expect.objectContaining({
            to: [
              {
                name: 'Fangelsismálastofnun',
                address: email,
              },
            ],

            attachments: undefined,
            subject: `Mál S-123-456/2024 til fullnustu`,
            html: expect.stringContaining(CASE_TABLE_GROUPS_ROUTE),
            text: expect.stringContaining(
              'Ríkissaksóknari hefur sent mál S-123-456/2024 til fullnustu.',
            ),
          }),
        )
      })
    })

    it('should record notification', () => {
      expect(mockNotificationModel.create).toHaveBeenCalledTimes(1)
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId,
        type: defendantNotificationDTO.type,
        recipients: emails.map((email) => ({
          address: email,
          success: true,
        })),
      })
    })
  })
})
