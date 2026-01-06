import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { FC } from 'react'
import { m } from '../../lib/messages'
import { QuestionAnswer } from '../../types/questionnaire'
import AnsweredQuestionnaire from './Answered'

interface ReviewProps {
  answers: {
    [key: string]: QuestionAnswer
  }
  title?: string
}
export const Review: FC<ReviewProps> = ({ answers, title }) => {
  const { formatMessage } = useLocale()
  if (Object.keys(answers).length === 0) {
    return (
      <Problem
        type="no_data"
        size="small"
        title={formatMessage(m.noAnswersIncluded)}
        message={formatMessage(m.noAnswersIncludedDetail)}
      />
    )
  }
  return (
    <Box>
      <Text variant="h3" as="h2" marginBottom={3}>
        {title}
      </Text>
      <AnsweredQuestionnaire answers={Object.values(answers)} />
    </Box>
  )
}
