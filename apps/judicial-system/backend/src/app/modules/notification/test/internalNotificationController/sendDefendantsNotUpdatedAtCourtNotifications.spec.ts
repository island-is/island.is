import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import {
  CaseNotificationType,
  NotificationType,
  User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { Case } from '../../../repository'
import { CaseNotificationDto } from '../../dto/caseNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  notificationDto: CaseNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send defendants not updated at court notifications', () => {
  const userId = uuid()
  const notificationDto: CaseNotificationDto = {
    user: { id: userId } as User,
    type: CaseNotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
  }

  const { registrar } = createTestUsers(['registrar', 'defender'])
  const caseId = uuid()
  const courtCaseNumber = uuid()

  const theCase = {
    id: caseId,
    courtCaseNumber,
    registrar: { name: registrar.name, email: registrar.email },
  } as Case

  let mockEmailService: EmailService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      notificationDto: CaseNotificationDto,
    ) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(caseId, theCase, notificationDto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('email sent', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase, notificationDto)
    })

    it('should send email', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: registrar.name, address: registrar.email }],
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
      then = await givenWhenThen(
        caseId,
        {
          ...theCase,
          notifications: [
            {
              type: NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
              recipients: [{ address: registrar.email, success: true }],
            },
          ],
        } as Case,
        notificationDto,
      )
    })

    it('should not send email', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
