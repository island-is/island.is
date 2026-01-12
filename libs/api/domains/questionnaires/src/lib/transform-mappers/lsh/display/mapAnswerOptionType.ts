import { AnswerOptionType } from '../../../../models/question.model'

export // Map question type
const mapAnswerOptionType = (
  type: string,
  slider?: string | null,
): AnswerOptionType => {
  switch (type) {
    case 'String':
      return AnswerOptionType.text
    case 'Label':
      return AnswerOptionType.label
    case 'Text':
      return AnswerOptionType.text
    case 'SingleSelect':
      return AnswerOptionType.radio
    case 'MultiSelect':
      return AnswerOptionType.checkbox
    case 'Number':
      if (slider && slider === '1') {
        return AnswerOptionType.scale
      }
      return AnswerOptionType.number
    case 'Date':
      return AnswerOptionType.date
    case 'DateTime':
      return AnswerOptionType.datetime
    case 'Slider':
      return AnswerOptionType.thermometer
    default:
      return AnswerOptionType.text
  }
}
