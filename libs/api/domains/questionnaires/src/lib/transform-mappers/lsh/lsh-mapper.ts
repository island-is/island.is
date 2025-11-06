import {
  Questionnaire as LSHQuestionnaireType,
  QuestionnaireBody,
} from '@island.is/clients/lsh'
import { Questionnaire } from '../../../models/questionnaire.model'
import {
  QuestionnairesOrganizationEnum,
  QuestionnairesStatusEnum,
} from '../../../models/questionnaires.model'
import {
  AnswerOptionType,
  Question,
  VisibilityCondition,
  VisibilityOperator,
} from '../../../models/question.model'

const mapType = (type?: string | null): AnswerOptionType => {
  switch (type) {
    case 'SingleSelect':
      return AnswerOptionType.radio
    case 'MultiSelect':
      return AnswerOptionType.checkbox
    case 'Date':
      return AnswerOptionType.date
    case 'DateTime':
      return AnswerOptionType.datetime
    case 'Text':
      return AnswerOptionType.text
    case 'Number':
      return AnswerOptionType.number
    case 'Label':
      return AnswerOptionType.label
    default:
      return AnswerOptionType.text
  }
}

export const mapLSHQuestionnaire = (
  data: QuestionnaireBody | null,
  detailData: LSHQuestionnaireType | null = null,
  _locale: 'is' | 'en',
): Questionnaire | null => {
  if (!data) {
    return null
  }

  return {
    baseInformation: {
      id: data.gUID || 'undefined-id',
      title: data.header
        ? data.header
        : _locale === 'is'
        ? 'Ónefndur spurningalisti'
        : 'Untitled questionnaire',
      status: detailData?.answerDateTime
        ? QuestionnairesStatusEnum.answered
        : detailData?.validToDateTime &&
          new Date(detailData?.validToDateTime) < new Date()
        ? QuestionnairesStatusEnum.expired
        : QuestionnairesStatusEnum.notAnswered,
      sentDate: detailData?.validFromDateTime?.toISOString() || '',
      description: data.description || undefined,
      organization: QuestionnairesOrganizationEnum.LSH,
    },
    sections: data.sections?.map((section) => ({
      title: section.caption ?? undefined,
      questions: section.questions?.map((question) => {
        const q: Question = {
          id: question.entryID ?? 'undefined-id',
          label: question.question ?? 'Untitled Question',
          sublabel: question.instructions ?? undefined,
          required: question.required || false,
          dependsOn: question.dependsOn || [],
          answerOptions: {
            type: mapType(question.type),
            formula: question.formula || undefined,
            options: question.options?.map((option) => ({
              id: option.value ?? 'undefined-option-id',
              label: option.label ?? 'untitled option',
              value: option.value ?? undefined,
            })),
            min: question.minValue ? question.minValue.toString() : undefined,
            max: question.maxValue ? question.maxValue.toString() : undefined,
          },
          visibilityConditions: undefined,
        }
        return q
      }),
    })),
  }
}
