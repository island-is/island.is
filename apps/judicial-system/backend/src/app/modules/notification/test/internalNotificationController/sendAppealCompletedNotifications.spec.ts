import { uuid } from 'uuidv4'

import { ConfigType } from '@island.is/nest/config'
import { EmailService } from '@island.is/email-service'
import {
  CaseDecision,
  CaseState,
  CaseType,
  NotificationType,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../../../case'
import { notificationModuleConfig } from '../../notification.config'
import { DeliverResponse } from '../../models/deliver.response'
import { createTestingNotificationModule } from '../createTestingNotificationModule'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (defenderNationalId?: string) => Promise<Then>

describe('InternalNotificationController - Send appeal completed notifications', () => {
  const userId = uuid()
  const caseId = uuid()
  const prosecutorName = uuid()
  const prosecutorEmail = uuid()
  const defenderName = uuid()
  const defenderEmail = uuid()
  const judgeName = uuid()
  const judgeEmail = uuid()
  const courtCaseNumber = uuid()
  const appealCaseNumber = uuid()

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      notificationConfig,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockConfig = notificationConfig

    givenWhenThen = async (defenderNationalId?: string) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            type: CaseType.CUSTODY,
            state: CaseState.ACCEPTED,
            decision: CaseDecision.ACCEPTING,
            prosecutor: { name: prosecutorName, email: prosecutorEmail },
            judge: { name: judgeName, email: judgeEmail },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            defenderNationalId,
            defenderName: defenderName,
            defenderEmail: defenderEmail,
            courtCaseNumber,
            appealCaseNumber,
          } as Case,
          {
            user: { id: userId } as User,
            type: NotificationType.APPEAL_COMPLETED,
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
          to: [{ name: judgeName, address: judgeEmail }],
          subject: `Úrskurður í landsréttarmáli ${appealCaseNumber} (${courtCaseNumber})`,
          html: `Landsréttur hefur úrskurðað í máli ${appealCaseNumber} (héraðsdómsmál nr. ${courtCaseNumber}). Hægt er að nálgast gögn málsins í <a href="http://localhost:4200/krafa/yfirlit/${caseId}">Réttarvörslugátt</a> með rafrænum skilríkjum.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Úrskurður í landsréttarmáli ${appealCaseNumber} (${courtCaseNumber})`,
          html: `Landsréttur hefur úrskurðað í máli ${appealCaseNumber} (héraðsdómsmál nr. ${courtCaseNumber}). Hægt er að nálgast gögn málsins í <a href="http://localhost:4200/krafa/yfirlit/${caseId}">Réttarvörslugátt</a> með rafrænum skilríkjum.`,
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
          html: `Landsréttur hefur úrskurðað í máli ${appealCaseNumber} (héraðsdómsmál nr. ${courtCaseNumber}). Hægt er að nálgast gögn málsins í <a href="http://localhost:4200/krafa/yfirlit/${caseId}">Réttarvörslugátt</a> með rafrænum skilríkjum.`,
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
          html: `Landsréttur hefur úrskurðað í máli ${appealCaseNumber} (héraðsdómsmál nr. ${courtCaseNumber}). Hægt er að nálgast gögn málsins í <a href="http://localhost:4200/krafa/yfirlit/${caseId}">Réttarvörslugátt</a> með rafrænum skilríkjum.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Úrskurður í landsréttarmáli ${appealCaseNumber} (${courtCaseNumber})`,
          html: `Landsréttur hefur úrskurðað í máli ${appealCaseNumber} (héraðsdómsmál nr. ${courtCaseNumber}). Hægt er að nálgast gögn málsins í <a href="http://localhost:4200/verjandi/krafa/${caseId}">Réttarvörslugátt</a> með rafrænum skilríkjum.`,
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
          to: [{ name: defenderName, address: defenderEmail }],
          subject: `Úrskurður í landsréttarmáli ${appealCaseNumber} (${courtCaseNumber})`,
          html: `Landsréttur hefur úrskurðað í máli ${appealCaseNumber} (héraðsdómsmál nr. ${courtCaseNumber}). Hægt er að nálgast gögn málsins hjá Héraðsdómi Reykjavíkur ef þau hafa ekki þegar verið afhent.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
