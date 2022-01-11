import React from 'react'
import { Box, Input } from '@island.is/island-ui/core'
import { employmentForm, input } from '../../lib/messages'
import { useIntl } from 'react-intl'

import { RadioController } from '@island.is/shared/form-fields'
import { Controller, useFormContext } from 'react-hook-form'
import { Employment } from '@island.is/financial-aid/shared/lib'
import * as styles from '../Shared.css'
import cn from 'classnames'
import { FAFieldBaseProps, InputTypes } from '../../lib/types'

const EmploymentForm = ({ application, errors }: FAFieldBaseProps) => {
  const typeInput = {
    id: 'employment.type',
    error: errors?.employment?.type,
  } as InputTypes

  const customInput = {
    id: 'employment.custom',
    error: errors?.employment?.custom,
  } as InputTypes

  const { formatMessage } = useIntl()

  const { answers } = application

  const { setValue, getValues, clearErrors } = useFormContext()

  return (
    <>
      <Box marginTop={5}>
        <RadioController
          id={typeInput.id}
          defaultValue={answers?.employment?.type}
          options={[
            {
              value: Employment.WORKING,
              label: formatMessage(employmentForm.employment.working),
            },
            {
              value: Employment.UNEMPLOYED,
              label: formatMessage(employmentForm.employment.unemployed),
            },
            {
              value: Employment.CANNOTWORK,
              label: formatMessage(employmentForm.employment.cannotWork),
            },
            {
              value: Employment.OTHER,
              label: formatMessage(employmentForm.employment.other),
            },
          ]}
          largeButtons
          backgroundColor="white"
          error={typeInput.error}
        />
      </Box>

      <Box
        className={cn({
          [`${styles.inputContainer}`]: true,
          [`${styles.inputAppear}`]:
            getValues(typeInput.id) === Employment.OTHER,
        })}
      >
        <Controller
          name={customInput.id}
          defaultValue={answers?.employment?.custom}
          render={({ value, onChange }) => {
            return (
              <Input
                id={customInput.id}
                name={customInput.id}
                label={formatMessage(input.label)}
                value={value}
                textarea={true}
                rows={8}
                backgroundColor="blue"
                hasError={customInput.error !== undefined}
                errorMessage={customInput.error}
                onChange={(e) => {
                  clearErrors(customInput.id)
                  onChange(e.target.value)
                  setValue(customInput.id, e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
    </>
  )
}

export default EmploymentForm
