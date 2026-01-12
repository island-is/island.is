import { v4 as uuid } from 'uuid'

import { SmsService } from '@island.is/nova-sms'

import {
  CaseNotificationType,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalNotificationController - Send heads up notifications', () => {
  const userId = uuid()
  const courtId = uuid()
  const mobileNumber = uuid()

  let mockSmsService: SmsService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_MOBILE_NUMBERS = `{"${courtId}": "${mobileNumber}"}`

    const { smsService, internalNotificationController } =
      await createTestingNotificationModule()

    mockSmsService = smsService

    givenWhenThen = async (caseId, theCase) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(caseId, theCase, {
          user: { id: userId } as User,
          type: CaseNotificationType.HEADS_UP,
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
        'Ný gæsluvarðhaldskrafa í vinnslu. Sækjandi: Ekki skráður. Sjá nánar á rettarvorslugatt.island.is.',
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
