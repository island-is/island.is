import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'
import { SmsService } from '@island.is/nova-sms'

import {
  CaseNotificationType,
  InstitutionType,
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

type GivenWhenThen = (user: User, defenderNationalId?: string) => Promise<Then>

describe('InternalNotificationController - Send appeal to court of appeals notifications', () => {
  const caseId = uuid()
  const prosecutorName = uuid()
  const prosecutorEmail = uuid()
  const prosecutorMobileNumber = uuid()
  const judgeName = uuid()
  const judgeEmail = uuid()
  const registrarName = uuid()
  const registrarEmail = uuid()
  const defenderName = uuid()
  const defenderEmail = uuid()
  const courtCaseNumber = uuid()
  const courtId = uuid()
  const courtEmail = uuid()
  const courtMobileNumber = uuid()

  let mockEmailService: EmailService
  let mockSmsService: SmsService

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_ASSISTANT_MOBILE_NUMBERS = `{"${courtId}": "${courtMobileNumber}"}`
    process.env.COURTS_EMAILS = `{"${courtId}": "${courtEmail}"}`

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
              name: prosecutorName,
              email: prosecutorEmail,
              mobileNumber: prosecutorMobileNumber,
            },
            judge: { name: judgeName, email: judgeEmail },
            registrar: { name: registrarName, email: registrarEmail },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            defenderNationalId,
            defenderName: defenderName,
            defenderEmail: defenderEmail,
            courtCaseNumber,
            courtId: courtId,
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
          institution: { type: InstitutionType.PROSECUTORS_OFFICE },
        } as User,
        uuid(),
      )
    })

    it('should send notification to judge, registrar, court and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judgeName, address: judgeEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: registrarName, address: registrarEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Héraðsdómur Reykjavíkur', address: courtEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/verjandi/krafa/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )

      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [courtMobileNumber],
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
        institution: { type: InstitutionType.PROSECUTORS_OFFICE },
      } as User)
    })

    it('should send notification to judge and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judgeName, address: judgeEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins hjá Héraðsdómi Reykjavíkur ef þau hafa ekki þegar verið afhent.`,
        }),
      )
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [courtMobileNumber],
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
          to: [{ name: judgeName, address: judgeEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [courtMobileNumber],
        `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Sjá nánar á rettarvorslugatt.island.is`,
      )
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [prosecutorMobileNumber],
        `Úrskurður hefur verið kærður í máli ${courtCaseNumber}. Sjá nánar á rettarvorslugatt.island.is`,
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })
})
