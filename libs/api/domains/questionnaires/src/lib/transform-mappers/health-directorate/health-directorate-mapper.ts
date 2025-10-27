import {
  QuestionnaireBaseDto,
  QuestionnaireDetailDto,
  QuestionType,
  NumberTriggerDto,
  ListTriggerDto,
  BooleanTriggerDto,
  AttachmentQuestionDto,
  BooleanQuestionDto,
  DateQuestionDto,
  ListQuestionDto,
  NumberQuestionDto,
  StringQuestionDto,
  TableQuestionDto,
} from '@island.is/clients/health-directorate'
import { QuestionnairesStatusEnum } from '../../../models/questionnaires.model'
import { Questionnaire } from '../../../models/questionnaire.model'
import { AnswerOptionType } from '../../../models/question.model'
import { Trigger } from 'aws-sdk/clients/elasticbeanstalk'

type HealthDirectorateQuestionDto =
  | BooleanQuestionDto
  | StringQuestionDto
  | DateQuestionDto
  | NumberQuestionDto
  | ListQuestionDto
  | AttachmentQuestionDto
  | TableQuestionDto

type HealthDirectorateQuestionTriggers =
  | NumberTriggerDto
  | ListTriggerDto
  | BooleanTriggerDto

export const mapQuestionnaire = (
  questionnaire: QuestionnaireBaseDto,
): Questionnaire => {
  return {
    baseInformation: {
      id: questionnaire.questionnaireId,
      title: questionnaire.title ?? 'Spurningalisti',
      description: questionnaire.message,
      sentDate: 'temp sent date',
      status:
        questionnaire.numSubmissions > 0
          ? QuestionnairesStatusEnum.answered
          : QuestionnairesStatusEnum.notAnswered,
      lastSubmitted: questionnaire.lastSubmitted,
      formId: questionnaire.title ?? 'undefined-form-id',
      organization: 'Landlæknir', // TODO: ask if this is correct
    },
  }
}

export const mapQuestionnaireDetail = (
  questionnaire: QuestionnaireDetailDto,
): Questionnaire => {
  return {
    baseInformation: {
      id: questionnaire.questionnaireId,
      title: questionnaire.title ?? 'Spurningalisti',
      description: questionnaire.message,
      sentDate: 'temp sent date',
      status:
        questionnaire.numSubmissions > 0
          ? QuestionnairesStatusEnum.answered
          : QuestionnairesStatusEnum.notAnswered,
      lastSubmitted: questionnaire.lastSubmitted,
      formId: questionnaire.title ?? 'undefined-form-id',
      organization: 'Landlæknir', // TODO: ask if this is correct
    },
    canSubmit: questionnaire.canSubmit,
    expirationDate: questionnaire.expiryDate,
    submissions: questionnaire.submissions?.map((submission) => ({
      id: submission.id,
      submittedAt: submission.submittedDate,
      isDraft: submission.isDraft,
      lastUpdated: submission.lastUpdatedDate,
    })),
  }
}

export const mapQuestionnaireDetailWithQuestions = (
  questionnaire: QuestionnaireDetailDto,
): Questionnaire => {
  return {
    baseInformation: {
      id: questionnaire.questionnaireId,
      title: questionnaire.title ?? 'Spurningalisti',
      description: questionnaire.message,
      sentDate: 'temp sent date',
      status:
        questionnaire.numSubmissions > 0
          ? QuestionnairesStatusEnum.answered
          : QuestionnairesStatusEnum.notAnswered,
      lastSubmitted: questionnaire.lastSubmitted,
      formId: questionnaire.title ?? 'undefined-form-id',
      organization: 'Landlæknir', // TODO: ask if this is correct
    },
    canSubmit: questionnaire.canSubmit,
    expirationDate: questionnaire.expiryDate,
    submissions: questionnaire.submissions?.map((submission) => ({
      id: submission.id,
      submittedAt: submission.submittedDate,
      isDraft: submission.isDraft,
      lastUpdated: submission.lastUpdatedDate,
    })),
    sections: questionnaire.groups?.map((group) => ({
      sectionTitle: group.title,

      questions: group.items.map((item) => ({
        id: item.id,
        label: item.label,
        sublabel: item.htmlLabel,
        answerOptions: {
          id: item.id,
          type: mapAnswerType(
            item.type,
            'displayClass' in item ? item.displayClass ?? '' : '',
            'multiselect' in item ? item.multiselect ?? false : false,
            'multiline' in item ? item.multiline ?? false : false,
          ),
          label: undefined,
          options:
            'values' in item
              ? item?.values?.map((option) => ({
                  id: option.id,
                  label: option.label,
                }))
              : [],
          placeholder: item.hint,
          min: 'min' in item ? item.min?.toString() : undefined,
          max: 'max' in item ? item.max?.toString() : undefined,
          minLabel: 'minDescription' in item ? item.minDescription : undefined,
          maxLabel: 'maxDescription' in item ? item.maxDescription : undefined,
        },
      })),
    })),
  }
}

const mapAnswerType = (
  type: QuestionType,
  displayClass: string,
  multiselect: boolean,
  multiline: boolean,
): AnswerOptionType => {
  console.log('Mapping answer type:', {
    type,
    displayClass,
    multiselect,
    multiline,
  })
  switch (type) {
    case QuestionType.TEXT:
      return AnswerOptionType.label
    case QuestionType.STRING:
      return multiline ? AnswerOptionType.textarea : AnswerOptionType.text
    case QuestionType.NUMBER:
      if (displayClass === 'thermometer') {
        return AnswerOptionType.thermometer
      }
      return AnswerOptionType.number
    case QuestionType.DATE:
      return AnswerOptionType.date
    case QuestionType.BOOL:
      return AnswerOptionType.radio
    case QuestionType.LIST:
      return multiselect
        ? AnswerOptionType.checkbox
        : displayClass === 'slider'
        ? AnswerOptionType.slider
        : AnswerOptionType.radio

    default:
      return AnswerOptionType.text
  }
}

// EXAMPLE
//  "triggers": {
// "126": [ => Question ID
//     {
//         "triggerId": "126", => Question ID
//         "targetId": "group_2", => Display question with this ID if trigger is met
//         "visible": true, => display in frontend
//         "contains": [
//             "1260" // if "targetId" question contains this answer value ID
//         ],
//         "type": "list" => type of question that is the trigger
//     },

// const mapTriggers = (triggers: HealthDirectorateQuestionTriggers[]): Trigger[] => {
//   return triggers.map((trigger) => ({
//     triggerId: trigger.triggerId,
//     targetId: trigger.targetId,
//     visible: trigger.visible,
//     contains: trigger.contains,
//     type: trigger.type,
//   }))
// }
