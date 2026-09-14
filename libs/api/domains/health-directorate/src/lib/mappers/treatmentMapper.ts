import {
  AllowedInteraction,
  TreatmentBaseDto,
  TreatmentDetailDto,
  TreatmentDocumentDto,
} from '@island.is/clients/health-directorate'

import { HealthDirectorateTreatment } from '../models/treatment.model'
import { HealthDirectorateTreatmentDetail } from '../models/treatmentDetail.model'
import { HealthDirectorateTreatmentDocument } from '../models/treatmentDocument.model'

export const mapTreatment = (
  dto: TreatmentBaseDto,
): HealthDirectorateTreatment => ({
  id: dto.id,
  name: dto.name,
  organizationName: dto.organizationName ?? undefined,
  departmentName: dto.departmentName ?? undefined,
  // Upstream: messaging must not be offered unless the field is present
  // and permits it.
  supportsMessaging:
    dto.allowedInteractions === AllowedInteraction.MESSAGING ||
    dto.allowedInteractions === AllowedInteraction.BOTH,
  responsibleNode: dto.responsibleNode ?? undefined,
})

export const mapTreatmentDetail = (
  dto: TreatmentDetailDto,
): HealthDirectorateTreatmentDetail => ({
  ...mapTreatment(dto),
  recentConversations: dto.recentConversations.map((conversation) => ({
    id: conversation.id,
    title: conversation.title ?? undefined,
    lastMessageSentAt: conversation.lastMessageSentAt ?? undefined,
    senderName: conversation.senderName ?? undefined,
  })),
  lastQuestionnaireSentAt: dto.lastQuestionnaireSentAt ?? undefined,
  lastDocumentSentAt: dto.lastDocumentSentAt ?? undefined,
})

export const mapTreatmentDocument = (
  dto: TreatmentDocumentDto,
): HealthDirectorateTreatmentDocument => ({
  id: dto.id,
  title: dto.title ?? undefined,
  sentAt: dto.messageSentAt,
  links: dto.links.map((link) => ({
    label: link.label,
    href: link.href,
  })),
})
