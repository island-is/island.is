import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import {
  NotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../case'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  role: UserRole,
  defenderNationalId?: string,
  appealsCourtNumber?: string,
) => Promise<Then>

describe('InternalNotificationController - Send appeal statement notifications', () => {
  const userId = uuid()
  const caseId = uuid()
  const prosecutorName = uuid()
  const prosecutorEmail = uuid()
  const defenderName = uuid()
  const defenderEmail = uuid()
  const courtCaseNumber = uuid()
  const receivedDate = new Date()
  const appealCaseNumber = uuid()
  const assistantName = uuid()
  const assistantEmail = uuid()
  const judgeName1 = uuid()
  const judgeEmail1 = uuid()
  const judgeName2 = uuid()
  const judgeEmail2 = uuid()
  const judgeName3 = uuid()
  const judgeEmail3 = uuid()

  let mockEmailService: EmailService

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (
      role: UserRole,
      defenderNationalId?: string,
      appealCaseNumber?: string,
    ) => {
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
            appealCaseNumber,
            appealAssistant: { name: assistantName, email: assistantEmail },
            appealJudge1: { name: judgeName1, email: judgeEmail1 },
          } as Case,
          {
            user: { id: userId, role } as User,
            type: NotificationType.APPEAL_STATEMENT,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  const expectCourtEmail = (name: string, address: string) => {
    expect.objectContaining({
      to: [{ name, address }],
      subject: `Ný greinargerð í máli ${courtCaseNumber} (${appealCaseNumber})`,
      html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
    })
  }

  describe('notification sent by prosecutor', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(UserRole.PROSECUTOR, uuid(), appealCaseNumber)
    })

    it('should send notification to appeals court and defender', () => {
      expectCourtEmail(assistantName, assistantEmail)
      expectCourtEmail(judgeName1, judgeEmail1)
      expectCourtEmail(judgeName2, judgeEmail2)
      expectCourtEmail(judgeName3, judgeEmail3)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Ný greinargerð í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/verjandi/krafa/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by prosecutor with missing defender national id', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        UserRole.PROSECUTOR,
        undefined,
        appealCaseNumber,
      )
    })

    it('should send notification to appeals court and defender', () => {
      expectCourtEmail(assistantName, assistantEmail)
      expectCourtEmail(judgeName1, judgeEmail1)
      expectCourtEmail(judgeName2, judgeEmail2)
      expectCourtEmail(judgeName3, judgeEmail3)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Ný greinargerð í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins hjá Héraðsdómi Reykjavíkur ef þau hafa ekki þegar verið afhent.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by defender', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(UserRole.DEFENDER, uuid(), appealCaseNumber)
    })

    it('should send notification to appeals court and prosecutor', () => {
      expectCourtEmail(assistantName, assistantEmail)
      expectCourtEmail(judgeName1, judgeEmail1)
      expectCourtEmail(judgeName2, judgeEmail2)
      expectCourtEmail(judgeName3, judgeEmail3)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Ný greinargerð í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by prosecutor before appeal case number', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(UserRole.PROSECUTOR, uuid())
    })

    it('should send notification to defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Ný greinargerð í máli ${courtCaseNumber}`,
          html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/verjandi/krafa/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by prosecutor before appeal case number with missing defender national id', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(UserRole.PROSECUTOR)
    })

    it('should send notification to defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Ný greinargerð í máli ${courtCaseNumber}`,
          html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins hjá Héraðsdómi Reykjavíkur ef þau hafa ekki þegar verið afhent.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by defender before appeal case number', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(UserRole.DEFENDER, uuid())
    })

    it('should send notification to prosecutor', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Ný greinargerð í máli ${courtCaseNumber}`,
          html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
