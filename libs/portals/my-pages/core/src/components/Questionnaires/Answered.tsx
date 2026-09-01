import { QuestionnaireAnswerOptionType } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { m } from '../../lib/messages'
import { QuestionAnswer } from '../../types/questionnaire'
import {
  formatDate,
  formatDateWithTime,
  isDateOnlyString,
} from '../../utils/dateUtils'
import { NestedLines } from '../NestedLines/NestedLines'

interface AnsweredProps {
  answers?: QuestionAnswer[]
}

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString)

  // Check if it's a valid date
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false
  }

  // Match various date formats:
  // - ISO format: 2024-04-23T07:00:58
  // - Date string format: Tue Apr 23 2024 07:00:58 GMT+0000 (Greenwich Mean Time)
  // - Simple date: 2024-04-23
  const hasDatePattern =
    dateString.match(/\d{4}-\d{2}-\d{2}/) !== null || // ISO format
    dateString.match(/^\w{3}\s\w{3}\s\d{1,2}\s\d{4}/) !== null || // Date string format
    dateString.includes('GMT') // Contains GMT timezone info

  return hasDatePattern
}

const formatValue = (value: string): string => {
  if (isValidDate(value)) {
    return isDateOnlyString(value)
      ? formatDate(value)
      : formatDateWithTime(value)
  }
  return value
}

export const Answered: FC<AnsweredProps> = ({ answers }) => {
  const { formatMessage } = useLocale()

  // Table cells are encoded as "columnId:type:value" (legacy: "columnId:value")
  const formatTableCell = (cell: {
    label?: string | undefined
    value: string
  }): string => {
    const parts = cell.value.split(':')
    const cellType = parts.length >= 3 ? parts[1] : undefined
    const rawValue =
      parts.length >= 3
        ? parts.slice(2).join(':')
        : parts.length === 2
        ? parts[1]
        : cell.value

    let displayValue = rawValue
    if (cellType === 'bool') {
      displayValue =
        rawValue === 'true' ? formatMessage(m.yes) : formatMessage(m.no)
    } else if (rawValue && isValidDate(rawValue)) {
      displayValue = formatDate(rawValue)
    }

    return cell.label ? `${cell.label}: ${displayValue}` : displayValue
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
                  ? answer.answers.map(formatTableCell)
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
