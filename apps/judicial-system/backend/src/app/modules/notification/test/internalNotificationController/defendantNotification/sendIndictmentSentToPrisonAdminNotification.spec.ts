import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import { CASE_TABLE_GROUPS_ROUTE } from '@island.is/judicial-system/consts'
import {
  CaseType,
  DefendantNotificationType,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../../createTestingNotificationModule'

import {
  Case,
  Defendant,
  NotificationRepositoryService,
} from '../../../../repository'
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

  let mockEmailService: EmailService
  let mockNotificationRepositoryService: NotificationRepositoryService
  let defendantNotificationDTO: DefendantNotificationDto

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      internalNotificationController,
      notificationRepositoryService,
      institutionContactRepositoryService,
    } = await createTestingNotificationModule()

    const getInstitutionContactMock = jest.mocked(
      institutionContactRepositoryService.getInstitutionContact,
    )

    getInstitutionContactMock.mockResolvedValue('extra@omnitrix.is')

    defendantNotificationDTO = {
      type: DefendantNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN,
    }

    mockEmailService = emailService
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
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Fangelsismálastofnun',
              address: 'extra@omnitrix.is',
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

    it('should record notification', () => {
      expect(mockNotificationRepositoryService.create).toHaveBeenCalledTimes(1)
      expect(mockNotificationRepositoryService.create).toHaveBeenCalledWith({
        caseId,
        type: defendantNotificationDTO.type,
        recipients: [
          {
            address: 'extra@omnitrix.is',
            success: true,
          },
        ],
      })
    })
  })
})
