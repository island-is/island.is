import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import { DEFENDER_INDICTMENT_ROUTE } from '@island.is/judicial-system/consts'
import {
  CaseType,
  CivilClaimantNotificationType,
  DefendantNotificationType,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../../createTestingNotificationModule'

import { Case } from '../../../../case'
import { CivilClaimant, Defendant } from '../../../../defendant'
import { DefendantNotificationDto } from '../../../dto/defendantNotification.dto'
import { DeliverResponse } from '../../../models/deliver.response'
import { Notification } from '../../../models/notification.model'
import { notificationModuleConfig } from '../../../notification.config'
import { CivilClaimantNotificationDto } from '../../../dto/civilClaimantNotification.dto'

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

  describe('when sending a spokesperson assigned notification', () => {
    const civilClaimant = {
      id: civilClaimantId,
      caseId,
      isSpokespersonConfirmed: true,
      spokespersonIsLawyer: false,
      spokespersonNationalId: '1234567890',
    } as CivilClaimant

    beforeEach(async () => {
      await givenWhenThen(
        caseId,
        civilClaimantId,
        {
          id: caseId,
          court,
          type: CaseType.INDICTMENT,
          civilClaimants: [civilClaimant],
          hasCivilClaims: true,
        } as Case,
        civilClaimant,
        civilClaimantNotificationDTO,
      )
    })

    it('should send a spokesperson assigned notification', async () => {
      expect(mockEmailService.sendEmail).toBeCalledTimes(1)
    })
  })
})
