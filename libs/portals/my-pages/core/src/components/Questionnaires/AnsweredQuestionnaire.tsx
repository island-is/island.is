import { QuestionnaireAnsweredQuestionnaire } from '@island.is/api/schema'
import {
  Box,
  Divider,
  GridColumn,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import React from 'react'
import { formatDateWithTime } from '../../utils/dateUtils'

interface AnsweredQuestionnaireProps {
  questionnaire?: QuestionnaireAnsweredQuestionnaire
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

export const AnsweredQuestionnaire: React.FC<AnsweredQuestionnaireProps> = ({
  questionnaire,
}) => {
  return (
    <Box>
      <GridColumn span={['12/12', '12/12', '10/12']}>
        <Stack space={4}>
          {questionnaire?.answers?.map((item) => (
            <>
              <Box>
                <Text fontWeight="medium" lineHeight="lg">
                  {item.label}
                </Text>
                {item.values.length > 1
                  ? item.values.map((v) => (
                      <Box paddingLeft={2}>
                        <Text>- {formatValue(v)}</Text>
                      </Box>
                    ))
                  : null}
                {item.values.length === 1 ? (
                  <Box marginTop={1}>
                    <Text>{formatValue(item.values[0])}</Text>
                  </Box>
                ) : null}
              </Box>
              <Divider />
            </>
          ))}
        </Stack>
      </GridColumn>
    </Box>
  )
}

export default AnsweredQuestionnaire
