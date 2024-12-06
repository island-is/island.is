import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import {
  CaseNotificationType,
  CaseOrigin,
  IndictmentCaseNotificationType,
  NotificationType,
  ServiceRequirement,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../../createTestingNotificationModule'

import { Case } from '../../../../case'
import { CaseNotificationDto } from '../../../dto/caseNotification.dto'
import { DeliverResponse } from '../../../models/deliver.response'
import { Notification } from '../../../models/notification.model'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  notificationType: IndictmentCaseNotificationType,
) => Promise<Then>

describe('IndictmentCaseService', () => {
  const { prosecutorsOffice, defender } = createTestUsers([
    'prosecutorsOffice',
    'defender',
  ])
  const caseId = uuid()
  const courtName = uuid()
  const prosecutorsOfficeName = prosecutorsOffice.name
  const prosecutorsOfficeEmail = prosecutorsOffice.email
  const prosecutorInstitutionId = uuid()
  const courtCaseNumber = uuid()
  let theCase = {
    id: caseId,
    court: { name: courtName },
    origin: CaseOrigin.LOKE,
    defendants: [
      {
        defenderNationalId: defender.nationalId,
        defenderName: defender.name,
        defenderEmail: defender.email,
        serviceRequirement: ServiceRequirement.REQUIRED,
      },
    ],
    prosecutor: {
      institution: { name: prosecutorsOfficeName, id: prosecutorInstitutionId },
    },

    courtCaseNumber,
  } as Case

  let mockEmailService: EmailService
  let givenWhenThen: GivenWhenThen

  process.env.POLICE_INSTITUTIONS_EMAILS = `{"${prosecutorInstitutionId}": "${prosecutorsOfficeEmail}"}`

  beforeEach(async () => {
    const { emailService, indictmentCaseNotificationService } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (
      theCase: Case,
      notificationType: IndictmentCaseNotificationType,
    ) => {
      const then = {} as Then

      await indictmentCaseNotificationService
        .sendIndictmentCaseNotification(notificationType, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('notifications sent to institution with registered e-mail', () => {
    it('should send a notification', async () => {
      const then = await givenWhenThen(
        theCase,
        IndictmentCaseNotificationType.INDICTMENT_VERDICT_INFO,
      )

      expect(mockEmailService.sendEmail).toBeCalledWith(
        expect.objectContaining({
          to: [
            { address: prosecutorsOfficeEmail, name: prosecutorsOfficeName },
          ],
          subject: `Máli lokið ${courtCaseNumber}`,
          text: expect.stringContaining(
            `Máli ${courtCaseNumber} hjá ${courtName} hefur verið lokið.`,
          ),
        }),
      )

      expect(then.result.delivered).toEqual(true)
    })
  })

  describe('notifications sent to institution without registered e-mail', () => {
    it('should not send a notification', async () => {
      const invalidProsecutorInstitutionId = uuid()
      theCase = {
        ...theCase,
        prosecutor: {
          ...theCase.prosecutor,
          institution: {
            ...theCase.prosecutor?.institution,
            id: invalidProsecutorInstitutionId,
          },
        },
      } as Case

      await givenWhenThen(
        theCase,
        IndictmentCaseNotificationType.INDICTMENT_VERDICT_INFO,
      )

      expect(mockEmailService.sendEmail).not.toBeCalled()
    })
  })
})
