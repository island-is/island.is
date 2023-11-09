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

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (defenderNationalId?: string) => Promise<Then>

describe('InternalNotificationController - Send appeal received by court notifications', () => {
  const courtOfAppealsEmail = uuid()
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
    process.env.COURTS_EMAILS = `{"4676f08b-aab4-4b4f-a366-697540788088":"${courtOfAppealsEmail}"}`

    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (defenderNationalId?: string) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            prosecutor: { name: prosecutorName, email: prosecutorEmail },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            defenderNationalId,
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
      then = await givenWhenThen(uuid())
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
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: `Kæra í máli ${courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til ${formatDate(
            getStatementDeadline(receivedDate),
            'PPPp',
          )}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: `Kæra í máli ${courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til ${formatDate(
            getStatementDeadline(receivedDate),
            'PPPp',
          )}. Hægt er að skila greinargerð og nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: `Kæra í máli ${courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til ${formatDate(
            getStatementDeadline(receivedDate),
            'PPPp',
          )}. Hægt er að skila greinargerð og nálgast gögn málsins á <a href="http://localhost:4200/verjandi/krafa/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent with missing defender national id', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should send notification to prosecutor and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: `Kæra í máli ${courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til ${formatDate(
            getStatementDeadline(receivedDate),
            'PPPp',
          )}. Hægt er að skila greinargerð og nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: `Kæra í máli ${courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til ${formatDate(
            getStatementDeadline(receivedDate),
            'PPPp',
          )}. Hægt er að skila greinargerð og nálgast gögn málsins hjá Héraðsdómi Reykjavíkur ef þau hafa ekki þegar verið afhent.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
