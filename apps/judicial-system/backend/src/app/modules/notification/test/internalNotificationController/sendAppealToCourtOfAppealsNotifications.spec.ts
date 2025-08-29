import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'
import { SmsService } from '@island.is/nova-sms'

import {
  CaseNotificationType,
  InstitutionType,
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

type GivenWhenThen = (user: User, defenderNationalId?: string) => Promise<Then>

describe('InternalNotificationController - Send appeal to court of appeals notifications', () => {
  const { prosecutor, judge, registrar, defender, court } = createTestUsers([
    'prosecutor',
    'judge',
    'registrar',
    'defender',
    'court',
  ])

  const caseId = uuid()

  const courtCaseNumber = uuid()

  let mockEmailService: EmailService
  let mockSmsService: SmsService

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_ASSISTANT_MOBILE_NUMBERS = `{"${court.id}": "${court.mobile}"}`
    process.env.COURTS_EMAILS = `{"${court.id}": "${court.email}"}`

    const { emailService, smsService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService
    mockSmsService = smsService

    givenWhenThen = async (user: User, defenderNationalId?: string) => {
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
            judge: { name: judge.name, email: judge.email },
            registrar: { name: registrar.name, email: registrar.email },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            defenderNationalId,
            defenderName: defender.name,
            defenderEmail: defender.email,
            courtCaseNumber,
            courtId: court.id,
          } as Case,
          {
            user,
            type: CaseNotificationType.APPEAL_TO_COURT_OF_APPEALS,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  describe('case appealed by prosecutor', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        {
          role: UserRole.PROSECUTOR,
          institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
        } as User,
        uuid(),
      )
    })

    it('should send notification to judge, registrar, court and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge.name, address: judge.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: registrar.name, address: registrar.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Héraðsdómur Reykjavíkur', address: court.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/verjandi/krafa/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )

      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [court.mobile],
        `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Sjá nánar á rettarvorslugatt.island.is`,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('case appealed by prosecutor with missing defender national id', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        role: UserRole.PROSECUTOR,
        institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
      } as User)
    })

    it('should send notification to judge and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge.name, address: judge.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins hjá Héraðsdómi Reykjavíkur ef þau hafa ekki þegar verið afhent.`,
        }),
      )
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [court.mobile],
        `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Sjá nánar á rettarvorslugatt.island.is`,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('case appealed by defender', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({ role: UserRole.DEFENDER } as User, uuid())
    })

    it('should send notifications to judge and prosecutor', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge.name, address: judge.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [court.mobile],
        `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Sjá nánar á rettarvorslugatt.island.is`,
      )
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [prosecutor.mobile],
        `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Sjá nánar á rettarvorslugatt.island.is`,
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })
})
