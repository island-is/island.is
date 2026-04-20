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
  NewPrimarySchool = 'NewPrimarySchoolNotification',
  TransferOfVehicleOwnershipPruned = 'TransferOfVehicleOwnershipPrunedNotification',
  ChangeCoOwnerOfVehiclePruned = 'ChangeCoOwnerOfVehiclePrunedNotification',
  ChangeOperatorOfVehiclePruned = 'ChangeOperatorOfVehiclePrunedNotification',
}

interface NotificationKeysMap {
  [NotificationType.System]: { documentId: string }
  [NotificationType.ChildrenResidenceChange]: {
    applicantName: string
    applicationId: string
  }
  [NotificationType.RejectedByCounterParty]: { counterPartyName: string }
  [NotificationType.RejectedByOrganization]: { orgName: string }
  [NotificationType.AssignCounterParty]: {
    applicantName: string
    contractLink: string
  }
  [NotificationType.ChildrenResidenceChangeApprovedByOrg]: {
    applicationLink: string
    caseNumber: string
  }
  [NotificationType.ReferenceTemplate]: {
    applicantName: string
    applicationId: string
  }
  [NotificationType.ChildrenResidenceChangeAssignParent]: {
    applicantName: string
    applicationId: string
  }
  [NotificationType.FireCompensationAppraisal]: {
    applicantName: string
    applicationId: string
    appliedForAddress: string
    realEstateId: string
  }
  [NotificationType.NewPrimarySchoolAssignOtherGuardian]: {
    name: string
    id: string
    applicationLink: string
  }
  [NotificationType.NewPrimarySchoolOtherGuardianApproved]: {
    applicationLink: string
  }
  [NotificationType.NewPrimarySchoolOtherGuardianRejected]: {
    applicationLink: string
  }
  [NotificationType.NewPrimarySchoolAssignPayer]: {
    name: string
    id: string
    applicationLink: string
  }
  [NotificationType.NewPrimarySchoolPayerApproved]: { applicationLink: string }
  [NotificationType.NewPrimarySchoolPayerRejected]: { applicationLink: string }
  [NotificationType.NewPrimarySchool]: {
    name: string
    id: string
    applicationLink: string
  }
}

const defineNotificationConfig = <
  T extends Record<NotificationType, { templateId: string }>,
>(
  config: T,
) => config

export const NotificationConfig = defineNotificationConfig({
  [NotificationType.System]: { templateId: 'HNIPP.TEST.INBOX.TEMPLATE' },
  [NotificationType.ChildrenResidenceChange]: {
    templateId: 'HNIPP.AS.CRC.ASSIGN.PARENT',
  },
  [NotificationType.RejectedByCounterParty]: {
    templateId: 'HNIPP.AS.CRC.REJECTED.BY.COUNTERPARTY',
  },
  [NotificationType.RejectedByOrganization]: {
    templateId: 'HNIPP.AS.CRC.REJECTED.BY.ORGANIZATION',
  },
  [NotificationType.AssignCounterParty]: {
    templateId: 'HNIPP.AS.CRC.ASSIGN.COUNTERPARTY',
  },
  [NotificationType.ChildrenResidenceChangeApprovedByOrg]: {
    templateId: 'HNIPP.AS.CRC.APPROVED.BY.ORGANIZATION',
  },
  [NotificationType.ReferenceTemplate]: {
    templateId: 'HNIPP.AS.REF.ASSIGN.PARENT',
  },
  [NotificationType.ChildrenResidenceChangeAssignParent]: {
    templateId: 'HNIPP.AS.CRC.V2.ASSIGN.PARENT',
  },
  [NotificationType.TrainingLicenseOnWorkMachinePruned]: {
    templateId: 'HNIPP.AS.VER.TLWM.PRUNED',
  },
  [NotificationType.TrainingLicenseOnWorkMachineRejected]: {
    templateId: 'HNIPP.AS.VER.TLWM.REJECTED',
  },
  [NotificationType.TrainingLicenseOnWorkMachineApproved]: {
    templateId: 'HNIPP.AS.VER.TLWM.APPROVED',
  },
  [NotificationType.FireCompensationAppraisal]: {
    templateId: 'HNIPP.AS.HMS.FCA.NOTIFICATION',
  },
  [NotificationType.NewPrimarySchoolAssignOtherGuardian]: {
    templateId: 'HNIPP.AS.NPS.ASSIGN.OTHER.GUARDIAN',
  },
  [NotificationType.NewPrimarySchoolOtherGuardianApproved]: {
    templateId: 'HNIPP.AS.NPS.OTHER.GUARDIAN.APPROVED',
  },
  [NotificationType.NewPrimarySchoolOtherGuardianRejected]: {
    templateId: 'HNIPP.AS.NPS.OTHER.GUARDIAN.REJECTED',
  },
  [NotificationType.NewPrimarySchoolAssignPayer]: {
    templateId: 'HNIPP.AS.NPS.ASSIGN.PAYER',
  },
  [NotificationType.NewPrimarySchoolPayerApproved]: {
    templateId: 'HNIPP.AS.NPS.PAYER.APPROVED',
  },
  [NotificationType.NewPrimarySchoolPayerRejected]: {
    templateId: 'HNIPP.AS.NPS.PAYER.REJECTED',
  },
  [NotificationType.NewPrimarySchool]: {
    templateId: 'HNIPP.AS.NPS.NOTIFICATION',
  },
  [NotificationType.TransferOfVehicleOwnershipPruned]: {
    templateId: 'HNIPP.AS.TA.TVO.PRUNED',
  },
  [NotificationType.ChangeCoOwnerOfVehiclePruned]: {
    templateId: 'HNIPP.AS.TA.CCOV.PRUNED',
  },
  [NotificationType.ChangeOperatorOfVehiclePruned]: {
    templateId: 'HNIPP.AS.TA.COV.PRUNED',
  },
} as const)

export type NotificationConfigType = typeof NotificationConfig
export type NotificationTypeKey = keyof NotificationConfigType
export type NotificationArgs<T extends NotificationType> =
  T extends keyof NotificationKeysMap
    ? NotificationKeysMap[T]
    : Record<string, never>
