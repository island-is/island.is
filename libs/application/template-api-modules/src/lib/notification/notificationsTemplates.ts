export enum NotificationType {
  /**
   * Notification sent for system-related events such as updates or stock changes.
   * @param {string} documentId - The ID of the documentId
   */
  System = 'SystemNotification',
  ChildrenResidenceChange = 'ChildrenResidenceChangeNotification',
  ReferenceTemplate = 'ReferenceTemplateNotification',
  ChildrenResidenceChangeAssignParent = 'ChildrenResidenceChangeV2AssignParentNotification',
}

export const NotificationConfig = {
  [NotificationType.System]: {
    templateId: 'HNIPP.TEST.INBOX.TEMPLATE',
    keys: {} as { documentId: string },
  },
  [NotificationType.ChildrenResidenceChange]: {
    templateId: 'HNIPP.AS.CRC.ASSIGN.PARENT',
    keys: {} as { applicantName: string; applicationId: string },
  },
  [NotificationType.ReferenceTemplate]: {
    templateId: 'HNIPP.AS.REF.ASSIGN.PARENT',
    keys: {} as { applicantName: string; applicationId: string },
  },
  [NotificationType.ChildrenResidenceChangeAssignParent]: {
    templateId: 'HNIPP.AS.CRC.V2.ASSIGN.PARENT',
    keys: {} as { applicantName: string; applicationId: string },
  },
}
