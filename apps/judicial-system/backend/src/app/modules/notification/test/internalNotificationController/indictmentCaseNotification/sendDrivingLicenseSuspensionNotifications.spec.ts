import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import { IndictmentCaseNotificationType } from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../../createTestingNotificationModule'

import { Case } from '../../../../repository'
import { DeliverResponse } from '../../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  notificationType: IndictmentCaseNotificationType,
) => Promise<Then>

describe('IndictmentCaseService - sendDrivingLicenseSuspensionNotifications', () => {
  const { prosecutorsOffice } = createTestUsers(['prosecutorsOffice'])
  const caseId = uuid()
  const prosecutorsOfficeId = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'
  const prosecutorsOfficeName = prosecutorsOffice.name
  const contactEmail = 'contact@prosecutorsoffice.is'
  const courtCaseNumber = '123-456/2024'
  const policeCaseNumbers = ['LÖKE-2024-001', 'LÖKE-2024-002']

  let theCase: Case
  let mockEmailService: EmailService
  let institutionContactRepositoryService: any
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.resetAllMocks()

    theCase = {
      id: caseId,
      court: { name: courtName },
      courtCaseNumber,
      policeCaseNumbers,
      prosecutorsOfficeId,
      prosecutorsOffice: {
        id: prosecutorsOfficeId,
        name: prosecutorsOfficeName,
      },
    } as Case

    const {
      emailService,
      indictmentCaseNotificationService,
      institutionContactRepositoryService: icrs,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    institutionContactRepositoryService = icrs

    // Mock the getInstitutionContact to return the contact email
    ;(
      institutionContactRepositoryService.getInstitutionContact as jest.Mock
    ).mockResolvedValue(contactEmail)

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

  describe('when prosecutors office ID is provided and contact info exists', () => {
    it('should send notification with institution contact', async () => {
      const then = await givenWhenThen(
        theCase,
        IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
      )

      expect(
        institutionContactRepositoryService.getInstitutionContact,
      ).toHaveBeenCalledWith(
        prosecutorsOfficeId,
        IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
      )

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: prosecutorsOfficeName,
              address: contactEmail,
            },
          ],
          subject: `Svipting í máli ${courtCaseNumber}`,
          html: expect.stringContaining(
            `Skrá skal sviptingu ökuréttinda í ökuskírteinaskrá vegna máls ${courtCaseNumber}`,
          ),
        }),
      )

      expect(then.result.delivered).toEqual(true)
    })

    it('should include police case number in email body', async () => {
      await givenWhenThen(
        theCase,
        IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
      )

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining(`LÖKE númer: ${policeCaseNumbers}`),
        }),
      )
    })
  })

  describe('when prosecutors office ID is not provided', () => {
    it('should not send notification', async () => {
      const caseWithoutProsecutorsOfficeId = {
        ...theCase,
        prosecutorsOfficeId: undefined,
      } as Case

      const then = await givenWhenThen(
        caseWithoutProsecutorsOfficeId,
        IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
      )

      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result.delivered).toEqual(false)
    })
  })

  describe('when institution contact email is not found', () => {
    it('should not send notification', async () => {
      ;(
        institutionContactRepositoryService.getInstitutionContact as jest.Mock
      ).mockResolvedValue(null)

      const then = await givenWhenThen(
        theCase,
        IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
      )

      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result.delivered).toEqual(false)
    })
  })

  describe('institution contact repository service call', () => {
    it('should call getInstitutionContact with correct parameters', async () => {
      await givenWhenThen(
        theCase,
        IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
      )

      expect(
        institutionContactRepositoryService.getInstitutionContact,
      ).toHaveBeenCalledTimes(1)
      expect(
        institutionContactRepositoryService.getInstitutionContact,
      ).toHaveBeenCalledWith(
        prosecutorsOfficeId,
        IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
      )
    })
  })
})
