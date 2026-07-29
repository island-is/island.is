import { v4 as uuid } from 'uuid'

import { ConfigType } from '@nestjs/config'

import { EmailService } from '@island.is/email-service'

import {
  CaseType,
  RequestCaseNotificationType,
  TrackedNotificationType,
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

type GivenWhenThen = (
  theCase: object,
  notifications?: Notification[],
) => Promise<Then>

describe('InternalNotificationController - Send revoked notifications for request cases', () => {
  const { judge, registrar } = createTestUsers(['judge', 'registrar'])
  const caseId = uuid()
  const courtId = 'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf'
  const prosecutorsOfficeName = uuid()
  const courtName = uuid()
  const courtCaseNumber = 'R-369/2025'

  let mockEmailService: EmailService
  let mockNotificationModel: typeof Notification
  let mockConfig: ConfigType<typeof notificationModuleConfig>
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

    givenWhenThen = async (theCase: object, notifications?: Notification[]) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          { ...theCase, notifications } as Case,
          { type: RequestCaseNotificationType.REVOKED } as CaseNotificationDto,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('when judge and registrar are assigned', () => {
    let then: Then

    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      courtId,
      court: { name: courtName },
      courtCaseNumber,
      judge: { name: judge.name, email: judge.email },
      registrar: { name: registrar.name, email: registrar.email },
      creatingProsecutor: { institution: { name: prosecutorsOfficeName } },
    }

    beforeEach(async () => {
      then = await givenWhenThen(theCase)
    })

    it('should send email to judge and registrar', () => {
      const subject = `Krafa afturkölluð í máli ${courtCaseNumber}`
      const body = `${prosecutorsOfficeName} hefur afturkallað kröfu í máli ${courtCaseNumber}.`

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ address: judge.email, name: judge.name }],
          subject,
          html: body,
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ address: registrar.email, name: registrar.name }],
          subject,
          html: body,
        }),
      )
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId,
        type: RequestCaseNotificationType.REVOKED,
        recipients: [
          { address: judge.email, success: true },
          { address: registrar.email, success: true },
        ],
      })
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('when neither judge nor registrar are assigned', () => {
    let then: Then

    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      courtId,
      court: { name: courtName },
      courtCaseNumber,
      creatingProsecutor: { institution: { name: prosecutorsOfficeName } },
    }

    beforeEach(async () => {
      then = await givenWhenThen(theCase)
    })

    it('should send email to general court email', () => {
      const courtEmail = mockConfig.email.courtsEmails[courtId]
      const subject = `Krafa afturkölluð í máli ${courtCaseNumber}`
      const body = `${prosecutorsOfficeName} hefur afturkallað kröfu í máli ${courtCaseNumber}.`

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ address: courtEmail, name: courtName }],
          subject,
          html: body,
        }),
      )
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId,
        type: RequestCaseNotificationType.REVOKED,
        recipients: [{ address: courtEmail, success: true }],
      })
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('when case has no court case number', () => {
    let then: Then

    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      courtId,
      court: { name: courtName },
      judge: { name: judge.name, email: judge.email },
      registrar: { name: registrar.name, email: registrar.email },
      creatingProsecutor: { institution: { name: prosecutorsOfficeName } },
    }

    beforeEach(async () => {
      then = await givenWhenThen(theCase)
    })

    it('should not send court email notification', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
