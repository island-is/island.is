import React, { Fragment } from 'react'
import { InputController } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { PARTYOPERATIONIDS } from '../../lib/constants'
interface PropTypes {
  getSum: () => void
  checkIfEmpty: (fieldId: string) => void
  errors: any
}

export const PartyExpenses = ({
  errors,
  checkIfEmpty,
  getSum,
}: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const { clearErrors } = useFormContext()
  const onInputBlur = (fieldId: string) => {
    getSum()
    checkIfEmpty(fieldId)
  }

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.electionOffice}
          name={PARTYOPERATIONIDS.electionOffice}
          label={formatMessage(m.electionOffice)}
          onBlur={() => onInputBlur(PARTYOPERATIONIDS.electionOffice)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.electionOffice)}
          error={errors?.expense?.electionOffice?.message}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.otherCost}
          name={PARTYOPERATIONIDS.otherCost}
          label={formatMessage(m.otherCost)}
          onBlur={() => onInputBlur(PARTYOPERATIONIDS.otherCost)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.otherCost)}
          error={errors?.expense?.otherCost?.message}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.capitalCost}
          name={PARTYOPERATIONIDS.capitalCost}
          label={formatMessage(m.capitalCost)}
          onBlur={() => onInputBlur(PARTYOPERATIONIDS.capitalCost)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.capitalCost)}
          error={errors?.expense?.capitalCost?.message}
          backgroundColor="blue"
          currency
        />
      </Box>
    </Fragment>
  )
}
