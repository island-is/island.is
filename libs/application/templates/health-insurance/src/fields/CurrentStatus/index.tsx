import React, { FC, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { m } from '../../forms/messages'
import { useLocale } from '@island.is/localization'

type ValidAnswers = 'pensioner' | 'student' | 'other' | undefined

const CurrentStatus: FC<FieldBaseProps> = ({ error, field, application }) => {
  const { formatMessage } = useLocale()
  const currentAnswer = getValueViaPath(
    application,
    field.id,
    undefined,
  ) as ValidAnswers
  const [statefulAnswer, setStatefulAnswer] = useState<ValidAnswers>(
    currentAnswer,
  )

  return (
    <Box marginY={3} key={123}>
      <Box paddingY={3} marginBottom={3}>
        <Text></Text>
        <RadioController
          id={field.id}
          defaultValue={
            statefulAnswer === undefined ? statefulAnswer : [statefulAnswer]
          }
          split="1/2"
          options={[
            {
              label: formatMessage(m.statusPensioner),
              value: 'pensioner',
              tooltip: formatMessage(m.statusPensionerInformation),
            },
            {
              label: formatMessage(m.statusStudent),
              value: 'student',
              tooltip: formatMessage(m.statusStudentInformation),
            },
            {
              label: formatMessage(m.statusOther),
              value: 'other',
              tooltip: formatMessage(m.statusOtherInformation),
            },
          ]}
          onSelect={(newAnswer) => setStatefulAnswer(newAnswer as ValidAnswers)}
          largeButtons
        />
      </Box>
      {error && (
        <Box color="red400" padding={2}>
          <Text variant="default" color="red400">
            {formatMessage(m.requiredAnswerError)}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default CurrentStatus
