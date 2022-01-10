import React, { useState } from 'react'
import { Box, Input } from '@island.is/island-ui/core'
import { homeCircumstancesForm } from '../../lib/messages'
import { useIntl } from 'react-intl'

import { RadioController } from '@island.is/shared/form-fields'
import { Controller, useFormContext } from 'react-hook-form'
import { HomeCircumstances } from '@island.is/financial-aid/shared/lib'
import * as styles from '../Shared.css'
import cn from 'classnames'
import { FAFieldBaseProps, InputTypes } from '../../lib/types'

const HomeCircumstancesForm = ({
  application,
  field,
  errors,
}: FAFieldBaseProps) => {
  const typeInput = {
    id: 'homeCircumstances.type',
    error: errors?.homeCircumstances?.type,
  } as InputTypes

  const customeInput = {
    id: 'homeCircumstances.custom',
    error: errors?.homeCircumstances?.custom,
  } as InputTypes

  const { formatMessage } = useIntl()

  const { answers } = application

  const [statefulAnswer, setStatefulAnswer] = useState<
    HomeCircumstances | undefined
  >(answers?.homeCircumstances?.type)

  const [statefulCustomInput, setstatefulCustomInput] = useState<string>(
    answers?.homeCircumstances?.custom || '',
  )

  const { setValue } = useFormContext()

  return (
    <>
      <Box marginTop={5}>
        <RadioController
          id={`${typeInput.id}`}
          defaultValue={statefulAnswer}
          options={[
            {
              value: HomeCircumstances.OWNPLACE,
              label: formatMessage(
                homeCircumstancesForm.circumstances.OwnPlace,
              ),
            },
            {
              value: HomeCircumstances.REGISTEREDLEASE,
              label: formatMessage(
                homeCircumstancesForm.circumstances.RegisteredLease,
              ),
            },
            {
              value: HomeCircumstances.UNREGISTEREDLEASE,
              label: formatMessage(
                homeCircumstancesForm.circumstances.UnregisteredLease,
              ),
            },

            {
              value: HomeCircumstances.WITHOTHERS,
              label: formatMessage(
                homeCircumstancesForm.circumstances.WithOthers,
              ),
            },
            {
              value: HomeCircumstances.WITHPARENTS,
              label: formatMessage(
                homeCircumstancesForm.circumstances.WithParents,
              ),
            },
            {
              value: HomeCircumstances.OTHER,
              label: formatMessage(homeCircumstancesForm.circumstances.Other),
            },
          ]}
          onSelect={(newAnswer) =>
            setStatefulAnswer(newAnswer as HomeCircumstances)
          }
          largeButtons
          backgroundColor="white"
          error={typeInput.error}
        />
      </Box>

      <Box
        className={cn({
          [`${styles.inputContainer}`]: true,
          [`${styles.inputAppear}`]: statefulAnswer === HomeCircumstances.OTHER,
        })}
      >
        <Controller
          name="custom"
          defaultValue={statefulCustomInput}
          render={({ value, onChange }) => {
            return (
              <Input
                id={`${customeInput.id}`}
                name={`${customeInput.id}`}
                label={formatMessage(homeCircumstancesForm.general.inputLabel)}
                value={value}
                textarea={true}
                rows={8}
                backgroundColor="blue"
                hasError={customeInput.error !== undefined}
                errorMessage={customeInput.error}
                onChange={(e) => {
                  onChange(e.target.value)
                  setValue(customeInput.id, e.target.value)
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
