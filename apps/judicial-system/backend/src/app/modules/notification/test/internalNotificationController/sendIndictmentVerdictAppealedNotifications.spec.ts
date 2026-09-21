import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import {
  CaseType,
  IndictmentCaseNotificationType,
  RequestCaseNotificationType,
  User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { Case, InstitutionContactRepositoryService } from '../../../repository'
import { CaseNotificationDto } from '../../dto/caseNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'

jest.mock('../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (theCase: Case) => Promise<Then>

describe('InternalNotificationController - Send indictment verdict appealed notification', () => {
  const caseId = uuid()
  const userId = uuid()
  const courtCaseNumber = 'S-123/2026'
  const { prosecutor } = createTestUsers(['prosecutor'])

  const notificationDto: CaseNotificationDto = {
    user: { id: userId } as User,
    type: IndictmentCaseNotificationType.INDICTMENT_VERDICT_APPEALED as unknown as RequestCaseNotificationType,
  }

  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    courtCaseNumber,
    prosecutor: { name: prosecutor.name, email: prosecutor.email },
  } as unknown as Case

  let mockEmailService: EmailService
  let mockInstitutionContactRepositoryService: InstitutionContactRepositoryService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      internalNotificationController,
      institutionContactRepositoryService,
      notificationConfig,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockInstitutionContactRepositoryService =
      institutionContactRepositoryService
    mockConfig = notificationConfig

    givenWhenThen = async (aCase: Case) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(caseId, aCase, notificationDto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('the public prosecution is told', () => {
    let then: Then

    beforeEach(async () => {
      const mockGetInstitutionContact =
        mockInstitutionContactRepositoryService.getInstitutionContact as jest.Mock
      mockGetInstitutionContact.mockResolvedValue('saksoknari@saksoknari.is')

      then = await givenWhenThen(theCase)
    })

    // The address is the one recorded for this notification type against the
    // public prosecution, not a configured constant.
    it('should look the address up by institution and notification type', () => {
      expect(
        mockInstitutionContactRepositoryService.getInstitutionContact,
      ).toHaveBeenCalledWith(
        mockConfig.publicProsecutorId,
        IndictmentCaseNotificationType.INDICTMENT_VERDICT_APPEALED,
      )
    })

    it('should send the email the design asked for', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            { name: 'Ríkissaksóknari', address: 'saksoknari@saksoknari.is' },
          ],
          subject: `Áfrýjun í máli ${courtCaseNumber}`,
          html: `Dómi héraðsdóms í máli ${courtCaseNumber} hefur verið áfrýjað. Sjá nánar á yfirliti málsins í Réttarvörslugátt.`,
        }),
      )
      expect(then.result).toEqual({ delivered: true })
    })

    // The prosecutor of the case is not a recipient - this notification exists
    // to tell the public prosecution's office, and nobody else.
    it('should tell nobody else', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
    })
  })

  describe('no address is recorded', () => {
    let then: Then

    beforeEach(async () => {
      const mockGetInstitutionContact =
        mockInstitutionContactRepositoryService.getInstitutionContact as jest.Mock
      mockGetInstitutionContact.mockResolvedValue(null)

      then = await givenWhenThen(theCase)
    })

    it('should send nothing rather than guess a recipient', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: false })
    })
  })
})
