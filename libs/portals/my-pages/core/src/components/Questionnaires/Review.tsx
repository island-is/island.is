import { FC } from 'react'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { QuestionAnswer } from '../../types/questionnaire'
import AnsweredQuestionnaire from './AnsweredQuestionnaire'

interface ReviewProps {
  answers: {
    [key: string]: QuestionAnswer
  }
  title?: string
}
export const Review: FC<ReviewProps> = ({ answers, title }) => {
  console.log(answers)
  return (
    <Box>
      <Text variant="h4" as="h2" marginBottom={3}>
        {title}
      </Text>
      <AnsweredQuestionnaire answers={Object.values(answers)} />
    </Box>
  )
}
