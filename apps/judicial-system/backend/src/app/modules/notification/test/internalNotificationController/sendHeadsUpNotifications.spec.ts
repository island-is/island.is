import { uuid } from 'uuidv4'

import { CaseType, NotificationType } from '@island.is/judicial-system/types'
import { SmsService } from '@island.is/nova-sms'

import { Case } from '../../../case'
import { DeliverResponse } from '../../models/deliver.response'
import { createTestingNotificationModule } from '../createTestingNotificationModule'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalNotificationController - Send heads up notification', () => {
  const userId = uuid()
  const courtId = uuid()
  const mobileNumber = uuid()

  let mockSmsService: SmsService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_MOBILE_NUMBERS = `{"${courtId}": "${mobileNumber}"}`

    const {
      smsService,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockSmsService = smsService

    givenWhenThen = async (caseId, theCase) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(caseId, theCase, {
          userId,
          type: NotificationType.HEADS_UP,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('notification sent', () => {
    const caseId = uuid()
    const theCase = { id: caseId, type: CaseType.CUSTODY, courtId } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase)
    })

    it('should send notification', () => {
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [mobileNumber],
        'Ný gæsluvarðhaldskrafa í vinnslu. Sækjandi: Ekki skráður.',
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
