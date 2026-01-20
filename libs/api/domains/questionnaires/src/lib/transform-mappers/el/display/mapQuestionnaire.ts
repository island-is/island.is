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
  QuestionnairesOrganizationEnum,
  QuestionnairesStatusEnum,
} from '../../../../models/questionnaires.model'
import { mapDraftRepliesToAnswers } from '../draft/mapToDraft'
import { HealthDirectorateQuestionDto } from '../types'
import { mapGroupToSection } from './mapSection'

export const mapELQuestionnaire = (
  q: QuestionnaireDetailDto | QuestionnaireBaseDto,
  formatMessage: FormatMessage,
): Questionnaire => {
  const isDetailed = 'groups' in q && 'triggers' in q
  let allQuestions: HealthDirectorateQuestionDto[] = []
  if (isDetailed) {
    allQuestions = q.groups.flatMap((g) => g.items ?? [])
  }

  // Get draft answers if available
  const draftAnswersMap =
    isDetailed && q.replies?.length
      ? mapDraftRepliesToAnswers(q, formatMessage)
      : undefined

  // Convert draft answers map to array for GraphQL
  const draftAnswers = draftAnswersMap
    ? Object.values(draftAnswersMap)
    : undefined

  return {
    baseInformation: {
      id: q.questionnaireId,
      title: q.title ?? q.questionnaireId,
      sentDate: q.createdDate?.toISOString() ?? new Date().toISOString(),
      status: isDetailed
        ? q.submissions.length > 0
          ? QuestionnairesStatusEnum.answered
          : QuestionnairesStatusEnum.notAnswered
        : q.numSubmitted > 0
        ? QuestionnairesStatusEnum.answered
        : QuestionnairesStatusEnum.notAnswered,
      description: q.message ?? undefined,
      formId: q.questionnaireId,
      organization: QuestionnairesOrganizationEnum.EL,
    },
    expirationDate: isDetailed && q.expiryDate ? q.expiryDate : undefined,
    canSubmit: isDetailed ? q.canSubmit : undefined,
    submissions: isDetailed
      ? q.submissions.map((sub) => ({
          id: sub.id,
          createdAt: sub.createdDate ?? undefined,
          isDraft: sub.isDraft,
          lastUpdated: sub.lastUpdatedDate ?? undefined,
        }))
      : undefined,
    sections: isDetailed
      ? q.groups.map((g) =>
          mapGroupToSection(g, allQuestions, formatMessage, q.triggers),
        )
      : undefined,
    draftAnswers,
  }
}
