import { AnswerOptionType } from '../../../models/question.model'
import { QuestionnaireInput } from '../../dto/questionnaire.input'

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

interface LSHAnswer {
  Answers: {
    EntryID: string
    Type: LSHQuestionType
    Values: [string]
  }[]
  FormID: string
  GUID: string
  InstanceID: string
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

export const mapToLshAnswer = (input: QuestionnaireInput): LSHAnswer => {
  return {
    Answers: input.entries.map((entry) => ({
      EntryID: entry.entryID,
      Type: typeMapper(entry.type as AnswerOptionType),
      Values: entry.values as [string],
    })),
    FormID: input.formId,
    GUID: input.id,
    InstanceID: '', // TODO check what this is
  }
}
