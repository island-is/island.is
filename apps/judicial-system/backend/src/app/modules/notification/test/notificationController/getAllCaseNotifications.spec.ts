import { uuid } from 'uuidv4'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../case'
import { Notification } from '../../models/notification.model'

interface Then {
  result: Notification[]
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('NotificationController - Get all case notifications', () => {
  const caseId = uuid()
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { notificationModel, notificationController } =
      await createTestingNotificationModule()

    mockNotificationModel = notificationModel

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        then.result = await notificationController.getAllCaseNotifications(
          caseId,
          { id: caseId } as Case,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('notifications returned', () => {
    const notifictions = [{ id: uuid() }, { id: uuid() }]
    let then: Then

    beforeEach(async () => {
      const mockFindAll = mockNotificationModel.findAll as jest.Mock
      mockFindAll.mockReturnValueOnce(notifictions)

      then = await givenWhenThen()
    })

    it('should return notifications', () => {
      expect(mockNotificationModel.findAll).toHaveBeenCalledWith({
        where: { caseId },
        order: [['created', 'DESC']],
      })
      expect(then.result).toBe(notifictions)
    })
  })
})
