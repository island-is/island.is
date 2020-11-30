import React, { FC } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { m } from '../../../forms/messages'
import { useFormContext, Controller } from 'react-hook-form'
import { Box, Text, Checkbox } from '@island.is/island-ui/core'

const TestPhaseInfoScreen: FC<FieldBaseProps> = ({ field, application }) => {
  const { answers: formValue } = application

  const currentAnswer = getValueViaPath(
    formValue,
    'technicalAnswer' as string,
    false,
  ) as boolean
  const { setValue, errors, getValues } = useFormContext()

  return (
    <Box>
      <Box marginBottom={3}>
        <Text>
          <strong>
            {m.testTechnicalImplementationSubTitle.defaultMessage}
          </strong>
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text>{m.testTechnicalImplementationMessage1.defaultMessage}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text>{m.testTechnicalImplementationMessage2.defaultMessage}</Text>
      </Box>
      <Box marginBottom={3}>
        <Controller
          name="technicalAnswer"
          defaultValue={currentAnswer}
          rules={{ required: true }}
          render={({ value, onChange }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setValue('technicalAnswer' as string, e.target.checked)
                }}
                checked={value}
                name="technicalAnswer"
                label={m.technicalImplementationOptionLabel.defaultMessage}
                large
                hasError={
                  errors.technicalAnswer &&
                  getValues('technicalAnswer') === false
                }
                errorMessage={errors.technicalAnswer}
              />
            )
          }}
        />
      </Box>
    </Box>
  )
}

export default TestPhaseInfoScreen
