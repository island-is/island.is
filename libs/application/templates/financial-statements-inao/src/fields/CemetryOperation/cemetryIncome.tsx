import React, { Fragment } from 'react'
import { Box } from '@island.is/island-ui/core'
import { RecordObject } from '@island.is/application/types'
import debounce from 'lodash/debounce'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { getErrorViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { CEMETRYOPERATIONIDS, INPUTCHANGEINTERVAL } from '../../lib/constants'

interface PropTypes {
  getSum: () => void
  errors: RecordObject<unknown> | undefined
}

export const CemetryIncome = ({ errors, getSum }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const { clearErrors } = useFormContext()

  const onInputChange = debounce((fieldId: string) => {
    getSum()
    clearErrors(fieldId)
  }, INPUTCHANGEINTERVAL)

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.caretaking}
          name={CEMETRYOPERATIONIDS.caretaking}
          label={formatMessage(m.caretaking)}
          onChange={() => onInputChange(CEMETRYOPERATIONIDS.caretaking)}
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
          onChange={() => onInputChange(CEMETRYOPERATIONIDS.graveIncome)}
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
          onChange={() =>
            onInputChange(CEMETRYOPERATIONIDS.cemetryFundDonations)
          }
          backgroundColor="blue"
          currency
          error={
            errors &&
            getErrorViaPath(errors, CEMETRYOPERATIONIDS.cemetryFundDonations)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.otherIncome}
          name={CEMETRYOPERATIONIDS.otherIncome}
          label={formatMessage(m.otherIncome)}
          onChange={() => onInputChange(CEMETRYOPERATIONIDS.otherIncome)}
          backgroundColor="blue"
          currency
          error={
            errors && getErrorViaPath(errors, CEMETRYOPERATIONIDS.otherIncome)
          }
        />
      </Box>
    </Fragment>
  )
}
