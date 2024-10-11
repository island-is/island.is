import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import {
  InstitutionType,
  NotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../case'
import { DeliverResponse } from '../../models/deliver.response'
import { Notification } from '../../models/notification.model'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  userRole: UserRole,
  appealReceivedByCourtDate?: Date,
  notifications?: Notification[],
) => Promise<Then>

describe('InternalNotificationController - Send appeal withdrawn notifications', () => {
  const courtOfAppealsEmail = uuid()
  const courtEmail = uuid()
  const courtId = uuid()
  const userId = uuid()
  const caseId = uuid()
  const judgeName = uuid()
  const judgeEmail = uuid()
  const prosecutorName = uuid()
  const prosecutorEmail = uuid()
  const prosecutorMobileNumber = uuid()
  const defenderName = uuid()
  const defenderEmail = uuid()
  const courtCaseNumber = uuid()
  const receivedDate = new Date()
  const registrarEmail = uuid()
  const registrarName = uuid()
  const appealAssistantName = uuid()
  const appealAssistantEmail = uuid()
  const appealJudge1Name = uuid()
  const appealJudge1Email = uuid()

  let mockEmailService: EmailService
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_EMAILS = `{"4676f08b-aab4-4b4f-a366-697540788088":"${courtOfAppealsEmail}","${courtId}":"${courtEmail}"}`

    const { emailService, internalNotificationController, notificationModel } =
      await createTestingNotificationModule()

    mockEmailService = emailService
    mockNotificationModel = notificationModel

    givenWhenThen = async (
      userRole,
      appealReceivedByCourtDate,
      notifications,
    ) => {
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
            court: { name: 'Héraðsdómur Reykjavíkur', id: courtId },
            defenderName: defenderName,
            defenderEmail: defenderEmail,
            courtCaseNumber,
            appealReceivedByCourtDate,
            appealAssistant: {
              name: appealAssistantName,
              email: appealAssistantEmail,
            },
            judge: { name: judgeName, email: judgeEmail },
            appealJudge1: { name: appealJudge1Name, email: appealJudge1Email },
            registrar: { name: registrarName, email: registrarEmail },
            notifications,
          } as Case,
          {
            user: {
              id: userId,
              role: userRole,
              institution: { type: InstitutionType.PROSECUTORS_OFFICE },
            } as User,
            type: NotificationType.APPEAL_WITHDRAWN,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  describe('appeal is withdrawn by prosecutor after it has been marked as received', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(UserRole.PROSECUTOR, receivedDate)
    })
    it('should send notification to defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Afturköllun kæru í máli ${courtCaseNumber}`,
          html: `Sækjandi hefur afturkallað kæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
    it('should send notification to court of appeals', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Landsréttur',
              address: courtOfAppealsEmail,
            },
          ],
          subject: `Afturköllun kæru í máli ${courtCaseNumber}`,
          html: `Sækjandi hefur afturkallað kæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )
    })
    it('should send notification to appeal assistant ', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: appealAssistantName, address: appealAssistantEmail }],
          subject: `Afturköllun kæru í máli ${courtCaseNumber}`,
          html: `Sækjandi hefur afturkallað kæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )
    })
  })

  describe('appeal is withdrawn by prosecutor after COA assignment', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)

      then = await givenWhenThen(UserRole.PROSECUTOR, receivedDate, [
        {
          caseId,
          type: NotificationType.APPEAL_JUDGES_ASSIGNED,
        } as Notification,
      ])
    })
    it('should send notification to defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Afturköllun kæru í máli ${courtCaseNumber}`,
          html: `Sækjandi hefur afturkallað kæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
    it('should send notification to court of appeals', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Landsréttur',
              address: courtOfAppealsEmail,
            },
          ],
          subject: `Afturköllun kæru í máli ${courtCaseNumber}`,
          html: `Sækjandi hefur afturkallað kæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )
    })
    it('should send notification to appeal assistant ', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: appealAssistantName, address: appealAssistantEmail }],
          subject: `Afturköllun kæru í máli ${courtCaseNumber}`,
          html: `Sækjandi hefur afturkallað kæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )
    })
    it('should send notification to appeal judges', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: appealJudge1Name, address: appealJudge1Email }],
        }),
      )
    })
  })

  describe('appeal is withdrawn by defender before appeal has been received', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(UserRole.DEFENDER)
    })

    it('should send notification to prosecutor', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Afturköllun kæru í máli ${courtCaseNumber}`,
          html: `Verjandi hefur afturkallað kæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })

    it('should send notification to judge', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judgeName, address: judgeEmail }],
          subject: `Afturköllun kæru í máli ${courtCaseNumber}`,
          html: `Verjandi hefur afturkallað kæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )
    })

    it('should send notification to registrar', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: registrarName, address: registrarEmail }],
          subject: `Afturköllun kæru í máli ${courtCaseNumber}`,
          html: `Verjandi hefur afturkallað kæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )
    })

    it('should send notification to court', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Héraðsdómur Reykjavíkur',
              address: courtEmail,
            },
          ],
          subject: `Afturköllun kæru í máli ${courtCaseNumber}`,
          html: `Verjandi hefur afturkallað kæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )
    })
    it('should not send notification to court of appeals', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Landsréttur',
              address: courtOfAppealsEmail,
            },
          ],
        }),
      )
    })
  })
})
