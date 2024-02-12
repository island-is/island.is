import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import { formatDate } from '@island.is/judicial-system/formatters'
import {
  getStatementDeadline,
  NotificationType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../case'
import { DeliverResponse } from '../../models/deliver.response'
import { Notification } from '../../models/notification.model'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalNotificationController - Send appeal withdrawn notifications', () => {
  const courtOfAppealsEmail = uuid()
  const userId = uuid()
  const caseId = uuid()
  const prosecutorName = uuid()
  const prosecutorEmail = uuid()
  const prosecutorMobileNumber = uuid()
  const defenderName = uuid()
  const defenderEmail = uuid()
  const courtCaseNumber = uuid()
  const receivedDate = new Date()
  const appealAssistantName = uuid()
  const appealAssistantEmail = uuid()

  let mockEmailService: EmailService
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_EMAILS = `{"4676f08b-aab4-4b4f-a366-697540788088":"${courtOfAppealsEmail}"}`

    const { emailService, internalNotificationController, notificationModel } =
      await createTestingNotificationModule()

    mockEmailService = emailService
    mockNotificationModel = notificationModel

    const mockFindAll = mockNotificationModel.findAll as jest.Mock
    mockFindAll.mockResolvedValue([])

    givenWhenThen = async () => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            prosecutor: {
              name: prosecutorName,
              email: prosecutorEmail,
              mobileNumber: prosecutorMobileNumber,
            },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            defenderName: defenderName,
            defenderEmail: defenderEmail,
            courtCaseNumber,
            appealReceivedByCourtDate: receivedDate,
            appealAssistant: {
              name: appealAssistantName,
              email: appealAssistantEmail,
            },
          } as Case,
          {
            user: { id: userId } as User,
            type: NotificationType.APPEAL_WITHDRAWN,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  describe('appeal is withdrawn', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)
      const mockFindAll = mockNotificationModel.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce([
        {
          caseId,
          type: NotificationType.APPEAL_JUDGES_ASSIGNED,
        } as Notification,
      ])

      then = await givenWhenThen()
    })

    it('should send notification to prosecutor and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Landsréttur',
              address: courtOfAppealsEmail,
            },
          ],
          subject: `Kæra í máli ${courtCaseNumber} afturkölluð`,
          html: `Kæra í máli ${courtCaseNumber} hefur verið afturkölluð. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: appealAssistantName, address: appealAssistantEmail }],
          subject: `Kæra í máli ${courtCaseNumber} afturkölluð`,
          html: `Kæra í máli ${courtCaseNumber} hefur verið afturkölluð. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })
})
