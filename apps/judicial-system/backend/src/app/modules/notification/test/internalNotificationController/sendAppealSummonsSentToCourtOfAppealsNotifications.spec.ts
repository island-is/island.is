import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import {
  AppealCaseNotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { AppealCase, Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalNotificationController - Send appeal summons sent to court of appeals notifications', () => {
  const { coa, coaAssistant1, coaAssistant2, assistant, judge1, prosecutor } =
    createTestUsers([
      'coa',
      'coaAssistant1',
      'coaAssistant2',
      'assistant',
      'judge1',
      'prosecutor',
    ])
  const userId = uuid()
  const caseId = uuid()
  const appealCaseId = uuid()
  const courtCaseNumber = 'R-123/2026'
  const appealCaseNumber = 'L-45/2026'

  let mockEmailService: EmailService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_EMAILS = `{"4676f08b-aab4-4b4f-a366-697540788088":"${coa.email}"}`
    process.env.COURT_OF_APPEALS_ASSISTANT_EMAILS = `${coaAssistant1.email}, ${coaAssistant2.email}`

    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async () => {
      const then = {} as Then

      const appealCase = {
        appealCaseNumber,
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
      } as AppealCase

      await internalNotificationController
        .sendAppealCaseNotification(
          caseId,
          appealCaseId,
          {
            id: caseId,
            courtCaseNumber,
            prosecutor: {
              name: prosecutor.name,
              email: prosecutor.email,
            },
            appealCase,
          } as Case,
          appealCase,
          {
            user: { id: userId } as User,
            type: AppealCaseNotificationType.APPEAL_SUMMONS_SENT_TO_COURT_OF_APPEALS,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  it('emails the CoA inbox, assistants and assigned judge — not the prosecutor', async () => {
    const then = await givenWhenThen()
    const subject = `Áfrýjunarstefna í máli ${appealCaseNumber}`
    const html = `Ný áfrýjunarstefna er aðgengileg í máli ${appealCaseNumber}. Hægt er að nálgast hana á <a href="http://localhost:4200/landsrettur/afryjun/yfirlit/${caseId}">yfirlitssíðu áfrýjunar í Réttarvörslugátt</a>.`

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: [{ name: 'Landsréttur', address: coaAssistant1.email }],
        subject,
        html,
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: [{ name: 'Landsréttur', address: coaAssistant2.email }],
        subject,
        html,
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: [{ name: 'Landsréttur', address: coa.email }],
        subject,
        html,
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: [{ name: judge1.name, address: judge1.email }],
        subject,
        html,
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: [{ name: assistant.name, address: assistant.email }],
        subject,
        html,
      }),
    )
    expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
      expect.objectContaining({
        to: [{ name: prosecutor.name, address: prosecutor.email }],
      }),
    )
    expect(then.result).toEqual({ delivered: true })
  })
})
