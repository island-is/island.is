export enum NotificationType {
  System = 'SystemNotification',
  ChildrenResidenceChange = 'ChildrenResidenceChangeNotification',
  RejectedByCounterParty = 'RejectedByCounterPartyNotification',
  RejectedByOrganization = 'RejectedByOrganizationNotification',
  AssignCounterParty = 'AssignCounterPartyNotification',
  ChildrenResidenceChangeApprovedByOrg = 'ChildrenResidenceChangeApprovedByOrgNotification',
  ReferenceTemplate = 'ReferenceTemplateNotification',
  ChildrenResidenceChangeAssignParent = 'ChildrenResidenceChangeV2AssignParentNotification',
  TrainingLicenseOnWorkMachinePruned = 'TrainingLicenseOnWorkMachinePrunedNotification',
  TrainingLicenseOnWorkMachineRejected = 'TrainingLicenseOnWorkMachineRejectedNotification',
  TrainingLicenseOnWorkMachineApproved = 'TrainingLicenseOnWorkMachineApprovedNotification',
  FireCompensationAppraisal = 'FireCompensationAppraisalNotification',
  NewPrimarySchoolAssignOtherGuardian = 'NewPrimarySchoolAssignOtherGuardianNotification',
  NewPrimarySchoolOtherGuardianApproved = 'NewPrimarySchoolOtherGuardianApprovedNotification',
  NewPrimarySchoolOtherGuardianRejected = 'NewPrimarySchoolOtherGuardianRejectedNotification',
  NewPrimarySchoolAssignPayer = 'NewPrimarySchoolAssignPayerNotification',
  NewPrimarySchoolPayerApproved = 'NewPrimarySchoolPayerApprovedNotification',
  NewPrimarySchoolPayerRejected = 'NewPrimarySchoolPayerRejectedNotification',
  TransferOfVehicleOwnershipPruned = 'TransferOfVehicleOwnershipPrunedNotification',
  ChangeCoOwnerOfVehiclePruned = 'ChangeCoOwnerOfVehiclePrunedNotification',
  ChangeOperatorOfVehiclePruned = 'ChangeOperatorOfVehiclePrunedNotification',
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
  [NotificationType.TrainingLicenseOnWorkMachinePruned]: {
    templateId: 'HNIPP.AS.VER.TLWM.PRUNED',
    keys: {},
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
  [NotificationType.NewPrimarySchoolAssignOtherGuardian]: {
    templateId: 'HNIPP.AS.NPS.ASSIGN.OTHER.GUARDIAN',
    keys: {} as { name: string; id: string; applicationLink: string },
  },
  [NotificationType.NewPrimarySchoolOtherGuardianApproved]: {
    templateId: 'HNIPP.AS.NPS.OTHER.GUARDIAN.APPROVED',
    keys: {} as { applicationLink: string },
  },
  [NotificationType.NewPrimarySchoolOtherGuardianRejected]: {
    templateId: 'HNIPP.AS.NPS.OTHER.GUARDIAN.REJECTED',
    keys: {} as { applicationLink: string },
  },
  [NotificationType.NewPrimarySchoolAssignPayer]: {
    templateId: 'HNIPP.AS.NPS.ASSIGN.PAYER',
    keys: {} as { name: string; id: string; applicationLink: string },
  },
  [NotificationType.NewPrimarySchoolPayerApproved]: {
    templateId: 'HNIPP.AS.NPS.PAYER.APPROVED',
    keys: {} as { applicationLink: string },
  },
  [NotificationType.NewPrimarySchoolPayerRejected]: {
    templateId: 'HNIPP.AS.NPS.PAYER.REJECTED',
    keys: {} as { applicationLink: string },
  },
  [NotificationType.TransferOfVehicleOwnershipPruned]: {
    templateId: 'HNIPP.AS.TA.TVO.PRUNED',
    keys: {},
  },
  [NotificationType.ChangeCoOwnerOfVehiclePruned]: {
    templateId: 'HNIPP.AS.TA.CCOV.PRUNED',
    keys: {},
  },
  [NotificationType.ChangeOperatorOfVehiclePruned]: {
    templateId: 'HNIPP.AS.TA.COV.PRUNED',
    keys: {},
  },
}

export type NotificationConfigType = typeof NotificationConfig
export type NotificationTypeKey = keyof typeof NotificationConfig
export type NotificationArgs<T extends NotificationTypeKey> =
  NotificationConfigType[T]['keys']
