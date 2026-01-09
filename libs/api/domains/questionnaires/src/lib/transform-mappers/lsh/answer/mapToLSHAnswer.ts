import { QuestionnaireAnswers } from '@island.is/clients/lsh'
import { AnswerOptionType } from '../../../../models/question.model'
import { QuestionnaireInput } from '../../../dto/questionnaire.input'

enum LSHQuestionType {
  SingleSelect = 'SingleSelect',
  MultiSelect = 'MultiSelect',
  String = 'String',
  Number = 'Number',
  Date = 'Date',
  DateTime = 'DateTime',
  Text = 'Text',
  Label = 'Label',
  Slider = 'Slider',
}

const typeMapper = (type: AnswerOptionType): LSHQuestionType => {
  switch (type) {
    case AnswerOptionType.radio:
      return LSHQuestionType.SingleSelect
    case AnswerOptionType.checkbox:
      return LSHQuestionType.MultiSelect
    case AnswerOptionType.text:
      return LSHQuestionType.String
    case AnswerOptionType.number:
      return LSHQuestionType.Number
    case AnswerOptionType.date:
      return LSHQuestionType.Date
    case AnswerOptionType.datetime:
      return LSHQuestionType.DateTime
    case AnswerOptionType.label:
      return LSHQuestionType.Label
    case AnswerOptionType.slider:
      return LSHQuestionType.Slider
    default:
      return LSHQuestionType.String
  }
}

export const mapToLshAnswer = (
  input: QuestionnaireInput,
): QuestionnaireAnswers => {
  return {
    answers: input.entries.map((entry) => ({
      entryID: entry.entryID,
      type: typeMapper(entry.type),
      values: entry.answers.map((a) => a.value),
    })),
    formID: input.formId,
    gUID: input.id,
    instanceID: '', // Should be empty
  }
}
