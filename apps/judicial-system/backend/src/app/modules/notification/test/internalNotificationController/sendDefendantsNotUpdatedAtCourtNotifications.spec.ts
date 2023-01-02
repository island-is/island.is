import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'
import { NotificationType } from '@island.is/judicial-system/types'

import { Case } from '../../../case'
import { SendNotificationDto } from '../../dto/sendNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { Notification } from '../../models/notification.model'
import { createTestingNotificationModule } from '../createTestingNotificationModule'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  notification: SendNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send defendants not updated at court notifications', () => {
  const notification: SendNotificationDto = {
    type: NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
  }
  const caseId = uuid()
  const courtCaseNumber = uuid()
  const judgeName = uuid()
  const judgeEmail = uuid()
  const registrarName = uuid()
  const registrarEmail = uuid()
  const theCase = {
    id: caseId,
    courtCaseNumber,
    judge: { name: judgeName, email: judgeEmail },
    registrar: { name: registrarName, email: registrarEmail },
  } as Case

  let mockEmailService: EmailService
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      notificationModel,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockNotificationModel = notificationModel

    const mockFindAll = mockNotificationModel.findAll as jest.Mock
    mockFindAll.mockResolvedValue([])

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      notification: SendNotificationDto,
    ) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(caseId, theCase, notification)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('email sent', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase, notification)
    })

    it('should send email', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judgeName, address: judgeEmail }],
          subject: `Skráning varnaraðila/verjenda í máli ${courtCaseNumber}`,
          html: `Ekki tókst að skrá varnaraðila/verjendur í máli ${courtCaseNumber} í Auði. Yfirfara þarf málið í Auði og skrá rétta aðila áður en því er lokað.`,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: registrarName, address: registrarEmail }],
          subject: `Skráning varnaraðila/verjenda í máli ${courtCaseNumber}`,
          html: `Ekki tókst að skrá varnaraðila/verjendur í máli ${courtCaseNumber} í Auði. Yfirfara þarf málið í Auði og skrá rétta aðila áður en því er lokað.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('email already sent', () => {
    let then: Then

    beforeEach(async () => {
      const mockFindAll = mockNotificationModel.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce([
        { recipients: [{ address: judgeEmail, success: true }] },
      ])
      then = await givenWhenThen(caseId, theCase, notification)
    })

    it('should not send email', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
