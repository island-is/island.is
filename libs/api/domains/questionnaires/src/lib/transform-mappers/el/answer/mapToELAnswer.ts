import { SubmitQuestionnaireDto } from '@island.is/clients/health-directorate'
import { FormatMessage } from '@island.is/cms-translations'
import { AnswerOptionType } from '../../../../models/question.model'
import { QuestionnaireInput } from '../../../dto/questionnaire.input'
import { m } from '../../../utils/messages'
import { Reply } from '../types'

/**
 * Maps a QuestionnaireInput to the Health Directorate submission format
 */
export const mapToElAnswer = (
  input: QuestionnaireInput,
  formatMessage: FormatMessage,
): SubmitQuestionnaireDto => {
  const replies: SubmitQuestionnaireDto['replies'] = input.entries.map(
    (entry) => {
      const questionId = entry.entryID
      const answerValues = entry.answers.map((a) => a.value)

      // Handle multi-select / checkbox (ListReply)
      if (
        entry.type === AnswerOptionType.checkbox ||
        entry.type === AnswerOptionType.slider
      ) {
        return {
          questionId,
          values: entry.answers.map((ans) => ({
            id: ans.value,
            answer: ans.label ?? formatMessage(m.noLabel),
          })),
        }
      }

      if (entry.type === AnswerOptionType.radio) {
        const firstAnswer = entry.answers[0]
        if (firstAnswer.value === 'true' || firstAnswer.value === 'false') {
          return {
            questionId,
            answer: firstAnswer.value === 'true',
          }
        }
        return {
          questionId,
          values: [
            {
              id: firstAnswer.value,
              answer: firstAnswer.label || firstAnswer.value,
            },
          ],
        }
      }

      // Handle date fields (DateReply)
      if (
        entry.type === AnswerOptionType.date ||
        entry.type === AnswerOptionType.datetime
      ) {
        return {
          questionId,
          answer: answerValues[0] || '', // Should be ISO date string
        }
      }

      // Handle number fields (NumberReply)
      if (
        entry.type === AnswerOptionType.number ||
        entry.type === AnswerOptionType.scale ||
        entry.type === AnswerOptionType.thermometer
      ) {
        return {
          questionId,
          answer: isNaN(parseFloat(answerValues[0]))
            ? 0
            : parseFloat(answerValues[0]),
        }
      }

      // Handle table fields (TableReply)
      if (entry.type === AnswerOptionType.table) {
        // Parse table answers from "columnId:type:value" or "columnId:value" format
        // Group by row: answers come in as array where each cell is formatted as above
        const columnData: {
          [columnId: string]: Array<{ type?: string; value: string }>
        } = {}

        // Extract column values and types from answers
        entry.answers.forEach((ans) => {
          if (ans.value) {
            const parts = ans.value.split(':')
            let columnId = ''
            let columnType: string | undefined
            let value = ''

            if (parts.length >= 3) {
              // New format: "columnId:type:value"
              columnId = parts[0]
              columnType = parts[1]
              value = parts.slice(2).join(':') // In case value contains ':'
            } else if (parts.length === 2) {
              // Old format: "columnId:value". Keep it for backward compatibility on dev lists
              columnId = parts[0]
              value = parts[1]
            }

            if (!columnData[columnId]) {
              columnData[columnId] = []
            }
            columnData[columnId].push({ type: columnType, value: value || '' })
          }
        })

        // Determine number of rows (all columns should have same number of values)
        const numRows = Math.max(
          ...Object.values(columnData).map((arr) => arr.length),
          0,
        )

        // Build rows array - each row is an array of Reply objects
        const rows: Reply[][] = []

        for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
          const row: Reply[] = []

          // For each column, create appropriate Reply type based on data
          Object.entries(columnData).forEach(([columnId, cellData]) => {
            const cell = cellData[rowIndex]
            const value = cell?.value || ''
            const columnType = cell?.type

            // Use column type if available, otherwise infer from value
            // Check in order: boolean, date, number, string (date before number to avoid year-only confusion)
            if (
              columnType === 'boolean' ||
              value === 'true' ||
              value === 'false'
            ) {
              row.push({
                questionId: columnId,
                answer: value === 'true',
              })
            } else if (
              columnType === 'date' ||
              /^\d{4}-\d{2}-\d{2}/.test(value)
            ) {
              row.push({
                questionId: columnId,
                answer: value,
              })
            } else if (
              columnType === 'number' ||
              (!isNaN(parseFloat(value)) && value.trim() !== '')
            ) {
              row.push({
                questionId: columnId,
                answer: parseFloat(value),
              })
            } else {
              row.push({
                questionId: columnId,
                answer: value,
              })
            }
          })

          rows.push(row)
        }

        return {
          questionId,
          rows,
        }
      }

      // Handle boolean fields (BooleanReply)
      // Assuming boolean values are passed as string "true" or "false"
      const firstValue = answerValues[0]?.toLowerCase()
      if (firstValue === 'true' || firstValue === 'false') {
        return {
          questionId,
          answer: firstValue === 'true',
        }
      }

      // Default to StringReply for text, textarea, etc.
      return {
        questionId,
        answer: answerValues[0] || '',
      }
    },
  )

  return {
    replies,
    isDraft: input.saveAsDraft ?? false,
  }
}
