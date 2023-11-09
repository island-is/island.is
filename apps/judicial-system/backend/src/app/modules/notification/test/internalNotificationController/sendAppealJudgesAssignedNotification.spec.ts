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

describe('InternalNotificationController - Send appeal judges assigned notifications', () => {
  const userId = uuid()
  const caseId = uuid()
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
            appealCaseNumber,
            appealReceivedByCourtDate: receivedDate,
            appealAssistant: {
              name: assistantName,
              email: assistantEmail,
              role: UserRole.ASSISTANT,
            },
            appealJudge1: {
              name: judgeName1,
              email: judgeEmail1,
              id: judgeId1,
              role: UserRole.JUDGE,
            },
            appealJudge1Id: judgeId1,
            appealJudge2: {
              name: judgeName2,
              email: judgeEmail2,
              id: judgeId2,
              role: UserRole.JUDGE,
            },
            appealJudge3: {
              name: judgeName3,
              email: judgeEmail3,
              id: judgeId3,
              role: UserRole.JUDGE,
            },
          } as Case,
          {
            user: { id: userId } as User,
            type: NotificationType.APPEAL_JUDGES_ASSIGNED,
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

    it('should send notification to the judge foreperson, the two other judges and the judges assistant', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: assistantName, address: assistantEmail }],
          subject: `Úthlutun máls nr. ${appealCaseNumber}`,
          html: `Landsréttur hefur skráð þig sem aðstoðarmann dómara í máli nr. ${appealCaseNumber}. Dómsformaður er ${judgeName1}. Þú getur nálgast yfirlit málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
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
          subject: `Úthlutun máls nr. ${appealCaseNumber}`,
          html: `Landsréttur hefur skráð þig sem dómsformann í máli nr. ${appealCaseNumber}. Þú getur nálgast yfirlit málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judgeName2, address: judgeEmail2 }],
          subject: `Úthlutun máls nr. ${appealCaseNumber}`,
          html: `Landsréttur hefur skráð þig sem dómara í máli nr. ${appealCaseNumber}. Dómsformaður er ${judgeName1}. Þú getur nálgast yfirlit málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judgeName3, address: judgeEmail3 }],
          subject: `Úthlutun máls nr. ${appealCaseNumber}`,
          html: `Landsréttur hefur skráð þig sem dómara í máli nr. ${appealCaseNumber}. Dómsformaður er ${judgeName1}. Þú getur nálgast yfirlit málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
