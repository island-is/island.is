import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { interview } from '../../lib/messages'
import { DescriptionText } from '../components'

export type ValidAnswers = 'yes' | 'no' | undefined

const Interview = ({ field, application }: FieldBaseProps) => {
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers
  const { formatMessage } = useIntl()

  const [statefulAnswer, setStatefulAnswer] = useState<ValidAnswers>(
    currentAnswer,
  )
  return (
    <>
      <Box marginTop={3} marginBottom={5}>
        <DescriptionText text={interview.general.description} />
      </Box>
      <Box marginTop={3} marginBottom={2}>
        <RadioController
          id={`${field.id}`}
          defaultValue={
            statefulAnswer !== undefined ? [statefulAnswer] : undefined
          }
          options={[
            {
              value: 'yes',
              label: formatMessage(interview.yes.label),
            },
            {
              value: 'no',
              label: formatMessage(interview.no.label),
            },
          ]}
          onSelect={(newAnswer) => setStatefulAnswer(newAnswer as ValidAnswers)}
          largeButtons
        />

        {statefulAnswer && (
          <Text fontWeight="semiBold" marginTop={1}>
            {formatMessage(interview[statefulAnswer].overviewText)}
          </Text>
        )}
      </Box>
    </>
  )
}

export default Interview
