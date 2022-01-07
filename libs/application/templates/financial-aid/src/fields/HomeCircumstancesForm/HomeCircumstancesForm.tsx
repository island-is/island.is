import React, { useState } from 'react'
import { Box, Input } from '@island.is/island-ui/core'
import { homeCircumstancesForm, error } from '../../lib/messages'
import { useIntl } from 'react-intl'

import { RadioController } from '@island.is/shared/form-fields'
import { HomeCircumstances } from '@island.is/financial-aid/shared/lib'
import * as styles from '../Shared.css'
import cn from 'classnames'
import { CRCFieldBaseProps } from '../../types'

const HomeCircumstancesForm = ({ field, errors }: CRCFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const [statefulAnswer, setStatefulAnswer] = useState<
    HomeCircumstances | undefined
  >()

  const [statefulInput, setStatefulInput] = useState<string>()

  return (
    <>
      <Box marginTop={5}>
        <RadioController
          id={field.id}
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
          error={errors?.homeCircumstances.type}
        />
      </Box>

      <Box
        className={cn({
          [`${styles.inputContainer}`]: true,
          [`${styles.inputAppear}`]: statefulAnswer === HomeCircumstances.OTHER,
        })}
      >
        <Input
          backgroundColor={'blue'}
          label={formatMessage(homeCircumstancesForm.general.inputLabel)}
          name="homeCircumstancesCustom"
          rows={8}
          textarea
          value={statefulInput}
          hasError={errors?.homeCircumstances.custom !== undefined}
          errorMessage={errors?.homeCircumstances.custom}
          onChange={(event) => {
            setStatefulInput(event.target.value)
          }}
        />
      </Box>
    </>
  )
}

export default HomeCircumstancesForm
