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

type GivenWhenThen = (defenderNationalId?: string) => Promise<Then>

describe('InternalNotificationController - Send appeal case files updated notifications', () => {
  const userId = uuid()
  const caseId = uuid()
  const courtCaseNumber = uuid()
  const appealCaseNumber = uuid()
  const receivedDate = new Date()
  const assistantName = uuid()
  const assistantEmail = uuid()
  const judgeName1 = uuid()
  const judgeEmail1 = uuid()
  const judgeId1 = uuid()
  const judgeName2 = uuid()
  const judgeEmail2 = uuid()
  const judgeId2 = uuid()
  const judgeName3 = uuid()
  const judgeEmail3 = uuid()
  const judgeId3 = uuid()

  let mockEmailService: EmailService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async () => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            courtCaseNumber,
            appealCaseNumber,
            appealReceivedByCourtDate: receivedDate,
            appealAssistant: {
              name: assistantName,
              email: assistantEmail,
              role: UserRole.COURT_OF_APPEALS_ASSISTANT,
            },
            appealJudge1: {
              name: judgeName1,
              email: judgeEmail1,
              id: judgeId1,
              role: UserRole.COURT_OF_APPEALS_JUDGE,
            },
            appealJudge1Id: judgeId1,
            appealJudge2: {
              name: judgeName2,
              email: judgeEmail2,
              id: judgeId2,
              role: UserRole.COURT_OF_APPEALS_JUDGE,
            },
            appealJudge3: {
              name: judgeName3,
              email: judgeEmail3,
              id: judgeId3,
              role: UserRole.COURT_OF_APPEALS_JUDGE,
            },
          } as Case,
          {
            user: { id: userId } as User,
            type: NotificationType.APPEAL_CASE_FILES_UPDATED,
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

    console.log(
      assistantName,
      assistantEmail,
      judgeName1,
      judgeEmail1,
      judgeName2,
      judgeEmail2,
      judgeName3,
      judgeEmail3,
    )

    it('should send notification to the assigned court of appeal judges and assistant', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: assistantName, address: assistantEmail }],
          subject: `Ný gögn í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Ný gögn hafa borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: judgeName1,
              address: judgeEmail1,
            },
          ],
          subject: `Ný gögn í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Ný gögn hafa borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judgeName2, address: judgeEmail2 }],
          subject: `Ný gögn í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Ný gögn hafa borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judgeName3, address: judgeEmail3 }],
          subject: `Ný gögn í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Ný gögn hafa borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
