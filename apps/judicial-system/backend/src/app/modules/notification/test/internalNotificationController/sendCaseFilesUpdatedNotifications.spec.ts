import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import {
  CaseNotificationType,
  CaseType,
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
  isDefenderChoiceConfirmed?: boolean,
) => Promise<Then>

describe('InternalNotificationController - Send case files updated notifications', () => {
  const { prosecutor, judge, defender, spokesperson, registrar } =
    createTestUsers([
      'prosecutor',
      'judge',
      'defender',
      'spokesperson',
      'registrar',
    ])

  const caseId = uuid()
  const courtCaseNumber = uuid()
  let mockEmailService: EmailService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (user: User, isDefenderChoiceConfirmed = true) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            type: CaseType.INDICTMENT,
            courtCaseNumber,
            court: { name: 'Héraðsdómur Reykjavíkur' },
            prosecutor: { name: prosecutor.name, email: prosecutor.email },
            judge: { name: judge.name, email: judge.email },
            registrar: { name: registrar.name, email: registrar.email },
            defendants: [
              {
                defenderNationalId: defender.nationalId,
                defenderName: defender.name,
                defenderEmail: defender.email,
                isDefenderChoiceConfirmed: isDefenderChoiceConfirmed,
              },
            ],
            civilClaimants: [
              {
                hasSpokesperson: true,
                spokespersonNationalId: spokesperson.nationalId,
                spokespersonName: spokesperson.name,
                spokespersonEmail: spokesperson.email,
              },
            ],
          } as Case,
          {
            user,
            type: CaseNotificationType.CASE_FILES_UPDATED,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('notification sent by prosecutor when defender is confirmed', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        role: UserRole.PROSECUTOR,
        institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
      } as unknown as User)
    })

    it('should send notifications', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge.name, address: judge.email }],
          subject: `Ný gögn í máli ${courtCaseNumber}`,
          html: `Ný gögn hafa borist vegna máls ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/domur/akaera/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: registrar.name, address: registrar.email }],
          subject: `Ný gögn í máli ${courtCaseNumber}`,
          html: `Ný gögn hafa borist vegna máls ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/domur/akaera/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: spokesperson.name, address: spokesperson.email }],
          subject: `Ný gögn í máli ${courtCaseNumber}`,
          html: `Ný gögn hafa borist vegna máls ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/verjandi/akaera/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Ný gögn í máli ${courtCaseNumber}`,
          html: `Ný gögn hafa borist vegna máls ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/verjandi/akaera/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent by prosecutor when defender choice is not confirmed', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        {
          role: UserRole.PROSECUTOR,
          institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
        } as unknown as User,
        false,
      )
    })

    it('should not send an email to the defender', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
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
          to: [{ name: judge.name, address: judge.email }],
          subject: `Ný gögn í máli ${courtCaseNumber}`,
          html: `Ný gögn hafa borist vegna máls ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/domur/akaera/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: spokesperson.name, address: spokesperson.email }],
          subject: `Ný gögn í máli ${courtCaseNumber}`,
          html: `Ný gögn hafa borist vegna máls ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/verjandi/akaera/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Ný gögn í máli ${courtCaseNumber}`,
          html: `Ný gögn hafa borist vegna máls ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/akaera/stadfesta/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
