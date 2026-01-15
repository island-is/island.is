import { QuestionGroupDto } from '@island.is/clients/health-directorate'
import {
  HealthDirectorateQuestionDto,
  HealthDirectorateQuestionTriggers,
} from '../types'
import { QuestionnaireSection } from '../../../../models/questionnaire.model'
import { mapGroupTriggers } from './mapGroupTriggers'
import { mapItemToQuestion } from './mapQuestion'
import { FormatMessage } from '@island.is/cms-translations'

export const mapGroupToSection = (
  group: QuestionGroupDto,
  allQuestions: HealthDirectorateQuestionDto[],
  formatMessage: FormatMessage,
  triggers?: Record<string, HealthDirectorateQuestionTriggers[]>,
): QuestionnaireSection => {
  // Check if this group has any triggers targeting it
  const groupTriggerDeps = group.id
    ? mapGroupTriggers(allQuestions, triggers, group.id)
    : {}

  return {
    id: group.id,
    title: group.title,
    questions: group.items.map((item) =>
      mapItemToQuestion(item, allQuestions, formatMessage, triggers, group.id),
    ),
    ...groupTriggerDeps,
  }
}
