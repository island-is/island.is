import { Question } from '../../../../models/question.model'
import { mapAnswerOptionType } from './mapAnswerOptionType'
import {
  HealthDirectorateQuestionDto,
  HealthDirectorateQuestionTriggers,
} from '../types'
import { mapTriggers } from './mapTriggers'
import { FormatMessage } from '@island.is/cms-translations'
import { m } from '../../../utils/messages'

export const mapItemToQuestion = (
  item: HealthDirectorateQuestionDto,
  allQuestions: HealthDirectorateQuestionDto[],
  formatMessage: FormatMessage,
  triggers?: Record<string, HealthDirectorateQuestionTriggers[]>,
  groupId?: string,
): Question => {
  const answerType = mapAnswerOptionType(item.type, item)
  const triggerDeps = mapTriggers(allQuestions, triggers, item.id)

  // Create unique ID by combining group and item IDs to avoid collisions
  const uniqueId = groupId ? `${groupId}__${item.id}` : item.id

  // Handle options based on question type
  let options: Array<{ label: string; value: string; id: string }> | undefined

  if (item.type === 'bool') {
    // Boolean questions get Yes/No options
    options = [
      { label: formatMessage(m.yes), value: 'true', id: 'true' },
      { label: formatMessage(m.no), value: 'false', id: 'false' },
    ]
  } else if ('values' in item && item.values) {
    // List questions use provided values
    options = item.values.map((v) => ({
      label: v.label,
      value: v.id,
      id: v.id,
    }))
  }

  const answerOptions = {
    id: uniqueId,
    originalId: item.id, // Keep original ID for submission
    type: answerType,
    label: undefined,
    options,
    placeholder: item.hint,
    maxLength: 'maxLength' in item ? item.maxLength?.toString() : '',
    min: 'min' in item && item.min !== undefined ? item.min.toString() : '',
    max: 'max' in item && item.max !== undefined ? item.max.toString() : '',
    minLabel:
      'minDescription' in item &&
      item.minDescription &&
      typeof item.minDescription === 'string'
        ? item.minDescription
        : '',
    maxLabel:
      'maxDescription' in item &&
      item.maxDescription &&
      typeof item.maxDescription === 'string'
        ? item.maxDescription
        : '',
    multiline: 'multiline' in item && item.multiline,
    decimal: 'decimals' in item && item.decimals ? true : false,
    // Table-specific fields
    numRows: 'numRows' in item ? item.numRows : undefined,
    maxRows: 'maxRows' in item ? item.maxRows : undefined,
    columns:
      'items' in item && item.items
        ? item.items.map((subItem) => ({
            id: subItem.id,
            label: subItem.label,
            type: subItem.type,
            required: 'required' in subItem ? subItem.required : false,
            multiline: 'multiline' in subItem ? subItem.multiline : undefined,
            maxLength: 'maxLength' in subItem ? subItem.maxLength : undefined,
          }))
        : undefined,
  }

  return {
    id: uniqueId,
    originalId: item.id, // Keep original ID for submission
    label: item.label,
    htmlLabel: item.htmlLabel,
    sublabel: item.hint,
    required: 'required' in item ? item.required : false,
    answerOptions,
    ...triggerDeps,
  }
}
