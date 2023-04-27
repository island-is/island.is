import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'
import { NotificationType, User } from '@island.is/judicial-system/types'

import { Case } from '../../../case'
import { DeliverResponse } from '../../models/deliver.response'
import { createTestingNotificationModule } from '../createTestingNotificationModule'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalNotificationController - Send appeal received by court notification', () => {
  const userId = uuid()
  const caseId = uuid()
  const prosecutorName = uuid()
  const prosecutorEmail = uuid()
  const defenderName = uuid()
  const defenderEmail = uuid()
  const courtCaseNumber = uuid()
  const receivedDate = new Date()

  let mockEmailService: EmailService

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async () => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            prosecutor: { name: prosecutorName, email: prosecutorEmail },
            defenderName: defenderName,
            defenderEmail: defenderEmail,
            courtCaseNumber,
            appealReceivedByCourtDate: receivedDate,
          } as Case,
          {
            user: { id: userId } as User,
            type: NotificationType.APPEAL_RECEIVED_BY_COURT,
          },
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

    it('should send notification to prosecutor', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })

    it('should send notification to defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
