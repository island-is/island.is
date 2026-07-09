import {
  ConversationReplyBlockedReason,
  ConversationStatusFilter,
  DiseaseVaccinationDtoVaccinationStatusEnum,
  MessagingRecipientDto,
  RecipientCreateBlockedReason,
  UserVisibleAppointmentStatuses,
} from '@island.is/clients/health-directorate'
import { HealthDirectorateHealthConversationRecipient } from '../models/healthConversationRecipient.model'
import { HealthDirectorateHealthConversationType } from '../models/healthConversationType.model'
import {
  AppointmentAssigneeTypeEnum,
  AppointmentLinkTypeEnum,
  AppointmentModalityEnum,
  AppointmentStatusEnum,
  HealthConversationDirectionEnum,
  HealthConversationRecipientBlockedReasonEnum,
  HealthConversationReplyBlockedReasonEnum,
  HealthConversationStatusFilterEnum,
  ReferralStatusEnum,
  VaccinationStatusEnum,
  WaitlistStatusTagColorEnum,
} from '../models/enums'

export const mapVaccinationStatus = (
  status?: DiseaseVaccinationDtoVaccinationStatusEnum,
): VaccinationStatusEnum => {
  switch (status) {
    case DiseaseVaccinationDtoVaccinationStatusEnum.Valid:
      return VaccinationStatusEnum.valid
    case DiseaseVaccinationDtoVaccinationStatusEnum.Complete:
      return VaccinationStatusEnum.complete
    case DiseaseVaccinationDtoVaccinationStatusEnum.Expired:
      return VaccinationStatusEnum.expired
    case DiseaseVaccinationDtoVaccinationStatusEnum.Incomplete:
      return VaccinationStatusEnum.incomplete
    case DiseaseVaccinationDtoVaccinationStatusEnum.Rejected:
      return VaccinationStatusEnum.rejected
    case DiseaseVaccinationDtoVaccinationStatusEnum.Undetermined:
      return VaccinationStatusEnum.undetermined
    case DiseaseVaccinationDtoVaccinationStatusEnum.Undocumented:
      return VaccinationStatusEnum.undocumented
    case DiseaseVaccinationDtoVaccinationStatusEnum.Unvaccinated:
      return VaccinationStatusEnum.unvaccinated
    default:
      return VaccinationStatusEnum.undetermined
  }
}

export const toAppointmentStatusEnum = (
  status: string,
): AppointmentStatusEnum | undefined =>
  Object.values(AppointmentStatusEnum).includes(status as AppointmentStatusEnum)
    ? (status as AppointmentStatusEnum)
    : undefined

export const toAppointmentModalityEnum = (
  modality?: string,
): AppointmentModalityEnum | undefined => {
  switch (modality) {
    case 'IN_PERSON':
      return AppointmentModalityEnum.IN_PERSON
    case 'VIDEO':
      return AppointmentModalityEnum.VIDEO
    default:
      return undefined
  }
}

export const toAppointmentAssigneeTypeEnum = (
  type: string,
): AppointmentAssigneeTypeEnum | undefined => {
  switch (type) {
    case 'SERVICE':
      return AppointmentAssigneeTypeEnum.SERVICE
    case 'ROLE':
      return AppointmentAssigneeTypeEnum.ROLE
    case 'ROOM':
      return AppointmentAssigneeTypeEnum.ROOM
    case 'EQUIPMENT':
      return AppointmentAssigneeTypeEnum.EQUIPMENT
    case 'OTHER':
      return AppointmentAssigneeTypeEnum.OTHER
    case 'TEAM':
      return AppointmentAssigneeTypeEnum.TEAM
    default:
      return undefined
  }
}

export const toAppointmentLinkTypeEnum = (
  type: string,
): AppointmentLinkTypeEnum | undefined => {
  switch (type) {
    case 'PATIENT_INSTRUCTIONS':
      return AppointmentLinkTypeEnum.PATIENT_INSTRUCTIONS
    case 'PREPARATION':
      return AppointmentLinkTypeEnum.PREPARATION
    case 'ORGANIZATION_INFO':
      return AppointmentLinkTypeEnum.ORGANIZATION_INFO
    case 'VIDEO_CALL':
      return AppointmentLinkTypeEnum.VIDEO_CALL
    default:
      return undefined
  }
}

export const mapAppointmentStatus = (
  status: AppointmentStatusEnum,
): UserVisibleAppointmentStatuses | null => {
  switch (status) {
    case AppointmentStatusEnum.BOOKED:
      return UserVisibleAppointmentStatuses.BOOKED
    case AppointmentStatusEnum.CANCELLED:
      return UserVisibleAppointmentStatuses.CANCELLED
    case AppointmentStatusEnum.FULFILLED:
      return UserVisibleAppointmentStatuses.FULFILLED
    case AppointmentStatusEnum.ARRIVED:
      return UserVisibleAppointmentStatuses.ARRIVED
    case AppointmentStatusEnum.CHECKED_IN:
      return UserVisibleAppointmentStatuses.CHECKED_IN
    default:
      return null
  }
}

