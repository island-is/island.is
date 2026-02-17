import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import { IndictmentCaseNotificationType } from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../../createTestingNotificationModule'

import { Case, Notification } from '../../../../repository'
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
  const courtName = 'Héraðsdómur Reykjavíkur'
  const prosecutorsOfficeName = prosecutorsOffice.name
  const courtCaseNumber = '123-456/2024'
  const policeCaseNumbers = ['LÖKE-2024-001', 'LÖKE-2024-002']

  let mockEmailService: EmailService
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.resetAllMocks()

    const {
      emailService,
      indictmentCaseNotificationService,
      institutionContactRepositoryService,
      notificationModel,
    } = await createTestingNotificationModule()

    const getInstitutionContactMock = jest.mocked(
      institutionContactRepositoryService.getInstitutionContact,
    )

    getInstitutionContactMock.mockResolvedValue('extra@omnitrix.is')

    mockEmailService = emailService
    mockNotificationModel = notificationModel

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
    beforeEach(async () => {
      const theCase = {
        id: caseId,
        court: { name: courtName },
        courtCaseNumber,
        policeCaseNumbers,
        prosecutorsOfficeId: prosecutorsOffice.id,
        prosecutorsOffice: {
          id: prosecutorsOffice.id,
          name: prosecutorsOfficeName,
        },
      } as Case

      await givenWhenThen(
        theCase,
        IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
      )
    })

    it('should send notification with institution contact', async () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: prosecutorsOfficeName,
              address: 'extra@omnitrix.is',
            },
          ],
          subject: `Svipting í máli ${courtCaseNumber}`,
          html: expect.stringContaining(
            `Skrá skal sviptingu ökuréttinda í ökuskírteinaskrá vegna máls ${courtCaseNumber}`,
          ),
        }),
      )
    })

    it('should record notification', () => {
      expect(mockNotificationModel.create).toHaveBeenCalledTimes(1)
      expect(mockNotificationModel.create).toHaveBeenCalledWith({
        caseId,
        type: IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
        recipients: ['extra@omnitrix.is'].map((email) => ({
          address: email,
          success: true,
        })),
      })
    })
  })
})
