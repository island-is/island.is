import { RolesRule, RulesType } from '@island.is/judicial-system/auth'

import { UserInitiatedNotificationType } from '../../dto/notification.dto'
import {
  defenderNotificationRule,
  districtCourtAssistantNotificationRule,
  districtCourtJudgeNotificationRule,
  districtCourtRegistrarNotificationRule,
  prosecutorNotificationRule,
} from '../../guards/rolesRules'
import { NotificationController } from '../../notification.controller'

const allowedNotificationTypes: {
  rule: RolesRule
  notificationTypes: UserInitiatedNotificationType[]
}[] = [
  {
    rule: prosecutorNotificationRule,
    notificationTypes: [
      UserInitiatedNotificationType.HEADS_UP,
      UserInitiatedNotificationType.READY_FOR_COURT,
      UserInitiatedNotificationType.CASE_FILES_UPDATED,
    ],
  },
  {
    rule: defenderNotificationRule,
    notificationTypes: [UserInitiatedNotificationType.CASE_FILES_UPDATED],
  },
  {
    rule: districtCourtJudgeNotificationRule,
    notificationTypes: [UserInitiatedNotificationType.ADVOCATE_ASSIGNED],
  },
  {
    rule: districtCourtRegistrarNotificationRule,
    notificationTypes: [UserInitiatedNotificationType.ADVOCATE_ASSIGNED],
  },
  {
    rule: districtCourtAssistantNotificationRule,
    notificationTypes: [UserInitiatedNotificationType.ADVOCATE_ASSIGNED],
  },
]

describe('NotificationController - Send case notification rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      NotificationController.prototype.sendCaseNotification,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(5)
    expect(rules).toContain(prosecutorNotificationRule)
    expect(rules).toContain(districtCourtJudgeNotificationRule)
    expect(rules).toContain(districtCourtRegistrarNotificationRule)
    expect(rules).toContain(districtCourtAssistantNotificationRule)
    expect(rules).toContain(defenderNotificationRule)
  })

  // A role that is not allowed to send a notification type is rejected before
  // the request reaches the controller
  it.each(allowedNotificationTypes)(
    'should allow $rule.role to send $notificationTypes',
    ({ rule, notificationTypes }) => {
      expect(rule.type).toBe(RulesType.FIELD_VALUES)
      expect(rule.dtoField).toBe('type')
      expect(rule.dtoFieldValues).toEqual(notificationTypes)
    },
  )

  it('should allow every user initiated notification type to be sent by some role', () => {
    const allAllowedTypes = new Set(
      allowedNotificationTypes.flatMap(
        ({ notificationTypes }) => notificationTypes,
      ),
    )

    expect([...allAllowedTypes].sort()).toEqual(
      Object.values(UserInitiatedNotificationType).sort(),
    )
  })
})
