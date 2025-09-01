import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import {
  CaseNotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (defenderNationalId?: string) => Promise<Then>

describe('InternalNotificationController - Send appeal case files updated notifications', () => {
  const { assistant, judge1, judge2, judge3 } = createTestUsers([
    'assistant',
    'judge1',
    'judge2',
    'judge3',
  ])
  const userId = uuid()
  const caseId = uuid()
  const courtCaseNumber = uuid()
  const appealCaseNumber = uuid()
  const receivedDate = new Date()

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
              name: assistant.name,
              email: assistant.email,
              role: UserRole.COURT_OF_APPEALS_ASSISTANT,
            },
            appealJudge1: {
              name: judge1.name,
              email: judge1.email,
              id: judge1.id,
              role: UserRole.COURT_OF_APPEALS_JUDGE,
            },
            appealJudge2: {
              name: judge2.name,
              email: judge2.email,
              id: judge2.id,
              role: UserRole.COURT_OF_APPEALS_JUDGE,
            },
            appealJudge3: {
              name: judge3.name,
              email: judge3.email,
              id: judge3.id,
              role: UserRole.COURT_OF_APPEALS_JUDGE,
            },
          } as Case,
          {
            user: { id: userId } as User,
            type: CaseNotificationType.APPEAL_CASE_FILES_UPDATED,
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

    it('should send notification to the assigned court of appeal judges and assistant', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: assistant.name, address: assistant.email }],
          subject: `Ný gögn í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Ný gögn hafa borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: judge1.name,
              address: judge1.email,
            },
          ],
          subject: `Ný gögn í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Ný gögn hafa borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge2.name, address: judge2.email }],
          subject: `Ný gögn í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Ný gögn hafa borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge3.name, address: judge3.email }],
          subject: `Ný gögn í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Ný gögn hafa borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
