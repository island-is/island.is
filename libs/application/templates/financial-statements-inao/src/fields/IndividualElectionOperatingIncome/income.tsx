import React, { Fragment } from 'react'
import debounce from 'lodash/debounce'
import { useFormContext } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import { getErrorViaPath } from '@island.is/application/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  INPUTCHANGEINTERVAL,
  INDIVIDUALOPERATIONIDS,
} from '../../lib/constants'
interface PropTypes {
  getSum: () => void
}

export const Income = ({ getSum }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const { errors, clearErrors } = useFormContext()

  const onInputChange = debounce((fieldId: string) => {
    getSum()
    clearErrors(fieldId)
  }, INPUTCHANGEINTERVAL)

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.corporateDonations}
          name={INDIVIDUALOPERATIONIDS.corporateDonations}
          error={
            errors &&
            getErrorViaPath(errors, INDIVIDUALOPERATIONIDS.corporateDonations)
          }
          label={formatMessage(m.corporateDonation)}
          onChange={() =>
            onInputChange(INDIVIDUALOPERATIONIDS.corporateDonations)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.individualDonations}
          name={INDIVIDUALOPERATIONIDS.individualDonations}
          error={
            errors &&
            getErrorViaPath(errors, INDIVIDUALOPERATIONIDS.individualDonations)
          }
          label={formatMessage(m.individualDonations)}
          onChange={() =>
            onInputChange(INDIVIDUALOPERATIONIDS.individualDonations)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.personalDonations}
          name={INDIVIDUALOPERATIONIDS.personalDonations}
          error={
            errors &&
            getErrorViaPath(errors, INDIVIDUALOPERATIONIDS.personalDonations)
          }
          label={formatMessage(m.personalDonations)}
          onChange={() =>
            onInputChange(INDIVIDUALOPERATIONIDS.personalDonations)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.otherIncome}
          name={INDIVIDUALOPERATIONIDS.otherIncome}
          error={
            errors &&
            getErrorViaPath(errors, INDIVIDUALOPERATIONIDS.otherIncome)
          }
          label={formatMessage(m.otherIncome)}
          onChange={() => onInputChange(INDIVIDUALOPERATIONIDS.otherIncome)}
          backgroundColor="blue"
          currency
        />
      </Box>
    </Fragment>
  )
}
