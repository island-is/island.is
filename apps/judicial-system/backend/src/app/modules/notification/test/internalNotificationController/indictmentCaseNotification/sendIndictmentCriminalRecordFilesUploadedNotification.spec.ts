import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import { IndictmentCaseNotificationType } from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../../createTestingNotificationModule'

import { Case } from '../../../../repository'
import { DeliverResponse } from '../../../models/deliver.response'
import { notificationModuleConfig } from '../../../notification.config'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  notificationType: IndictmentCaseNotificationType,
) => Promise<Then>

describe('IndictmentCaseService', () => {
  const caseId = uuid()
  const courtName = uuid()

  const courtCaseNumber = uuid()
  const theCase = {
    id: caseId,
    court: { name: courtName },
    courtCaseNumber,
  } as Case

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.PUBLIC_PROSECUTOR_CRIMINAL_RECORDS_EMAIL =
      'publicProsecutor@omnitrix.is'

    const {
      emailService,
      notificationConfig,
      indictmentCaseNotificationService,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockConfig = notificationConfig

    givenWhenThen = async (
      theCase: Case,
      notificationType: IndictmentCaseNotificationType,
    ) => {
      const then = {} as Then

      await indictmentCaseNotificationService
        .sendIndictmentCaseNotification(notificationType, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('notification sent to public prosecutor criminal records secretary', () => {
    it('should send notification', async () => {
      const then = await givenWhenThen(
        theCase,
        IndictmentCaseNotificationType.CRIMINAL_RECORD_FILES_UPLOADED,
      )

      expect(mockEmailService.sendEmail).toBeCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Ritari sakaskrár',
              address: mockConfig.email.publicProsecutorCriminalRecordsEmail,
            },
          ],
          subject: expect.stringContaining(
            `Tilkynning til sakaskrár í máli ${courtCaseNumber}`,
          ),
          html: expect.stringContaining(
            `Máli ${courtCaseNumber} hjá ${courtName} hefur verið lokið.`,
          ),
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
