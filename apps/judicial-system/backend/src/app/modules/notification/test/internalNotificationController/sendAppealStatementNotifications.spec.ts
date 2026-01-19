import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

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

type GivenWhenThen = (
  user: User,
  defenderNationalId?: string,
  appealsCourtNumber?: string,
) => Promise<Then>

describe('InternalNotificationController - Send appeal statement notifications', () => {
  const roles = [
    'prosecutor',
    'defender',
    'assistant',
    'judge1',
    'judge2',
    'judge3',
  ]

  const { prosecutor, defender, assistant, judge1, judge2, judge3 } =
    createTestUsers(roles)

  const caseId = uuid()
  const courtCaseNumber = uuid()
  const receivedDate = new Date()
  const appealCaseNumber = uuid()

  let mockEmailService: EmailService

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (
      user: User,
      defenderNationalId?: string,
      appealCaseNumber?: string,
    ) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            prosecutor: { name: prosecutor.name, email: prosecutor.email },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            defenderNationalId,
            defenderName: defender.name,
            defenderEmail: defender.email,
            courtCaseNumber,
            appealReceivedByCourtDate: receivedDate,
            appealCaseNumber,
            appealAssistant: { name: assistant.name, email: assistant.email },
            appealJudge1: { name: judge1.name, email: judge1.email },
          } as Case,
          {
            user,
            type: CaseNotificationType.APPEAL_STATEMENT,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  const expectCourtEmail = (name: string, address: string) => {
    expect.objectContaining({
      to: [{ name, address }],
      subject: `Ný greinargerð í máli ${courtCaseNumber} (${appealCaseNumber})`,
      html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/landsrettur/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
    })
  }

  describe('notification sent by prosecutor', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        {
          role: UserRole.PROSECUTOR,
          institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
        } as User,
        uuid(),
        appealCaseNumber,
      )
    })

    it('should send notification to appeals court and defender', () => {
      expectCourtEmail(assistant.name, assistant.email)
      expectCourtEmail(judge1.name, judge1.email)
      expectCourtEmail(judge2.name, judge2.email)
      expectCourtEmail(judge3.name, judge3.email)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Ný greinargerð í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/verjandi/krafa/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by prosecutor with missing defender national id', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        {
          role: UserRole.PROSECUTOR,
          institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
        } as User,
        undefined,
        appealCaseNumber,
      )
    })

    it('should send notification to appeals court and defender', () => {
      expectCourtEmail(assistant.name, assistant.email)
      expectCourtEmail(judge1.name, judge1.email)
      expectCourtEmail(judge2.name, judge2.email)
      expectCourtEmail(judge3.name, judge3.email)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Ný greinargerð í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins hjá Héraðsdómi Reykjavíkur ef þau hafa ekki þegar verið afhent.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by defender', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        { role: UserRole.DEFENDER } as User,
        uuid(),
        appealCaseNumber,
      )
    })

    it('should send notification to appeals court and prosecutor', () => {
      expectCourtEmail(assistant.name, assistant.email)
      expectCourtEmail(judge1.name, judge1.email)
      expectCourtEmail(judge2.name, judge2.email)
      expectCourtEmail(judge3.name, judge3.email)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Ný greinargerð í máli ${courtCaseNumber} (${appealCaseNumber})`,
          html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber} (Landsréttarmál nr. ${appealCaseNumber}). Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by prosecutor before appeal case number', () => {
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

    it('should send notification to defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Ný greinargerð í máli ${courtCaseNumber}`,
          html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/verjandi/krafa/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by prosecutor before appeal case number with missing defender national id', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        role: UserRole.PROSECUTOR,
        institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
      } as User)
    })

    it('should send notification to defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Ný greinargerð í máli ${courtCaseNumber}`,
          html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins hjá Héraðsdómi Reykjavíkur ef þau hafa ekki þegar verið afhent.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by defender before appeal case number', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({ role: UserRole.DEFENDER } as User, uuid())
    })

    it('should send notification to prosecutor', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Ný greinargerð í máli ${courtCaseNumber}`,
          html: `Greinargerð hefur borist vegna kæru í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
