import React, { Fragment } from 'react'
import { InputController } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { getErrorViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { PARTYOPERATIONIDS } from '../../lib/constants'
interface PropTypes {
  getSum: () => void
  errors: any
}

export const PartyExpenses = ({ errors, getSum }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const { clearErrors } = useFormContext()
  const onInputBlur = () => {
    getSum()
  }

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.electionOffice}
          name={PARTYOPERATIONIDS.electionOffice}
          label={formatMessage(m.electionOffice)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(PARTYOPERATIONIDS.electionOffice)}
          error={
            errors && getErrorViaPath(errors, PARTYOPERATIONIDS.electionOffice)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.otherCost}
          name={PARTYOPERATIONIDS.otherCost}
          label={formatMessage(m.otherCost)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(PARTYOPERATIONIDS.otherCost)}
          error={errors && getErrorViaPath(errors, PARTYOPERATIONIDS.otherCost)}
          backgroundColor="blue"
          currency
        />
      </Box>
      {/* <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.capitalCost}
          name={PARTYOPERATIONIDS.capitalCost}
          label={formatMessage(m.capitalCost)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(PARTYOPERATIONIDS.capitalCost)}
          error={
            errors && getErrorViaPath(errors, PARTYOPERATIONIDS.capitalCost)
          }
          backgroundColor="blue"
          currency
        />
      </Box> */}
    </Fragment>
  )
}
