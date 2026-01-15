import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'
import { SmsService } from '@island.is/nova-sms'

import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseNotificationType,
  getStatementDeadline,
  User,
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

describe('InternalNotificationController - Send appeal received by court notifications', () => {
  const { coa, defender, prosecutor, coaAssistant1, coaAssistant2 } =
    createTestUsers([
      'coa',
      'defender',
      'prosecutor',
      'coaAssistant1',
      'coaAssistant2',
    ])

  const userId = uuid()
  const caseId = uuid()
  const courtCaseNumber = uuid()
  const receivedDate = new Date()

  let mockEmailService: EmailService
  let mockSmsService: SmsService

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_EMAILS = `{"4676f08b-aab4-4b4f-a366-697540788088":"${coa.email}"}`
    process.env.COURT_OF_APPEALS_ASSISTANT_EMAILS = `${coaAssistant1.email}, ${coaAssistant2.email} `

    const { emailService, smsService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService
    mockSmsService = smsService

    givenWhenThen = async (defenderNationalId?: string) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            prosecutor: {
              name: prosecutor.name,
              email: prosecutor.email,
              mobileNumber: prosecutor.mobile,
            },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            defenderNationalId,
            defenderName: defender.name,
            defenderEmail: defender.email,
            courtCaseNumber,
            appealReceivedByCourtDate: receivedDate,
          } as Case,
          {
            user: { id: userId } as User,
            type: CaseNotificationType.APPEAL_RECEIVED_BY_COURT,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  describe('appeal is marked as received by court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(uuid())
    })

    it('should send notification to court of appeals, prosecutor and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Landsréttur',
              address: coa.email,
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
          to: [
            {
              name: 'Landsréttur',
              address: coaAssistant1.email,
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
          to: [
            {
              name: 'Landsréttur',
              address: coaAssistant2.email,
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
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: `Kæra í máli ${courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til ${formatDate(
            getStatementDeadline(receivedDate),
            'PPPp',
          )}. Hægt er að skila greinargerð og nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: `Kæra í máli ${courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til ${formatDate(
            getStatementDeadline(receivedDate),
            'PPPp',
          )}. Hægt er að skila greinargerð og nálgast gögn málsins á <a href="http://localhost:4200/verjandi/krafa/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })

    it('should send sms notification to prosecutor', () => {
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [prosecutor.mobile],
        `Kæra í máli ${courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til ${formatDate(
          getStatementDeadline(receivedDate),
          'PPPp',
        )}. Sjá nánar á rettarvorslugatt.island.is`,
      )
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
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: `Kæra í máli ${courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til ${formatDate(
            getStatementDeadline(receivedDate),
            'PPPp',
          )}. Hægt er að skila greinargerð og nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
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
