import { uuid } from 'uuidv4'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  InstitutionType,
  NotificationType,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { InstitutionService } from '../../../institution'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalNotificationController - Dispatch indictments waiting for confirmation notifications', () => {
  const prosecutorsOfficeId1 = uuid()
  const prosecutorsOfficeId2 = uuid()
  let mockInstitutionService: InstitutionService
  let mockMessageService: MessageService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      institutionService,
      messageService,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockInstitutionService = institutionService
    mockMessageService = messageService

    const mockGetAll = mockInstitutionService.getAll as jest.Mock
    mockGetAll.mockResolvedValueOnce([
      { id: prosecutorsOfficeId1 },
      { id: prosecutorsOfficeId2 },
    ])

    const mockSendMessagesToQueue =
      messageService.sendMessagesToQueue as jest.Mock
    mockSendMessagesToQueue.mockResolvedValueOnce(undefined)

    givenWhenThen = async () => {
      const then = {} as Then

      await internalNotificationController
        .dispatchNotification({
          type: NotificationType.INDICTMENTS_WAITING_FOR_CONFIRMATION,
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

    it('should send message to queue', () => {
      expect(mockInstitutionService.getAll).toHaveBeenCalledWith(
        InstitutionType.PROSECUTORS_OFFICE,
      )
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.NOTIFICATION,
          body: {
            type: NotificationType.INDICTMENTS_WAITING_FOR_CONFIRMATION,
            prosecutorsOfficeId: prosecutorsOfficeId1,
          },
        },
        {
          type: MessageType.NOTIFICATION,
          body: {
            type: NotificationType.INDICTMENTS_WAITING_FOR_CONFIRMATION,
            prosecutorsOfficeId: prosecutorsOfficeId2,
          },
        },
      ])
      expect(then.result).toEqual({ delivered: true })
    })
  })
})