import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import {
  CaseAppealRulingDecision,
  CaseDecision,
  CaseNotificationType,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  defenderNationalId?: string,
  appealRulingDecision?: CaseAppealRulingDecision,
) => Promise<Then>

describe('InternalNotificationController - Send appeal completed notifications', () => {
  const { prosecutor, defender, judge, courtOfAppeals } = createTestUsers([
    'prosecutor',
    'defender',
    'judge',
    'courtOfAppeals',
  ])
  const userId = uuid()
  const caseId = uuid()
  const courtCaseNumber = uuid()
  const appealCaseNumber = uuid()
  const courtId = uuid()

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_EMAILS = `{"4676f08b-aab4-4b4f-a366-697540788088":"${courtOfAppeals.email}"}`

    const { emailService, notificationConfig, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService
    mockConfig = notificationConfig

    givenWhenThen = async (
      defenderNationalId?: string,
      appealRulingDecision?: CaseAppealRulingDecision,
    ) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            type: CaseType.CUSTODY,
            state: CaseState.ACCEPTED,
            decision: CaseDecision.ACCEPTING,
            appealRulingDecision:
              appealRulingDecision ?? CaseAppealRulingDecision.ACCEPTING,
            prosecutor: { name: prosecutor.name, email: prosecutor.email },
            judge: { name: judge.name, email: judge.email },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            defenderNationalId,
            defenderName: defender.name,
            defenderEmail: defender.email,
            courtCaseNumber,
            appealCaseNumber,
            courtId: courtId,
          } as Case,
          {
            user: { id: userId } as User,
            type: CaseNotificationType.APPEAL_COMPLETED,
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

    it('should send notifications', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge.name, address: judge.email }],
          subject: `Úrskurður í landsréttarmáli ${appealCaseNumber} (${courtCaseNumber})`,
          html: `Landsréttur hefur úrskurðað í máli ${appealCaseNumber} (héraðsdómsmál nr. ${courtCaseNumber}). Niðurstaða Landsréttar: Staðfest. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Úrskurður í landsréttarmáli ${appealCaseNumber} (${courtCaseNumber})`,
          html: `Landsréttur hefur úrskurðað í máli ${appealCaseNumber} (héraðsdómsmál nr. ${courtCaseNumber}). Niðurstaða Landsréttar: Staðfest. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Fangelsismálastofnun',
              address: mockConfig.email.prisonAdminEmail,
            },
          ],
          subject: `Úrskurður í landsréttarmáli ${appealCaseNumber} (${courtCaseNumber})`,
          html: `Landsréttur hefur úrskurðað í máli ${appealCaseNumber} (héraðsdómsmál nr. ${courtCaseNumber}). Niðurstaða Landsréttar: Staðfest. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Gæsluvarðhaldsfangelsi',
              address: mockConfig.email.prisonEmail,
            },
          ],
          subject: `Úrskurður í landsréttarmáli ${appealCaseNumber} (${courtCaseNumber})`,
          html: `Landsréttur hefur úrskurðað í máli ${appealCaseNumber} (héraðsdómsmál nr. ${courtCaseNumber}). Niðurstaða Landsréttar: Staðfest. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/krafa/yfirlit/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Úrskurður í landsréttarmáli ${appealCaseNumber} (${courtCaseNumber})`,
          html: `Landsréttur hefur úrskurðað í máli ${appealCaseNumber} (héraðsdómsmál nr. ${courtCaseNumber}). Niðurstaða Landsréttar: Staðfest. Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/verjandi/krafa/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent with missing defender national id', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should send notification without a link to defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Úrskurður í landsréttarmáli ${appealCaseNumber} (${courtCaseNumber})`,
          html: `Landsréttur hefur úrskurðað í máli ${appealCaseNumber} (héraðsdómsmál nr. ${courtCaseNumber}). Niðurstaða Landsréttar: Staðfest. Hægt er að nálgast gögn málsins hjá Héraðsdómi Reykjavíkur ef þau hafa ekki þegar verið afhent.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification sent in discontinued appeal', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen('', CaseAppealRulingDecision.DISCONTINUED)
    })

    it('should send notification about discontinuance', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Niðurfelling máls ${appealCaseNumber} (${courtCaseNumber})`,
          html: `Landsréttur hefur móttekið afturköllun á kæru í máli ${courtCaseNumber}. Landsréttarmálið ${appealCaseNumber} hefur verið fellt niður. Hægt er að nálgast yfirlitssíðu málsins í <a href="${mockConfig.clientUrl}">Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Niðurfelling máls ${appealCaseNumber} (${courtCaseNumber})`,
          html: `Landsréttur hefur móttekið afturköllun á kæru í máli ${courtCaseNumber}. Landsréttarmálið ${appealCaseNumber} hefur verið fellt niður.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
