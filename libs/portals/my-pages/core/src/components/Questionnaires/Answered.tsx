import { QuestionnaireAnswerOptionType } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { m } from '../../lib/messages'
import { QuestionAnswer } from '../../types/questionnaire'
import {
  formatDate,
  formatDateOnly,
  formatDateWithTime,
  isDateOnlyString,
} from '../../utils/dateUtils'
import { NestedLines } from '../NestedLines/NestedLines'

interface AnsweredProps {
  answers?: QuestionAnswer[]
}

// EL column types that can appear in the "columnId:type:value" encoding
const TABLE_CELL_TYPES = [
  'string',
  'number',
  'date',
  'datetime',
  'bool',
  'list',
]

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString)

  // Check if it's a valid date
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false
  }

  // The whole value must be a date, not merely contain one - new Date()
  const hasDatePattern =
    isDateOnlyString(dateString) || // Simple date: 2024-04-23
    /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(dateString) || // ISO format: 2024-04-23T07:00:58
    /^\w{3}\s\w{3}\s\d{1,2}\s\d{4}/.test(dateString) // Date string format: Tue Apr 23 2024 ...

  return hasDatePattern
}

const formatValue = (value: string): string => {
  if (isValidDate(value)) {
    return isDateOnlyString(value)
      ? formatDateOnly(value)
      : formatDateWithTime(value)
  }
  return value
}

export const Answered: FC<AnsweredProps> = ({ answers }) => {
  const { formatMessage } = useLocale()

  // Table cells are encoded as "columnId:type:value" (legacy: "columnId:value")
  const decodeTableCell = (encoded: string) => {
    const parts = encoded.split(':')
    const columnId = parts[0] ?? ''
    // Legacy values may contain ':', so only treat the middle segment
    // as a type when it is a known column type
    const isTyped = parts.length >= 3 && TABLE_CELL_TYPES.includes(parts[1])
    const cellType = isTyped ? parts[1] : undefined
    const rawValue = isTyped
      ? parts.slice(2).join(':')
      : parts.length >= 2
      ? parts.slice(1).join(':')
      : encoded

    let displayValue = rawValue
    if (cellType === 'bool' && (rawValue === 'true' || rawValue === 'false')) {
      displayValue =
        rawValue === 'true' ? formatMessage(m.yes) : formatMessage(m.no)
    } else if (rawValue && isDateOnlyString(rawValue)) {
      displayValue = formatDateOnly(rawValue)
    } else if (rawValue && isValidDate(rawValue)) {
      displayValue = formatDate(rawValue)
    }

    return { columnId, displayValue }
  }

  // One line per table row (cells joined with " | "), matching the
  // answered-submission view. A repeated columnId marks the next row.
  const formatTableRows = (
    answers: Array<{ label?: string; value: string }>,
  ): string[] => {
    const rows: string[][] = []
    let currentRow: string[] = []
    let seenColumns = new Set<string>()

    answers.forEach((answer) => {
      const { columnId, displayValue } = decodeTableCell(answer.value)
      if (seenColumns.has(columnId)) {
        rows.push(currentRow)
        currentRow = []
        seenColumns = new Set()
      }
      seenColumns.add(columnId)
      currentRow.push(displayValue)
    })
    if (currentRow.length) rows.push(currentRow)

    return rows.map((row) => row.join(' | '))
  }

  return (
    <Box>
      <NestedLines
        ratio="6:6"
        startColor="blue100"
        data={[
          {
            title: formatMessage(m.question),
            value: [formatMessage(m.answer)],
            type: 'text' as const,
            boldValue: true,
            boldTitle: true,
          },
          ...(answers?.map((answer) => {
            return {
              title: answer.question,
              value:
                answer.type === QuestionnaireAnswerOptionType.table
                  ? formatTableRows(answer.answers)
                  : answer.answers.map((a) => formatValue(a.label ?? a.value)),
              type: 'text' as const,
              boldValue: false,
              boldTitle: false,
              splitValue: 'new-line' as const,
            }
          }) ?? []),
        ]}
      />
    </Box>
  )
}

export default Answered
