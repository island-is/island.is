import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import {
  CaseType,
  InstitutionType,
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

type GivenWhenThen = (user: User) => Promise<Then>

describe('InternalNotificationController - Send case files updated notifications', () => {
  const caseId = uuid()
  const courtCaseNumber = uuid()
  const prosecutorName = uuid()
  const prosecutorEmail = uuid()
  const judgeName = uuid()
  const judgeEmail = uuid()
  const defenderName = uuid()
  const defenderEmail = uuid()
  const spokespersonName = uuid()
  const spokespersonEmail = uuid()
  let mockEmailService: EmailService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (user: User) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            type: CaseType.INDICTMENT,
            courtCaseNumber,
            prosecutor: { name: prosecutorName, email: prosecutorEmail },
            judge: { name: judgeName, email: judgeEmail },
            defendants: [{ defenderName, defenderEmail }],
            civilClaimants: [
              { hasSpokesperson: true, spokespersonName, spokespersonEmail },
            ],
          } as Case,
          {
            user,
            type: NotificationType.CASE_FILES_UPDATED,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('notification sent by prosecutor', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        role: UserRole.PROSECUTOR,
        institution: { type: InstitutionType.PROSECUTORS_OFFICE },
      } as unknown as User)
    })

    it('should send notifications', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judgeName, address: judgeEmail }],
          subject: `Ný gögn í máli ${courtCaseNumber}`,
          html: `Ný gögn hafa borist vegna máls ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/domur/akaera/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
        expect.objectContaining({
          to: [{ name: spokespersonName, address: spokespersonEmail }],
          subject: `Ný gögn í máli ${courtCaseNumber}`,
          html: `Ný gögn hafa borist vegna máls ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/verjandi/akaera/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Ný gögn í máli ${courtCaseNumber}`,
          html: `Ný gögn hafa borist vegna máls ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/verjandi/akaera/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by defender', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        role: UserRole.DEFENDER,
      } as User)
    })

    it('should send notifications', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judgeName, address: judgeEmail }],
          subject: `Ný gögn í máli ${courtCaseNumber}`,
          html: `Ný gögn hafa borist vegna máls ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/domur/akaera/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
        expect.objectContaining({
          to: [{ name: spokespersonName, address: spokespersonEmail }],
          subject: `Ný gögn í máli ${courtCaseNumber}`,
          html: `Ný gögn hafa borist vegna máls ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/verjandi/akaera/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Ný gögn í máli ${courtCaseNumber}`,
          html: `Ný gögn hafa borist vegna máls ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/akaera/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
