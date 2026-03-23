import { v4 as uuid } from 'uuid'

import { ConfigType } from '@nestjs/config'

import { EmailService } from '@island.is/email-service'

import {
  CaseNotificationType,
  CaseType,
  NotificationType,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { Case, Notification } from '../../../repository'
import { CaseNotificationDto } from '../../dto/caseNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (notifications?: Notification[]) => Promise<Then>

describe('InternalNotificationController - Send revoked notifications for indictment cases', () => {
  const { judge, registrar, defender } = createTestUsers([
    'judge',
    'registrar',
    'defender',
  ])
  const caseId = uuid()

  const prosecutorsOfficeName = uuid()
  const courtName = uuid()
  const courtCaseNumber = uuid()
  const policeCaseNumbers = ['007-2022-01']
  let mockConfig: ConfigType<typeof notificationModuleConfig>

  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    judge: { name: judge.name, email: judge.email },
    registrar: { name: registrar.name, email: registrar.email },
    defendants: [
      {
        defenderNationalId: defender.nationalId,
        defenderName: defender.name,
        defenderEmail: defender.email,
      },
    ],
    creatingProsecutor: { institution: { name: prosecutorsOfficeName } },
    court: { name: courtName },
    courtCaseNumber,
    policeCaseNumbers,
  }

  let mockEmailService: EmailService
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      notificationModel,
      internalNotificationController,
      notificationConfig,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockNotificationModel = notificationModel
    mockConfig = notificationConfig

    givenWhenThen = async (notifications?: Notification[]) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          theCase.id,
          { ...theCase, notifications } as Case,
          { type: CaseNotificationType.REVOKED } as CaseNotificationDto,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('notifications sent', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen([
        {
          type: NotificationType.COURT_DATE,
          recipients: [{ address: defender.email, success: true }],
        } as Notification,
      ])
    })

    it('should send a notifications', () => {
      const subject = `Ákæra afturkölluð í máli ${courtCaseNumber}`
      const courtHtml = `${prosecutorsOfficeName} hefur afturkallað ákæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins í <a href="${mockConfig.clientUrl}">Réttarvörslugátt</a>.`
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ address: judge.email, name: judge.name }],
          subject,
          html: courtHtml,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ address: registrar.email, name: registrar.name }],
          subject,
          html: courtHtml,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ address: defender.email, name: defender.name }],
          subject,
          html: `${prosecutorsOfficeName} hefur afturkallað ákæru í máli ${courtCaseNumber}.<br /><br />Hægt er að nálgast yfirlitssíðu málsins á <a href="${mockConfig.clientUrl}/verjandi/akaera/${theCase.id}">rettarvorslugatt.island.is</a>.`,
        }),
      )
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId: caseId,
        type: CaseNotificationType.REVOKED,
        recipients: [
          { address: judge.email, success: true },
          { address: registrar.email, success: true },
          { address: defender.email, success: true },
        ],
      })
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
