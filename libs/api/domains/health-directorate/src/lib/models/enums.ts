import { registerEnumType } from '@nestjs/graphql'

export enum VaccinationStatusEnum {
  valid = 'valid', // mint
  expired = 'expired', // blue
  complete = 'complete', //  mint
  incomplete = 'incomplete', // blue
  undocumented = 'undocumented', // purple
  unvaccinated = 'unvaccinated', // red
  rejected = 'rejected', // purple
  undetermined = 'undetermined', // purple
}
registerEnumType(VaccinationStatusEnum, {
  name: 'HealthDirectorateVaccinationStatusEnum',
})

export enum PrescribedItemRenewalBlockedReasonEnum {
  PendingRequest = 'pendingRequest',
  RejectedRequest = 'rejectedRequest',
  NotFullyDispensed = 'notFullyDispensed',
  IsRegiment = 'isRegiment',
  NoMedCard = 'noMedCard',
  NoHealthClinic = 'noHealthClinic',
  DismissedRequest = 'dismissedRequest',
  AlreadyRequested = 'alreadyRequested',
  MoreRecentPrescriptionExists = 'moreRecentPrescriptionExists',
  NoRenewalTargets = 'noRenewalTargets',
  InvalidRenewalTarget = 'invalidRenewalTarget',
  RecipientExcludesAtc = 'recipientExcludesAtc',
  SpecialistOnlyPrescription = 'specialistOnlyPrescription',
  Unknown = 'unknown',
}

registerEnumType(PrescribedItemRenewalBlockedReasonEnum, {
  name: 'HealthDirectoratePrescriptionRenewalBlockedReason',
})

export enum PrescribedItemRenewalStatusEnum {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  Dismissed = 'dismissed',
  Unknown = 'unknown',
}

registerEnumType(PrescribedItemRenewalStatusEnum, {
  name: 'HealthDirectoratePrescriptionRenewalStatus',
})

export enum PrescribedItemCategoryEnum {
  Regular = 'regular',
  Pn = 'pn',
  Regiment = 'regiment',
  Owner = 'owner',
}

registerEnumType(PrescribedItemCategoryEnum, {
  name: 'HealthDirectoratePrescribedItemCategory',
})

export enum PermitCodesEnum {
  PatientSummary = 'patient_summary',
}

registerEnumType(PermitCodesEnum, {
  name: 'HealthDirectoratePermitCodes',
})

export enum PermitStatusEnum {
  active = 'active',
  inactive = 'inactive',
  expired = 'expired',
  awaitingApproval = 'awaitingApproval',
  unknown = 'unknown',
}

registerEnumType(PermitStatusEnum, {
  name: 'HealthDirectoratePermitStatus',
})

export enum AppointmentStatusEnum {
  BOOKED = 'booked',
  CANCELLED = 'cancelled',
  FULFILLED = 'fulfilled',
  ARRIVED = 'arrived',
  CHECKED_IN = 'checked-in',
}

registerEnumType(AppointmentStatusEnum, {
  name: 'HealthDirectorateAppointmentStatus',
})

export enum AppointmentModalityEnum {
  IN_PERSON = 'IN_PERSON',
  VIDEO = 'VIDEO',
}

registerEnumType(AppointmentModalityEnum, {
  name: 'HealthDirectorateAppointmentModality',
})

export enum AppointmentAssigneeTypeEnum {
  ROLE = 'ROLE',
  ROOM = 'ROOM',
  EQUIPMENT = 'EQUIPMENT',
  SERVICE = 'SERVICE',
  OTHER = 'OTHER',
  TEAM = 'TEAM',
}

registerEnumType(AppointmentAssigneeTypeEnum, {
  name: 'HealthDirectorateAppointmentAssigneeType',
})

export enum AppointmentLinkTypeEnum {
  PATIENT_INSTRUCTIONS = 'PATIENT_INSTRUCTIONS',
  PREPARATION = 'PREPARATION',
  ORGANIZATION_INFO = 'ORGANIZATION_INFO',
  VIDEO_CALL = 'VIDEO_CALL',
}

registerEnumType(AppointmentLinkTypeEnum, {
  name: 'HealthDirectorateAppointmentLinkType',
})

export enum WaitlistStatusTagColorEnum {
  blue = 'blue',
  purple = 'purple',
  red = 'red',
  mint = 'mint',
}
registerEnumType(WaitlistStatusTagColorEnum, {
  name: 'HealthDirectorateWaitlistStatusTagColorEnum',
})

export enum ReferralStatusEnum {
  Open = 'Open',
  Withdrawn = 'Withdrawn',
  InTreatment = 'InTreatment',
  Completed = 'Completed',
  Rejected = 'Rejected',
  Finished = 'Finished',
  Deleted = 'Deleted',
  Expired = 'Expired',
  Unknown = 'Unknown',
}
registerEnumType(ReferralStatusEnum, {
  name: 'HealthDirectorateReferralStatusEnum',
})

