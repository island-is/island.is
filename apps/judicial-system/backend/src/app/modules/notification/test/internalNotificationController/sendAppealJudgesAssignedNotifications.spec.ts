import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import {
  AppealCaseNotificationType,
  RequestCaseNotificationType,
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

type GivenWhenThen = (userIds?: string[]) => Promise<Then>

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

    givenWhenThen = async (userIds?: string[]) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            appealCase: {
              appealCaseNumber,
              appealReceivedByCourtDate: receivedDate,
              appealAssistant: {
                name: assistant.name,
                email: assistant.email,
                id: assistant.id,
                role: UserRole.COURT_OF_APPEALS_ASSISTANT,
              },
              appealAssistantId: assistant.id,
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
            },
          } as Case,
          {
            user: { id: userId } as User,
            type: AppealCaseNotificationType.APPEAL_JUDGES_ASSIGNED as unknown as RequestCaseNotificationType,
            userIds,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  describe('all roles newly assigned', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen([
        assistant.id,
        judge1.id,
        judge2.id,
        judge3.id,
      ])
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

  describe('only a subset of roles newly assigned', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen([judge3.id])
    })

    it('should only send notification to the newly assigned judge', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
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

  describe('no recipients listed', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen([])
    })

    it('should not send any notification', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
