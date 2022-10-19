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
          id={CEMETRYOPERATIONIDS.careIncome}
          name={CEMETRYOPERATIONIDS.careIncome}
          label={formatMessage(m.careIncome)}
          onChange={() => onInputChange(CEMETRYOPERATIONIDS.careIncome)}
          backgroundColor="blue"
          currency
          error={
            errors && getErrorViaPath(errors, CEMETRYOPERATIONIDS.careIncome)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.burialRevenue}
          name={CEMETRYOPERATIONIDS.burialRevenue}
          label={formatMessage(m.burialRevenue)}
          onChange={() => onInputChange(CEMETRYOPERATIONIDS.burialRevenue)}
          backgroundColor="blue"
          currency
          error={
            errors && getErrorViaPath(errors, CEMETRYOPERATIONIDS.burialRevenue)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.grantFromTheCemeteryFund}
          name={CEMETRYOPERATIONIDS.grantFromTheCemeteryFund}
          label={formatMessage(m.grantFromTheCemeteryFund)}
          onChange={() =>
            onInputChange(CEMETRYOPERATIONIDS.grantFromTheCemeteryFund)
          }
          backgroundColor="blue"
          currency
          error={
            errors &&
            getErrorViaPath(
              errors,
              CEMETRYOPERATIONIDS.grantFromTheCemeteryFund,
            )
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
