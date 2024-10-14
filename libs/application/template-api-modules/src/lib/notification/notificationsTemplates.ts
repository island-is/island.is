export enum NotificationType {
  /**
   * Notification sent for system-related events such as updates or stock changes.
   * @param {string} documentId - The ID of the documentId
   */
  System = 'SystemNotification',
  ChildrenResidenceChange = 'ChildrenResidenceChangeNotification',
  RejectedByCounterParty = 'RejectedByCounterPartyNotification',
  AssignCounterParty = 'AssignCounterPartyNotification',
  ChildrenResidenceChangeApprovedByOrg = 'ChildrenResidenceChangeApprovedByOrgNotification',
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
  [NotificationType.RejectedByCounterParty]: {
    templateId: 'HNIPP.AS.CRC.REJECTED.BY.COUNTERPARTY',
    keys: {} as { counterPartyName: string },
  },
  [NotificationType.AssignCounterParty]: {
    templateId: 'HNIPP.AS.CRC.ASSIGN.COUNTERPARTY',
    keys: {} as { applicantName: string; contractLink: string },
  },
  [NotificationType.ChildrenResidenceChangeApprovedByOrg]: {
    templateId: 'HNIPP.AS.CRC.APPROVED.BY.ORGANIZATION',
    keys: {} as { applicationLink: string; caseNumber: string },
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
