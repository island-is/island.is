export enum NotificationType {
  System = 'SystemNotification',
  ChildrenResidenceChange = 'ChildrenResidenceChangeNotification',
  RejectedByCounterParty = 'RejectedByCounterPartyNotification',
  RejectedByOrganization = 'RejectedByOrganizationNotification',
  AssignCounterParty = 'AssignCounterPartyNotification',
  ChildrenResidenceChangeApprovedByOrg = 'ChildrenResidenceChangeApprovedByOrgNotification',
  ReferenceTemplate = 'ReferenceTemplateNotification',
  ChildrenResidenceChangeAssignParent = 'ChildrenResidenceChangeV2AssignParentNotification',
  TrainingLicenseOnWorkMachineRejected = 'TrainingLicenseOnWorkMachineRejected',
  TrainingLicenseOnWorkMachineApproved = 'TrainingLicenseOnWorkMachineApproved',
  FireCompensationAppraisal = 'FireCompensationAppraisalNotification',
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
  [NotificationType.RejectedByOrganization]: {
    templateId: 'HNIPP.AS.CRC.REJECTED.BY.ORGANIZATION',
    keys: {} as { orgName: string },
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
  [NotificationType.TrainingLicenseOnWorkMachineRejected]: {
    templateId: 'HNIPP.AS.VER.TLWM.REJECTED',
    keys: {},
  },
  [NotificationType.TrainingLicenseOnWorkMachineApproved]: {
    templateId: 'HNIPP.AS.VER.TLWM.APPROVED',
    keys: {},
  },
  [NotificationType.FireCompensationAppraisal]: {
    templateId: 'HNIPP.AS.HMS.FCA.NOTIFICATION',
    keys: {} as {
      applicantName: string
      applicationId: string
      appliedForAddress: string
      realEstateId: string
    },
  },
}

export type NotificationConfigType = typeof NotificationConfig
export type NotificationTypeKey = keyof typeof NotificationConfig
export type NotificationArgs<T extends NotificationTypeKey> =
  NotificationConfigType[T]['keys']
