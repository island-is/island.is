import { v4 as uuid } from 'uuid'

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

describe('InternalNotificationController - Send appeal judges assigned notifications', () => {
  const { judge1, judge2, judge3, assistant } = createTestUsers([
    'judge1',
    'judge2',
    'judge3',
    'assistant',
  ])
  const userId = uuid()
  const caseId = uuid()
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
            appealJudge1Id: judge1.id,
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
            type: CaseNotificationType.APPEAL_JUDGES_ASSIGNED,
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
          to: [{ name: assistant.name, address: assistant.email }],
          subject: `Úthlutun máls nr. ${appealCaseNumber}`,
          html: `Landsréttur hefur skráð þig sem aðstoðarmann dómara í máli nr. ${appealCaseNumber}. Dómsformaður er ${judge1.name}. Þú getur nálgast yfirlit málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
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
          subject: `Úthlutun máls nr. ${appealCaseNumber}`,
          html: `Landsréttur hefur skráð þig sem dómsformann í máli nr. ${appealCaseNumber}. Þú getur nálgast yfirlit málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge2.name, address: judge2.email }],
          subject: `Úthlutun máls nr. ${appealCaseNumber}`,
          html: `Landsréttur hefur skráð þig sem dómara í máli nr. ${appealCaseNumber}. Dómsformaður er ${judge1.name}. Þú getur nálgast yfirlit málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge3.name, address: judge3.email }],
          subject: `Úthlutun máls nr. ${appealCaseNumber}`,
          html: `Landsréttur hefur skráð þig sem dómara í máli nr. ${appealCaseNumber}. Dómsformaður er ${judge1.name}. Þú getur nálgast yfirlit málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
