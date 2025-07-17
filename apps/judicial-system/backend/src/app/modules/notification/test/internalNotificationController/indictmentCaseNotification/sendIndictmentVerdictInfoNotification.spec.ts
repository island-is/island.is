import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import {
  CaseIndictmentRulingDecision,
  CaseOrigin,
  IndictmentCaseNotificationType,
  ServiceRequirement,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../../createTestingNotificationModule'

import { Case } from '../../../../case'
import { DeliverResponse } from '../../../models/deliver.response'

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
  const courtName = 'Héraðsdómur Reykjavíkur'
  const prosecutorsOfficeName = prosecutorsOffice.name
  const prosecutorsOfficeEmail = prosecutorsOffice.email
  const prosecutorInstitutionId = uuid()
  const courtCaseNumber = uuid()
  const policeCaseNumbers = [uuid()]
  let theCase = {
    id: caseId,
    court: { name: courtName },
    origin: CaseOrigin.LOKE,
    defendants: [
      {
        defenderNationalId: defender.nationalId,
        defenderName: defender.name,
        defenderEmail: defender.email,
        verdict: { serviceRequirement: ServiceRequirement.REQUIRED },
      },
    ],
    prosecutor: {
      institution: { name: prosecutorsOfficeName, id: prosecutorInstitutionId },
    },
    courtCaseNumber,
    policeCaseNumbers,
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
    it('should not send a notification if indictment ruling decision is not RULING', async () => {
      const then = await givenWhenThen(
        theCase,
        IndictmentCaseNotificationType.INDICTMENT_VERDICT_INFO,
      )

      expect(mockEmailService.sendEmail).toBeCalledTimes(0)
      expect(then.result.delivered).toEqual(true)
    })

    it('should send a notification when indictment ruling decision is RULING', async () => {
      const caseWithRulingDecision = {
        ...theCase,
        indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      } as Case

      const then = await givenWhenThen(
        caseWithRulingDecision,
        IndictmentCaseNotificationType.INDICTMENT_VERDICT_INFO,
      )

      expect(mockEmailService.sendEmail).toBeCalledWith(
        expect.objectContaining({
          to: [
            { address: prosecutorsOfficeEmail, name: prosecutorsOfficeName },
          ],
          subject: expect.stringContaining(`Máli lokið ${courtCaseNumber}`),
          html: expect.stringContaining(
            `Máli ${courtCaseNumber} hjá Héraðsdómi Reykjavíkur hefur verið lokið.`,
          ),
        }),
      )

      expect(then.result).toEqual({ delivered: true })
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
