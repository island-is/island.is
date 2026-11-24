import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import {
  AppealCaseNotificationType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { AppealCase, Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalNotificationController - Send appeal summons confirmed notifications', () => {
  const userId = uuid()
  const caseId = uuid()
  const appealCaseId = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = 'S-390/2026'

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    // Domain must be on the test whitelist when EMAIL_USE_WHITELIST is true.
    process.env.PUBLIC_PROSECUTOR_CRIMINAL_RECORDS_EMAIL =
      'sakaskra@omnitrix.is'

    const { emailService, notificationConfig, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService
    mockConfig = notificationConfig

    givenWhenThen = async () => {
      const then = {} as Then

      await internalNotificationController
        .sendAppealCaseNotification(
          caseId,
          appealCaseId,
          {
            id: caseId,
            courtCaseNumber,
            court: { name: courtName },
          } as Case,
          { id: appealCaseId } as AppealCase,
          {
            user: { id: userId } as User,
            type: AppealCaseNotificationType.APPEAL_SUMMONS_CONFIRMED,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  it('emails ritari sakaskrár that the indictment case has been appealed', async () => {
    const then = await givenWhenThen()
    const caseUrl = `${mockConfig.clientUrl}/beinir/${caseId}`

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: [
          {
            name: 'Ritari sakaskrár',
            address: mockConfig.email.publicProsecutorCriminalRecordsEmail,
          },
        ],
        subject: `Áfrýjun í máli ${courtCaseNumber}`,
        html: expect.stringContaining(
          `Máli ${courtCaseNumber} hjá Héraðsdómi Reykjavíkur hefur verið áfrýjað.`,
        ),
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining(caseUrl),
      }),
    )
    expect(then.result).toEqual({ delivered: true })
  })
})
