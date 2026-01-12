import { AnswerOptionType } from '../../../../models/question.model'
import { HealthDirectorateQuestionDto } from '../types'

export const mapAnswerOptionType = (
  type: string,
  item: HealthDirectorateQuestionDto,
): AnswerOptionType => {
  switch (type) {
    case 'text':
      return AnswerOptionType.label
    case 'string':
      if ('multiline' in item && item.multiline) {
        return AnswerOptionType.textarea
      }
      return AnswerOptionType.text
    case 'number':
      if ('displayClass' in item && item.displayClass === 'thermometer')
        return AnswerOptionType.thermometer
      return AnswerOptionType.number
    case 'bool':
      // Boolean questions are typically yes/no radio buttons
      return AnswerOptionType.radio
    case 'list':
      return 'multiselect' in item && item.multiselect
        ? AnswerOptionType.checkbox
        : 'displayClass' in item && item.displayClass === 'slider'
        ? AnswerOptionType.slider
        : AnswerOptionType.radio
    case 'thermometer':
      return AnswerOptionType.thermometer
    case 'date':
      return AnswerOptionType.date
    case 'datetime':
      return AnswerOptionType.datetime
    case 'table':
      return AnswerOptionType.table
    default:
      return AnswerOptionType.text
  }
}
