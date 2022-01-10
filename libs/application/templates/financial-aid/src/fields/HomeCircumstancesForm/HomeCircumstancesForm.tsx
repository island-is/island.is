import React, { useState } from 'react'
import { Box, Input } from '@island.is/island-ui/core'
import { homeCircumstancesForm } from '../../lib/messages'
import { useIntl } from 'react-intl'

import { RadioController } from '@island.is/shared/form-fields'
import { HomeCircumstances } from '@island.is/financial-aid/shared/lib'
import * as styles from '../Shared.css'
import cn from 'classnames'
import { FAFieldBaseProps } from '../../lib/types'

const HomeCircumstancesForm = ({ field, errors }: FAFieldBaseProps) => {
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
          error={undefined}
        />
      </Box>

      <Box
        className={cn({
          [`${styles.inputContainer}`]: true,
          [`${styles.inputAppear}`]: statefulAnswer === HomeCircumstances.OTHER,
        })}
      >
        //controller
        <Input
          backgroundColor={'blue'}
          label={formatMessage(homeCircumstancesForm.general.inputLabel)}
          name="homeCircumstancesCustom"
          rows={8}
          textarea
          value={statefulInput}
          hasError={false}
          errorMessage={undefined}
          onChange={(event) => {
            setStatefulInput(event.target.value)
          }}
        />
        {/* <InputController
          id={phoneNumber.presentationId}
          name={phoneNumber.presentationId}
          backgroundColor="blue"
          type="tel"
          label={phoneNumber.label}
          error={phoneNumber.error}
          onChange={(event) => {
            setStatefulInput(event.target.value)
            // clearErrors(phoneNumber.clearErrors || phoneNumber.id)
          }}
          defaultValue={phoneNumber.defaultValue || ''}
        /> */}
      </Box>
    </>
  )
}

export default HomeCircumstancesForm
