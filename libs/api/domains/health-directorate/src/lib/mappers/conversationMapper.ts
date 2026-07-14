import {
  ContentSegmentDto,
  ContentSegmentType,
  ConversationReplyBlockedReason,
  ConversationStatusFilter,
  MessageType,
  MessagingRecipientDto,
  RecipientCreateBlockedReason,
  VideoConversationDto,
} from '@island.is/clients/health-directorate'
import {
  HealthConversationDirectionEnum,
  HealthConversationMessageTypeEnum,
  HealthConversationRecipientBlockedReasonEnum,
  HealthConversationReplyBlockedReasonEnum,
  HealthConversationSegmentTypeEnum,
  HealthConversationStatusFilterEnum,
} from '../models/enums'
import { HealthDirectorateHealthConversationRecipient } from '../models/healthConversationRecipient.model'
import { HealthDirectorateHealthConversationSegment } from '../models/healthConversationSegment.model'
import { HealthDirectorateHealthConversationType } from '../models/healthConversationType.model'
import { HealthDirectorateHealthConversationVideo } from '../models/healthConversationVideo.model'

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

export const toConversationMessageTypeEnum = (
  type: MessageType,
): HealthConversationMessageTypeEnum => {
  switch (type) {
    case MessageType.VIDEO:
      return HealthConversationMessageTypeEnum.VIDEO
    case MessageType.SEGMENTED:
      return HealthConversationMessageTypeEnum.SEGMENTED
    case MessageType.TEXT:
      return HealthConversationMessageTypeEnum.TEXT
    default:
      return HealthConversationMessageTypeEnum.TEXT
  }
}

export const toConversationSegmentTypeEnum = (
  type: ContentSegmentType,
): HealthConversationSegmentTypeEnum => {
  switch (type) {
    case ContentSegmentType.LINK:
      return HealthConversationSegmentTypeEnum.LINK
    case ContentSegmentType.TEXT:
      return HealthConversationSegmentTypeEnum.TEXT
    default:
      return HealthConversationSegmentTypeEnum.TEXT
  }
}

/**
 * The health service API currently returns local ISO datetimes with
 * no timezone offset. This will be fixed and typed in following verions
 * of the API, but for now we have to parse the date manually.
 * Once it´s been changed, we can remove this.
 */
const parseUtcDate = (value?: string): Date | undefined => {
  if (!value) {
    return undefined
  }
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(value)
  const date = new Date(hasZone ? value : `${value}Z`)
  return isNaN(date.getTime()) ? undefined : date
}

export const mapConversationSegments = (
  segments?: Array<ContentSegmentDto>,
): HealthDirectorateHealthConversationSegment[] | undefined =>
  segments?.map((s) => ({
    type: toConversationSegmentTypeEnum(s.type),
    text: s.text,
    label: s.label,
    href: s.href,
  }))

export const mapConversationVideo = (
  video?: VideoConversationDto,
): HealthDirectorateHealthConversationVideo | undefined =>
  video
    ? {
        url: video.url,
        description: video.description,
        appointmentDate: parseUtcDate(video.appointmentDate),
        appointmentHostName: video.appointmentHostName,
        isCanceled: video.isCanceled,
        isEdited: video.isEdited,
      }
    : undefined

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
    case ConversationReplyBlockedReason.AWAITING_STAFF_REPLY:
      return HealthConversationReplyBlockedReasonEnum.AWAITING_STAFF_REPLY
    default:
      return undefined
  }
}

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
