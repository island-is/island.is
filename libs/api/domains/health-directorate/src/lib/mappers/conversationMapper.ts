import type { FormatMessage } from '@island.is/cms-translations'
import type { MessageDescriptor } from 'react-intl'
import {
  ContentSegmentDto,
  ContentSegmentType,
  ConversationMessageDto,
  ConversationReplyBlockedReason,
  ConversationStatusFilter,
  MessageType,
  MessagingRecipientDto,
  RecipientCreateBlockedReason,
  VideoConversationDto,
} from '@island.is/clients/health-directorate'
import {
  HealthConversationDirectionEnum,
  HealthConversationRecipientBlockedReasonEnum,
  HealthConversationReplyBlockedReasonEnum,
  HealthConversationSegmentTypeEnum,
  HealthConversationStatusFilterEnum,
} from '../models/enums'
import { m } from '../messages'
import { HealthDirectorateHealthConversationMessageContent } from '../models/healthConversationMessageContent.model'
import { HealthDirectorateHealthConversationRecipient } from '../models/healthConversationRecipient.model'
import { HealthDirectorateHealthConversationSegment } from '../models/healthConversationSegment.model'
import { HealthDirectorateHealthConversationType } from '../models/healthConversationType.model'
import { HealthDirectorateHealthConversationVideoContent } from '../models/healthConversationVideoContent.model'

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

export const mapConversationSegments = (
  segments?: Array<ContentSegmentDto>,
): HealthDirectorateHealthConversationSegment[] | undefined =>
  segments?.map((s): HealthDirectorateHealthConversationSegment => {
    const type = toConversationSegmentTypeEnum(s.type)
    return type === HealthConversationSegmentTypeEnum.LINK
      ? { type, label: s.label, href: s.href }
      : { type, text: s.text }
  })

export const mapConversationVideo = (
  video?: VideoConversationDto,
): HealthDirectorateHealthConversationVideoContent | undefined =>
  video
    ? {
        url: video.url,
        description: video.description,
        appointmentDate: video.appointmentDate,
        appointmentHostName: video.appointmentHostName,
        isCanceled: video.isCanceled,
        isEdited: video.isEdited,
      }
    : undefined

export const mapConversationMessageContent = (
  message: ConversationMessageDto,
): typeof HealthDirectorateHealthConversationMessageContent | undefined => {
  switch (message.messageType) {
    case MessageType.VIDEO:
      return mapConversationVideo(message.videoConversation)
    case MessageType.SEGMENTED: {
      const segments = mapConversationSegments(message.contentSegments)
      return segments?.length ? { segments } : undefined
    }
    case MessageType.TEXT:
    default:
      return message.messageTextContent
        ? { text: message.messageTextContent }
        : undefined
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

/* 
  The Heilsuvera web chat is not a Hekla conversation type, it's appended
  manually to every recipient's service list so both web and app render it
  from the same source, as an external link at the bottom of the dropdown.
*/
export const WEB_CHAT_TYPE_CODE = 'HEILSUVERA_WEB_CHAT'
// Must match the hours stated in the translated web chat description strings.
const WEB_CHAT_OPENS_MINUTES = 8 * 60 // 08:00
const WEB_CHAT_CLOSES_MINUTES = 15 * 60 + 30 // 15:30

const isWebChatOpen = (now: Date): boolean => {
  const day = now.getUTCDay()
  const minutes = now.getUTCHours() * 60 + now.getUTCMinutes()
  const isWeekday = day >= 1 && day <= 5
  return (
    isWeekday &&
    minutes >= WEB_CHAT_OPENS_MINUTES &&
    minutes < WEB_CHAT_CLOSES_MINUTES
  )
}

export const getWebChatConversationType = (
  formatMessage: FormatMessage,
  now: Date = new Date(),
): HealthDirectorateHealthConversationType => {
  const isCurrentlyOpen = isWebChatOpen(now)

  return {
    patientInitiatedTypeCode: WEB_CHAT_TYPE_CODE,
    title: formatMessage(m.webChatTitle),
    description: formatMessage(m.webChatDescription, {
      status: formatMessage(
        isCurrentlyOpen ? m.webChatStatusOpen : m.webChatStatusClosed,
      ),
    }),
    isCertificate: false,
    externalLinkUrl: formatMessage(m.webChatUrl),
    isCurrentlyOpen,
  }
}

const TYPE_INSTRUCTIONS: Record<string, MessageDescriptor> = {
  MEDICATION_INQUIRY: m.instructionsMedication,
  CERTIFICATE: m.instructionsCertificate,
  REFERRAL_REQUEST: m.instructionsReferral,
}

export const mapMessagingRecipient = (
  r: MessagingRecipientDto,
  formatMessage: FormatMessage,
): HealthDirectorateHealthConversationRecipient => ({
  nodeId: r.nodeId,
  groupId: r.groupId,
  treatmentId: r.treatmentId,
  name: r.name,
  allowsMessaging: r.allowsMessaging,
  messagingWindowOpen: r.messagingWindowOpen,
  messagingWindowClose: r.messagingWindowClose,
  isCurrentlyWithinWindow: r.isCurrentlyWithinWindow,
  patientReplyWindowDays: r.patientReplyWindowDays,
  allowedMessageTypes: r.allowedConversationTypes.map(
    (t): HealthDirectorateHealthConversationType => {
      const instructions = TYPE_INSTRUCTIONS[t.patientInitiatedTypeCode]
      return {
        patientInitiatedTypeCode: t.patientInitiatedTypeCode,
        title: t.title,
        description: t.description,
        instructions: instructions ? formatMessage(instructions) : undefined,
        isCertificate: t.isCertificate,
      }
    },
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