export enum HealthConversationDirectionEnum {
  PATIENT = 'PATIENT',
  STAFF = 'STAFF',
  SYSTEM = 'SYSTEM',
}
registerEnumType(HealthConversationDirectionEnum, {
  name: 'HealthDirectorateHealthConversationDirection',
})

export enum HealthConversationStatusFilterEnum {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  ALL = 'all',
}
registerEnumType(HealthConversationStatusFilterEnum, {
  name: 'HealthDirectorateHealthConversationStatusFilter',
})

export enum HealthConversationReplyBlockedReasonEnum {
  MISSING_RECIPIENT = 'missingRecipient',
  REPLIES_DISABLED = 'repliesDisabled',
  NO_REPLY_GROUP = 'noReplyGroup',
  MESSAGING_NOT_ALLOWED = 'messagingNotAllowed',
  PATIENT_REPLY_NOT_ALLOWED = 'patientReplyNotAllowed',
  OUTSIDE_MESSAGING_WINDOW = 'outsideMessagingWindow',
  REPLY_WINDOW_EXPIRED = 'replyWindowExpired',
  AWAITING_STAFF_REPLY = 'awaitingStaffReply',
  AWAITING_ACKNOWLEDGEMENT = 'awaitingAcknowledgement',
}
registerEnumType(HealthConversationReplyBlockedReasonEnum, {
  name: 'HealthDirectorateHealthConversationReplyBlockedReason',
  valuesMap: {
    OUTSIDE_MESSAGING_WINDOW: {
      deprecationReason:
        'No longer sent. Replies are not bound by the messaging window.',
    },
    AWAITING_STAFF_REPLY: {
      deprecationReason: 'No longer sent. See AWAITING_ACKNOWLEDGEMENT.',
    },
  },
})

export enum HealthConversationReplyAvailabilityEnum {
  CAN_REPLY = 'canReply',
  WAITING = 'waiting',
  EXPIRED = 'expired',
  NEVER = 'never',
}
registerEnumType(HealthConversationReplyAvailabilityEnum, {
  name: 'HealthDirectorateHealthConversationReplyAvailability',
  description:
    'What the patient can do with a thread, reduced from patientCanReply and replyBlockedReason.',
  valuesMap: {
    WAITING: {
      description:
        'Blocked for now and unblocks without the patient doing anything.',
    },
    EXPIRED: {
      description:
        'The reply window of patientReplyWindowDays has passed. Permanent for this thread.',
    },
    NEVER: { description: 'This thread never accepts a patient reply.' },
  },
})

export enum HealthConversationSegmentTypeEnum {
  TEXT = 'text',
  LINK = 'link',
}
registerEnumType(HealthConversationSegmentTypeEnum, {
  name: 'HealthDirectorateHealthConversationSegmentType',
})

export enum HealthConversationRecipientBlockedReasonEnum {
  MESSAGING_NOT_ALLOWED = 'messagingNotAllowed',
  PATIENT_INITIATED_NOT_ALLOWED = 'patientInitiatedNotAllowed',
  OUTSIDE_MESSAGING_WINDOW = 'outsideMessagingWindow',
  NO_ALLOWED_TYPES = 'noAllowedTypes',
}
registerEnumType(HealthConversationRecipientBlockedReasonEnum, {
  name: 'HealthDirectorateHealthConversationRecipientBlockedReason',
})

export enum HealthConversationRecipientAvailabilityEnum {
  OPEN = 'open',
  CLOSED = 'closed',
  NEVER = 'never',
}
registerEnumType(HealthConversationRecipientAvailabilityEnum, {
  name: 'HealthDirectorateHealthConversationRecipientAvailability',
  description:
    'Whether the patient can start a conversation, reduced from canCreateConversation and conversationBlockedReason.',
  valuesMap: {
    CLOSED: {
      description:
        'Outside the messaging window. nextOpensAt says when it reopens.',
    },
    NEVER: {
      description:
        'The patient can not start a conversation with this recipient at any time.',
    },
  },
})

export enum HealthConversationDayTypeEnum {
  WEEKDAY = 'weekday',
  WEEKEND = 'weekend',
  HOLIDAY = 'holiday',
}
registerEnumType(HealthConversationDayTypeEnum, {
  name: 'HealthDirectorateHealthConversationDayType',
})

export enum CertificateTypeEnum {
  WORK = 'work',
  SCHOOL = 'school',
}
registerEnumType(CertificateTypeEnum, {
  name: 'HealthDirectorateCertificateType',
})

export enum AppointmentCancelBlockedReasonEnum {
  DeadlinePassed = 'deadlinePassed',
  NotAllowed = 'notAllowed',
}
registerEnumType(AppointmentCancelBlockedReasonEnum, {
  name: 'HealthDirectorateAppointmentCancelBlockedReason',
})

export enum AppointmentCancelOutcomeEnum {
  CANCELLED = 'cancelled',
  REFUSED = 'refused',
  BLOCKED = 'blocked',
  UNCONFIRMED = 'unconfirmed',
}
registerEnumType(AppointmentCancelOutcomeEnum, {
  name: 'HealthDirectorateAppointmentCancelOutcome',
})
