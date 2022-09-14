import React, { Fragment } from 'react'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath } from '@island.is/application/core'
import debounce from 'lodash/debounce'
import { Box } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { INPUTCHANGEINTERVAL, CEMETRYOPERATIONIDS } from '../../lib/constants'
interface PropTypes {
  getSum: () => void
  errors: any
}

export const CemetryExpenses = ({ errors, getSum }: PropTypes): JSX.Element => {
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
          id={CEMETRYOPERATIONIDS.payroll}
          name={CEMETRYOPERATIONIDS.payroll}
          label={formatMessage(m.payroll)}
          onChange={() => onInputChange(CEMETRYOPERATIONIDS.payroll)}
          error={errors && getErrorViaPath(errors, CEMETRYOPERATIONIDS.payroll)}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.funeralCost}
          name={CEMETRYOPERATIONIDS.funeralCost}
          label={formatMessage(m.funeralCost)}
          onChange={() => onInputChange(CEMETRYOPERATIONIDS.funeralCost)}
          error={
            errors && getErrorViaPath(errors, CEMETRYOPERATIONIDS.funeralCost)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.chapelExpense}
          name={CEMETRYOPERATIONIDS.chapelExpense}
          label={formatMessage(m.chapelExpense)}
          onChange={() => onInputChange(CEMETRYOPERATIONIDS.chapelExpense)}
          error={
            errors && getErrorViaPath(errors, CEMETRYOPERATIONIDS.chapelExpense)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.cemeteryFundExpense}
          name={CEMETRYOPERATIONIDS.cemeteryFundExpense}
          label={formatMessage(m.cemeteryFundExpense)}
          onChange={() =>
            onInputChange(CEMETRYOPERATIONIDS.cemeteryFundExpense)
          }
          error={
            errors &&
            getErrorViaPath(errors, CEMETRYOPERATIONIDS.cemeteryFundExpense)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.donationsToOther}
          name={CEMETRYOPERATIONIDS.donationsToOther}
          label={formatMessage(m.donationsToOther)}
          onChange={() => onInputChange(CEMETRYOPERATIONIDS.donationsToOther)}
          error={
            errors &&
            getErrorViaPath(errors, CEMETRYOPERATIONIDS.donationsToOther)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.otherOperationCost}
          name={CEMETRYOPERATIONIDS.otherOperationCost}
          label={formatMessage(m.otherOperationCost)}
          onChange={() => onInputChange(CEMETRYOPERATIONIDS.otherOperationCost)}
          error={
            errors &&
            getErrorViaPath(errors, CEMETRYOPERATIONIDS.otherOperationCost)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.writtenOffExpense}
          name={CEMETRYOPERATIONIDS.writtenOffExpense}
          label={formatMessage(m.writtenOffExpense)}
          onChange={() => onInputChange(CEMETRYOPERATIONIDS.writtenOffExpense)}
          error={
            errors &&
            getErrorViaPath(errors, CEMETRYOPERATIONIDS.writtenOffExpense)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
    </Fragment>
  )
}
