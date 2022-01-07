import React, { useState } from 'react'
import { Box, Input } from '@island.is/island-ui/core'
import { homeCircumstancesForm, errorMessage } from '../../lib/messages'
import { useIntl } from 'react-intl'

import { currentMonth } from '@island.is/financial-aid/shared/lib'
import { DescriptionText } from '..'

import { RadioController } from '@island.is/shared/form-fields'
import { HomeCircumstances } from '@island.is/financial-aid/shared/lib'

const HomeCircumstancesForm = () => {
  const { formatMessage } = useIntl()

  const [statefulAnswer, setStatefulAnswer] = useState<
    HomeCircumstances | undefined
  >()

  return (
    <>
      <Box marginTop={5}>
        <RadioController
          id={`bla`}
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
      <Box>
        <Input
          backgroundColor={'blue'}
          label={formatMessage(homeCircumstancesForm.general.inputLabel)}
          name="homeCircumstancesCustom"
          rows={8}
          textarea
          value=""
          hasError={false}
          errorMessage={formatMessage(errorMessage.inputErrorMessage)}
          onChange={(event) => {}}
        />
      </Box>
    </>
  )
}

export default HomeCircumstancesForm