export const mapStatusIdToColor = (
  statusId?: number | null,
): WaitlistStatusTagColorEnum => {
  switch (statusId) {
    case 10:
      return WaitlistStatusTagColorEnum.blue
    case 20:
    case 100:
      return WaitlistStatusTagColorEnum.red
    case 30:
    case 40:
    case 50:
    case 60:
    case 70:
    case 110:
      return WaitlistStatusTagColorEnum.mint
    case 80:
    case 90:
      return WaitlistStatusTagColorEnum.purple
    default:
      return WaitlistStatusTagColorEnum.blue
  }
}

export const mapReferralStatusValueToStatus = (
  statusValue?: number | null,
): ReferralStatusEnum => {
  switch (statusValue) {
    case 0:
      return ReferralStatusEnum.Open
    case 10:
      return ReferralStatusEnum.Withdrawn
    case 20:
      return ReferralStatusEnum.InTreatment
    case 30:
      return ReferralStatusEnum.Completed
    case 50:
      return ReferralStatusEnum.Rejected
    case 60:
      return ReferralStatusEnum.Finished
    case 98:
      return ReferralStatusEnum.Deleted
    case 99:
      return ReferralStatusEnum.Expired
    default:
      // Unknown status values if new ones get added without letting us know
      return ReferralStatusEnum.Unknown
  }
}

export const toConversationDirectionEnum = (
  direction: string,
): HealthConversationDirectionEnum => {
  switch (direction) {
    case 'PATIENT':
      return HealthConversationDirectionEnum.PATIENT
    case 'STAFF':
      return HealthConversationDirectionEnum.STAFF
    case 'SYSTEM':
      return HealthConversationDirectionEnum.SYSTEM
    default:
      return HealthConversationDirectionEnum.SYSTEM
  }
}

export const toConversationStatusFilter = (
  status: HealthConversationStatusFilterEnum,
): ConversationStatusFilter => {
  switch (status) {
    case HealthConversationStatusFilterEnum.ACTIVE:
      return ConversationStatusFilter.ACTIVE
    case HealthConversationStatusFilterEnum.ARCHIVED:
      return ConversationStatusFilter.ARCHIVED
    case HealthConversationStatusFilterEnum.ALL:
      return ConversationStatusFilter.ALL
  }
}

export const toConversationReplyBlockedReasonEnum = (
  reason?: ConversationReplyBlockedReason,
): HealthConversationReplyBlockedReasonEnum | undefined => {
  switch (reason) {
    case ConversationReplyBlockedReason.MISSING_RECIPIENT:
      return HealthConversationReplyBlockedReasonEnum.MISSING_RECIPIENT
    case ConversationReplyBlockedReason.REPLIES_DISABLED:
      return HealthConversationReplyBlockedReasonEnum.REPLIES_DISABLED
    case ConversationReplyBlockedReason.NO_REPLY_GROUP:
      return HealthConversationReplyBlockedReasonEnum.NO_REPLY_GROUP
    case ConversationReplyBlockedReason.MESSAGING_NOT_ALLOWED:
      return HealthConversationReplyBlockedReasonEnum.MESSAGING_NOT_ALLOWED
    case ConversationReplyBlockedReason.OUTSIDE_MESSAGING_WINDOW:
      return HealthConversationReplyBlockedReasonEnum.OUTSIDE_MESSAGING_WINDOW
    case ConversationReplyBlockedReason.REPLY_WINDOW_EXPIRED:
      return HealthConversationReplyBlockedReasonEnum.REPLY_WINDOW_EXPIRED
    default:
      return undefined
  }
}

export const mapMessagingRecipient = (
  r: MessagingRecipientDto,
): HealthDirectorateHealthConversationRecipient => ({
  nodeId: r.nodeId,
  groupId: r.groupId,
  name: r.name,
  allowsMessaging: r.allowsMessaging,
  messagingWindowOpen: r.messagingWindowOpen,
  messagingWindowClose: r.messagingWindowClose,
  isCurrentlyWithinWindow: r.isCurrentlyWithinWindow,
  patientReplyWindowDays: r.patientReplyWindowDays,
  allowedMessageTypes: r.allowedConversationTypes.map(
    (t): HealthDirectorateHealthConversationType => ({
      patientInitiatedTypeCode: t.patientInitiatedTypeCode,
      title: t.title,
      description: t.description,
      isCertificate: t.isCertificate,
    }),
  ),
  canCreateConversation: r.canCreateConversation,
  conversationBlockedReason: toConversationRecipientBlockedReasonEnum(
    r.conversationBlockedReason,
  ),
  canRequestCertificate: r.canRequestCertificate,
  certificateBlockedReason: toConversationRecipientBlockedReasonEnum(
    r.certificateBlockedReason,
  ),
})

export const toConversationRecipientBlockedReasonEnum = (
  reason?: RecipientCreateBlockedReason,
): HealthConversationRecipientBlockedReasonEnum | undefined => {
  switch (reason) {
    case RecipientCreateBlockedReason.MESSAGING_NOT_ALLOWED:
      return HealthConversationRecipientBlockedReasonEnum.MESSAGING_NOT_ALLOWED
    case RecipientCreateBlockedReason.OUTSIDE_MESSAGING_WINDOW:
      return HealthConversationRecipientBlockedReasonEnum.OUTSIDE_MESSAGING_WINDOW
    case RecipientCreateBlockedReason.NO_ALLOWED_TYPES:
      return HealthConversationRecipientBlockedReasonEnum.NO_ALLOWED_TYPES
    default:
      return undefined
  }
}
