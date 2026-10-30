/**
 * Health Directorate Questionnaire Mapper - Transforms Health Directorate API Form objects into the internal Questionnaire format.
 */

import {
  QuestionnaireBaseDto,
  QuestionnaireDetailDto,
} from '@island.is/clients/health-directorate'
import { FormatMessage } from '@island.is/cms-translations'
import { Questionnaire } from '../../../../models/questionnaire.model'
import {
  QuestionnairesBaseItem,
  QuestionnairesOrganizationEnum,
  QuestionnairesStatusEnum,
} from '../../../../models/questionnaires.model'
import { m } from '../../../utils/messages'
import { mapDraftRepliesToAnswers } from '../draft/mapToDraft'
import { HealthDirectorateQuestionDto } from '../types'
import { mapGroupToSection } from './mapSection'

const isExpired = (q: Pick<QuestionnaireBaseDto, 'disabled' | 'expiryDate'>) =>
  q.disabled || (!!q.expiryDate && new Date(q.expiryDate) < new Date())

const isSubmittable = (q: QuestionnaireDetailDto) => q.canSubmit && !q.disabled

const mapBaseInformation = (
  q: QuestionnaireDetailDto,
  formatMessage: FormatMessage,
) => ({
  id: q.questionnaireId,
  title: q.title ?? formatMessage(m.questionnaireWithoutTitle),
  sentDate: q.createdDate?.toISOString() ?? '',
  status: isExpired(q)
    ? QuestionnairesStatusEnum.expired
    : q.hasDraft
    ? QuestionnairesStatusEnum.draft
    : q.submissions?.length > 0
    ? QuestionnairesStatusEnum.answered
    : QuestionnairesStatusEnum.notAnswered,
  description: q.message ?? undefined,
  formId: q.questionnaireId,
  organization: QuestionnairesOrganizationEnum.EL,
  lastSubmissionId: q.lastCreatedSubmissionId,
  lastSubmitted: q.lastSubmitted ?? undefined,
  senderGroupName: q.senderGroupName ?? undefined,
  disabled: q.disabled,
})

export const mapElQuestionnaireOverview = (
  q: QuestionnaireDetailDto,
  formatMessage: FormatMessage,
): Questionnaire => ({
  baseInformation: mapBaseInformation(q, formatMessage),
  sender: q.sender ?? undefined,
  expirationDate: q.expiryDate ?? undefined,
  canSubmit: isSubmittable(q),
  submissions: q.submissions?.map((sub) => ({
    id: sub.id,
    createdAt: sub.createdDate ?? undefined,
    isDraft: sub.isDraft,
    // Submitted date first so it matches the date on the answered view
    lastUpdated: sub.submittedDate ?? sub.lastUpdatedDate ?? undefined,
  })),
})

export const mapElQuestionnaireForm = (
  q: QuestionnaireDetailDto,
  formatMessage: FormatMessage,
): Questionnaire => {
  const allQuestions: HealthDirectorateQuestionDto[] = q.groups.flatMap(
    (g) => g.items ?? [],
  )

  const draftAnswersMap = q.replies?.length
    ? mapDraftRepliesToAnswers(q, formatMessage)
    : undefined

  return {
    baseInformation: mapBaseInformation(q, formatMessage),
    sender: q.sender ?? undefined,
    expirationDate: q.expiryDate ?? undefined,
    canSubmit: isSubmittable(q),
    submissions: q.submissions?.map((sub) => ({
      id: sub.id,
      createdAt: sub.createdDate ?? undefined,
      isDraft: sub.isDraft,
      // Submitted date first so it matches the date on the answered view
      lastUpdated: sub.submittedDate ?? sub.lastUpdatedDate ?? undefined,
    })),
    sections: q.groups.map((g) =>
      mapGroupToSection(g, allQuestions, formatMessage, q.triggers),
    ),
    draftAnswers: draftAnswersMap ? Object.values(draftAnswersMap) : undefined,
  }
}

export const mapElQuestionnaireListItem = (
  q: QuestionnaireBaseDto,
  formatMessage: FormatMessage,
): QuestionnairesBaseItem => {
  const now = new Date()
  const status = isExpired(q)
    ? QuestionnairesStatusEnum.expired
    : q.hasDraft
    ? QuestionnairesStatusEnum.draft
    : q.numSubmitted > 0 || q.lastSubmitted
    ? QuestionnairesStatusEnum.answered
    : QuestionnairesStatusEnum.notAnswered

  return {
    id: q.questionnaireId,
    title: q.title ?? formatMessage(m.questionnaireWithoutTitle),
    description: q.message ?? undefined,
    sentDate: q.createdDate?.toISOString() ?? '',
    lastSubmissionId: q.lastCreatedSubmissionId,
    organization: QuestionnairesOrganizationEnum.EL,
    status,
    lastSubmitted: q.lastSubmitted,
    senderGroupName: q.senderGroupName ?? undefined,
    disabled: q.disabled,
    canSubmitAgain:
      status === QuestionnairesStatusEnum.answered &&
      (q.numSubmissionsAllowed == null ||
        q.numSubmitted < q.numSubmissionsAllowed) &&
      (!q.nextSubmissionDate || new Date(q.nextSubmissionDate) <= now),
  }
}
