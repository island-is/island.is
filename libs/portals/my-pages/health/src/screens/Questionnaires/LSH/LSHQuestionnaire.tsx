import { Box, Stack, toast } from '@island.is/island-ui/core'
import React from 'react'
import { useLocale } from '@island.is/localization'
import {
  GenericQuestionnaire,
  m,
  QuestionAnswer,
} from '@island.is/portals/my-pages/core'
import { completeLSHQuestionnaire } from './lsh_questionnaire_converted'
import { useNavigate } from 'react-router-dom'

export const LSHQuestionnaire: React.FC = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const handleSubmit = (answers: { [key: string]: QuestionAnswer }) => {
    console.log('submitted:', answers)
    toast.success('Spurningalisti sendur')
    navigate(-1)

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
    toast.info('Hætt við spurningalista')
    navigate(-1)
  }

  return (
    <GenericQuestionnaire
      questionnaire={completeLSHQuestionnaire}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      cancelLabel={formatMessage(m.buttonCancel)}
      submitLabel={formatMessage(m.submit)}
    />
  )
}

export default LSHQuestionnaire
