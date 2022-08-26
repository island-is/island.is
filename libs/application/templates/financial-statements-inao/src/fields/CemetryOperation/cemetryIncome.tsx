import React, { Fragment } from 'react'
import { Box } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { getErrorViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { CEMETRYOPERATIONIDS } from '../../lib/constants'

interface PropTypes {
  getSum: () => void
  errors: any
}

export const CemetryIncome = ({ errors, getSum }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const { clearErrors } = useFormContext()

  const onInputBlur = () => {
    getSum()
  }

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.caretaking}
          name={CEMETRYOPERATIONIDS.caretaking}
          label={formatMessage(m.caretaking)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(CEMETRYOPERATIONIDS.caretaking)}
          backgroundColor="blue"
          currency
          error={
            errors && getErrorViaPath(errors, CEMETRYOPERATIONIDS.caretaking)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.graveIncome}
          name={CEMETRYOPERATIONIDS.graveIncome}
          label={formatMessage(m.graveIncome)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(CEMETRYOPERATIONIDS.graveIncome)}
          backgroundColor="blue"
          currency
          error={
            errors && getErrorViaPath(errors, CEMETRYOPERATIONIDS.graveIncome)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.cemetryFundDonations}
          name={CEMETRYOPERATIONIDS.cemetryFundDonations}
          label={formatMessage(m.cemetryFundDonations)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(CEMETRYOPERATIONIDS.cemetryFundDonations)}
          backgroundColor="blue"
          currency
          error={
            errors && getErrorViaPath(errors, CEMETRYOPERATIONIDS.graveIncome)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.otherIncome}
          name={CEMETRYOPERATIONIDS.otherIncome}
          label={formatMessage(m.otherIncome)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(CEMETRYOPERATIONIDS.otherIncome)}
          backgroundColor="blue"
          currency
          error={
            errors && getErrorViaPath(errors, CEMETRYOPERATIONIDS.graveIncome)
          }
        />
      </Box>
    </Fragment>
  )
}
