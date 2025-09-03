import { Box, Stack } from '@island.is/island-ui/core'
import React from 'react'
import { useLocale } from '@island.is/localization'
import {
  GenericQuestionnaire,
  m,
  QuestionAnswer,
} from '@island.is/portals/my-pages/core'
import { completeLSHQuestionnaire } from './lsh_questionnaire_converted'

export const LSHQuestionnaire: React.FC = () => {
  const { formatMessage } = useLocale()
  const handleSubmit = (answers: { [key: string]: QuestionAnswer }) => {
    console.log('submitted:', answers)

    // Transform answers back to LSH format
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answer]) => ({
        EntryID: questionId,
        Value: answer.value,
        Type: typeof answer.value,
      }),
    )

    console.log('answers:', formattedAnswers)
    // TODO - send to api
  }

  const handleCancel = () => {
    console.log('LSH Questionnaire cancelled')
    // TODO: clear answers or send draft?
  }

  return (
    <Box>
      <Stack space={4}>
        <GenericQuestionnaire
          questionnaire={completeLSHQuestionnaire}
          onSubmit={handleSubmit}
          cancelLabel={formatMessage(m.buttonCancel)}
          submitLabel={formatMessage(m.submit)}
        />
      </Stack>
    </Box>
  )
}

export default LSHQuestionnaire
