import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import { NotificationType } from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../case'
import { CaseNotificationDto } from '../../dto/caseNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { Notification } from '../../models/notification.model'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (notifications?: Notification[]) => Promise<Then>

describe('InternalNotificationController - Send revoked notifications for indictment cases', () => {
  const caseId = uuid()
  const judgeName = uuid()
  const judgeEmail = uuid()
  const registrarName = uuid()
  const registrarEmail = uuid()
  const defenderNationalId = uuid()
  const defenderName = uuid()
  const defenderEmail = uuid()
  const prosecutorsOfficeName = uuid()
  const courtName = uuid()
  const courtCaseNumber = uuid()
  const theCase = {
    id: caseId,
    judge: { name: judgeName, email: judgeEmail },
    registrar: { name: registrarName, email: registrarEmail },
    defendants: [{ defenderNationalId, defenderName, defenderEmail }],
    creatingProsecutor: { institution: { name: prosecutorsOfficeName } },
    court: { name: courtName },
    courtCaseNumber,
  }

  let mockEmailService: EmailService
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, notificationModel, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService
    mockNotificationModel = notificationModel

    givenWhenThen = async (notifications?: Notification[]) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          theCase.id,
          { ...theCase, notifications } as Case,
          { type: NotificationType.REVOKED } as CaseNotificationDto,
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
          recipients: [{ address: defenderEmail, success: true }],
        } as Notification,
      ])
    })

    it('should send a notifications', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ address: judgeEmail, name: judgeName }],
          subject: `Ákæra afturkölluð í máli ${courtCaseNumber}`,
          html: `${prosecutorsOfficeName} hefur afturkallað ákæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ address: registrarEmail, name: registrarName }],
          subject: `Ákæra afturkölluð í máli ${courtCaseNumber}`,
          html: `${prosecutorsOfficeName} hefur afturkallað ákæru í máli ${courtCaseNumber}. Hægt er að nálgast yfirlitssíðu málsins á <a href="https://rettarvorslugatt.island.is">rettarvorslugatt.island.is</a>.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ address: defenderEmail, name: defenderName }],
          subject: `Ákæra afturkölluð í máli ${courtCaseNumber}`,
          html: `Dómstóllinn hafði skráð þig sem verjanda í málinu.<br /><br />Sjá nánar á <a href="http://localhost:4200/verjandi/akaera/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId: caseId,
        type: NotificationType.REVOKED,
        recipients: [
          { address: judgeEmail, success: true },
          { address: registrarEmail, success: true },
          { address: defenderEmail, success: true },
        ],
      })
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
