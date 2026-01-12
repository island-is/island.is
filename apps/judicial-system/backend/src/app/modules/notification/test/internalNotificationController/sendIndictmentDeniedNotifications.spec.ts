import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import {
  CaseNotificationType,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { Case } from '../../../repository'
import { CaseNotificationDto } from '../../dto/caseNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  notificationDto: CaseNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send indictment denied notification', () => {
  const userId = uuid()
  const caseId = uuid()

  const { prosecutor } = createTestUsers(['prosecutor'])
  const prosecutorName = prosecutor.name
  const prosecutorEmail = prosecutor.email
  const policeCaseNumbers = [uuid(), uuid()]

  let mockEmailService: EmailService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (
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

  describe('notification sent', () => {
    let then: Then

    const notificationDto: CaseNotificationDto = {
      user: { id: userId } as User,
      type: CaseNotificationType.INDICTMENT_DENIED,
    }

    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      prosecutor: { name: prosecutorName, email: prosecutorEmail },
      policeCaseNumbers,
    } as Case

    beforeEach(async () => {
      then = await givenWhenThen(theCase, notificationDto)
    })

    it('should send notifications to prosecutor', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutorName, address: prosecutorEmail }],
          subject: `Ákæru hafnað`,
          html: `Ákæru vegna lögreglumáls númer ${policeCaseNumbers[0]} hefur verið hafnað. Þú getur nálgast samantekt málsins á <a href="http://localhost:4200/akaera/stadfesta/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })
})
