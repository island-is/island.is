import React, { Fragment } from 'react'
import { Box } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'
import { CEMETRYOPERATIONIDS } from '../../lib/constants'

interface PropTypes {
  getSum: () => void
  errors: any
}

export const CemetryIncome = ({
  errors,
  getSum,
}: PropTypes): JSX.Element => {
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
          error={errors?.cemetryIncome?.caretaking?.message}
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
          error={errors?.cemetryIncome?.graveIncome?.message}
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
          error={errors?.cemetryIncome?.cemetryFundDonations?.message}
        />
      </Box>

      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.capitalIncome}
          name={CEMETRYOPERATIONIDS.capitalIncome}
          label={formatMessage(m.capitalIncome)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(CEMETRYOPERATIONIDS.capitalIncome)}
          backgroundColor="blue"
          currency
          error={errors?.cemetryIncome?.capitalIncome?.message}
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
          error={errors?.cemetryIncome?.otherIncome?.message}
        />
      </Box>
    </Fragment>
  )
}
