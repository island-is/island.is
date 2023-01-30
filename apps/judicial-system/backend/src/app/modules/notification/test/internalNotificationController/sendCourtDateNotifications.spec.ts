import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'
import { CaseType, NotificationType } from '@island.is/judicial-system/types'

import { User } from '../../../user'
import { Case } from '../../../case'
import { DeliverResponse } from '../../models/deliver.response'
import { createTestingNotificationModule } from '../createTestingNotificationModule'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (eventOnly?: boolean) => Promise<Then>

describe('InternalNotificationController - Send court date notification', () => {
  const userId = uuid()
  const caseId = uuid()
  const prosecutorName = uuid()
  const prosecutorEmail = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = uuid()

  let mockEmailService: EmailService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (eventOnly?) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          { id: userId } as User,
          {
            id: caseId,
            type: CaseType.CUSTODY,
            prosecutor: { name: prosecutorName, email: prosecutorEmail },
            court: { name: courtName },
            courtCaseNumber,
          } as Case,
          { userId, type: NotificationType.COURT_DATE, eventOnly },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('notification sent', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should send notification', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Fyrirtaka í máli: ${courtCaseNumber}`,
          html:
            'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um gæsluvarðhald.<br /><br />Fyrirtaka mun fara fram á ótilgreindum tíma.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari hefur ekki verið skráður.<br /><br />Verjandi sakbornings hefur ekki verið skráður.',
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('event only', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(true)
    })

    it('should send notification', () => {
      expect(then.result).toEqual({ delivered: false })
    })
  })
})
