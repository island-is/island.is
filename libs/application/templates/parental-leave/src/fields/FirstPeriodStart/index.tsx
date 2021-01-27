import React, { FC, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getExpectedDateOfBirth } from '../../parentalLeaveUtils'
import { mm } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

type ValidAnswers = 'dateOfBirth' | 'specificDate' | undefined

const FirstPeriodStart: FC<FieldBaseProps> = ({
  error,
  field,
  application,
}) => {
  const { register } = useFormContext()
  const { formatMessage } = useLocale()
  const expectedDateOfBirth = getExpectedDateOfBirth(application)
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers
  const currentStartDateAnswer = getValueViaPath(
    application.answers,
    'periods[0].startDate',
    expectedDateOfBirth,
  ) as string
  const [statefulAnswer, setStatefulAnswer] = useState<ValidAnswers>(
    currentAnswer,
  )

  return (
    <Box marginY={3} key={field.id}>
      <FieldDescription
        description={formatMessage(mm.firstPeriodStart.description)}
      />
      <Box paddingTop={3} marginBottom={3}>
        <RadioController
          id={field.id}
          error={error}
          defaultValue={
            statefulAnswer !== undefined ? [statefulAnswer] : undefined
          }
          options={[
            {
              label: formatMessage(mm.firstPeriodStart.dateOfBirthOption),
              tooltip: formatMessage(
                mm.firstPeriodStart.dateOfBirthOptionTooltip,
              ),
              value: 'dateOfBirth',
            },
            {
              label: formatMessage(mm.firstPeriodStart.specificDateOption),
              tooltip: formatMessage(
                mm.firstPeriodStart.specificDateOptionTooltip,
              ),
              value: 'specificDate',
            },
          ]}
          onSelect={(newAnswer) => setStatefulAnswer(newAnswer as ValidAnswers)}
          largeButtons
        />
        <input
          type="hidden"
          value={
            statefulAnswer === 'dateOfBirth'
              ? expectedDateOfBirth
              : currentStartDateAnswer
          }
          ref={register}
          name="periods[0].startDate"
        />
      </Box>
    </Box>
  )
}

export default FirstPeriodStart
