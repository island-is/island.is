import React from 'react'
import { Box, Input } from '@island.is/island-ui/core'
import { homeCircumstancesForm, input } from '../../lib/messages'
import { useIntl } from 'react-intl'

import { RadioController } from '@island.is/shared/form-fields'
import { Controller, useFormContext } from 'react-hook-form'
import { HomeCircumstances } from '@island.is/financial-aid/shared/lib'
import * as styles from '../Shared.css'
import cn from 'classnames'
import { FAFieldBaseProps, InputTypes } from '../../lib/types'

const HomeCircumstancesForm = ({ application, errors }: FAFieldBaseProps) => {
  const typeInput = {
    id: 'homeCircumstances.type',
    error: errors?.homeCircumstances?.type,
  } as InputTypes

  const customInput = {
    id: 'homeCircumstances.custom',
    error: errors?.homeCircumstances?.custom,
  } as InputTypes

  const { formatMessage } = useIntl()

  const { answers } = application

  const { setValue, getValues, clearErrors } = useFormContext()

  return (
    <>
      <Box marginTop={5}>
        <RadioController
          id={typeInput.id}
          defaultValue={answers?.homeCircumstances?.type}
          options={[
            {
              value: HomeCircumstances.OWNPLACE,
              label: formatMessage(
                homeCircumstancesForm.circumstances.ownPlace,
              ),
            },
            {
              value: HomeCircumstances.REGISTEREDLEASE,
              label: formatMessage(
                homeCircumstancesForm.circumstances.registeredLease,
              ),
            },
            {
              value: HomeCircumstances.UNREGISTEREDLEASE,
              label: formatMessage(
                homeCircumstancesForm.circumstances.unregisteredLease,
              ),
            },

            {
              value: HomeCircumstances.WITHOTHERS,
              label: formatMessage(
                homeCircumstancesForm.circumstances.withOthers,
              ),
            },
            {
              value: HomeCircumstances.WITHPARENTS,
              label: formatMessage(
                homeCircumstancesForm.circumstances.withParents,
              ),
            },
            {
              value: HomeCircumstances.OTHER,
              label: formatMessage(homeCircumstancesForm.circumstances.other),
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
            getValues(typeInput.id) === HomeCircumstances.OTHER,
        })}
      >
        <Controller
          name={customInput.id}
          defaultValue={answers?.homeCircumstances?.custom}
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

export default HomeCircumstancesForm
