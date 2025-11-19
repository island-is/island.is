import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import { DEFENDER_INDICTMENT_ROUTE } from '@island.is/judicial-system/consts'
import {
  CaseType,
  CivilClaimantNotificationType,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../../createTestingNotificationModule'

import { Case, CivilClaimant, Notification } from '../../../../repository'
import { CivilClaimantNotificationDto } from '../../../dto/civilClaimantNotification.dto'
import { DeliverResponse } from '../../../models/deliver.response'
import { notificationModuleConfig } from '../../../notification.config'

jest.mock('../../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  civilClaimantId: string,
  theCase: Case,
  civilClaimant: CivilClaimant,
  notificationDto: CivilClaimantNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send spokesperson assigned notifications', () => {
  const caseId = uuid()
  const civilClaimantId = uuid()
  const court = { name: 'Héraðsdómur Reykjavíkur' } as Case['court']

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  let civilClaimantNotificationDTO: CivilClaimantNotificationDto

  beforeEach(async () => {
    const {
      emailService,
      notificationConfig,
      internalNotificationController,
      notificationModel,
    } = await createTestingNotificationModule()

    civilClaimantNotificationDTO = {
      type: CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED,
    }

    mockEmailService = emailService
    mockConfig = notificationConfig
    mockNotificationModel = notificationModel

    givenWhenThen = async (
      caseId: string,
      civilClaimantId: string,
      theCase: Case,
      civilClaimant: CivilClaimant,
      notificationDto: CivilClaimantNotificationDto,
    ) => {
      const then = {} as Then

      try {
        then.result =
          await internalNotificationController.sendCivilClaimantNotification(
            caseId,
            civilClaimantId,
            theCase,
            civilClaimant,
            notificationDto,
          )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe.each([
    { isSpokespersonConfirmed: true, shouldSendEmail: true },
    { isSpokespersonConfirmed: false, shouldSendEmail: false },
  ])(
    'when sending a spokesperson assigned notification',
    ({ isSpokespersonConfirmed, shouldSendEmail }) => {
      const civilClaimant = {
        id: civilClaimantId,
        caseId,
        isSpokespersonConfirmed,
        spokespersonIsLawyer: true,
        spokespersonNationalId: '1234567890',
        spokespersonName: 'Ben 10',
        spokespersonEmail: 'ben10@omnitrix.is',
      } as CivilClaimant

      beforeEach(async () => {
        await givenWhenThen(
          caseId,
          civilClaimantId,
          {
            id: caseId,
            court,
            courtCaseNumber: 'R-123-456',
            type: CaseType.INDICTMENT,
            civilClaimants: [civilClaimant],
            hasCivilClaims: true,
          } as Case,
          civilClaimant,
          civilClaimantNotificationDTO,
        )
      })

      test(`should ${
        shouldSendEmail ? '' : 'not '
      }send a spokesperson assigned notification`, async () => {
        if (shouldSendEmail) {
          expect(mockEmailService.sendEmail).toBeCalledTimes(1)
          expect(mockEmailService.sendEmail).toBeCalledWith({
            from: {
              name: mockConfig.email.fromName,
              address: mockConfig.email.fromEmail,
            },
            to: [
              {
                name: civilClaimant.spokespersonName,
                address: civilClaimant.spokespersonEmail,
              },
            ],
            replyTo: {
              name: mockConfig.email.replyToName,
              address: mockConfig.email.replyToEmail,
            },
            attachments: undefined,
            subject: `Héraðsdómur Reykjavíkur - aðgangur að máli`,
            html: expect.stringContaining(DEFENDER_INDICTMENT_ROUTE),
            text: expect.stringContaining(
              `Héraðsdómur Reykjavíkur hefur skráð þig lögmann einkaréttarkröfuhafa í máli R-123-456`,
            ),
          })
          expect(mockNotificationModel.create).toHaveBeenCalledTimes(1)
          expect(mockNotificationModel.create).toHaveBeenCalledWith({
            caseId,
            type: civilClaimantNotificationDTO.type,
            recipients: [
              {
                address: civilClaimant.spokespersonEmail,
                success: shouldSendEmail,
              },
            ],
          })
        } else {
          expect(mockEmailService.sendEmail).not.toBeCalled()
        }
      })
    },
  )
})
