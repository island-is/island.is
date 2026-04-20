import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { m } from '../../lib/messages'
import { QuestionAnswer } from '../../types/questionnaire'
import { formatDateWithTime } from '../../utils/dateUtils'
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
    return formatDateWithTime(value)
  }
  return value
}

export const Answered: FC<AnsweredProps> = ({ answers }) => {
  const { formatMessage } = useLocale()
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
              value: answer.answers.map((a) => formatValue(a.label ?? a.value)),
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
