import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  InstitutionNotificationType,
  InstitutionType,
  NotificationDispatchType,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { InstitutionService } from '../../../institution'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalNotificationController - Dispatch public prosecutor verdict appeal deadline reminder notifications', () => {
  const publicProsecutorsOfficeId1 = uuid()
  const publicProsecutorsOfficeId2 = uuid()

  let mockQueuedMessages: Message[]
  let mockInstitutionService: InstitutionService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      queuedMessagesAfterCommit,
      institutionService,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockQueuedMessages = queuedMessagesAfterCommit
    mockInstitutionService = institutionService

    const mockGetAll = mockInstitutionService.getAll as jest.Mock
    mockGetAll.mockResolvedValueOnce([
      { id: publicProsecutorsOfficeId1 },
      { id: publicProsecutorsOfficeId2 },
    ])

    givenWhenThen = async () => {
      const then = {} as Then

      await internalNotificationController
        .dispatchNotification({
          type: NotificationDispatchType.PUBLIC_PROSECUTOR_VERDICT_APPEAL_DEADLINE_REMINDER,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('messages queued', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should send a message to queue per public prosecutors office', () => {
      expect(mockInstitutionService.getAll).toHaveBeenCalledWith([
        InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      ])
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.INSTITUTION_NOTIFICATION,
          body: {
            type: InstitutionNotificationType.PUBLIC_PROSECUTOR_VERDICT_APPEAL_DEADLINE_REMINDER,
            prosecutorsOfficeId: publicProsecutorsOfficeId1,
          },
        },
        {
          type: MessageType.INSTITUTION_NOTIFICATION,
          body: {
            type: InstitutionNotificationType.PUBLIC_PROSECUTOR_VERDICT_APPEAL_DEADLINE_REMINDER,
            prosecutorsOfficeId: publicProsecutorsOfficeId2,
          },
        },
      ])
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
