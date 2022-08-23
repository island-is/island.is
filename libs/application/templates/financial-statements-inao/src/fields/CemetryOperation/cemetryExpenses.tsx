import React, { Fragment } from 'react'
import { InputController } from '@island.is/shared/form-fields'

import { Box } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { CEMETRYOPERATIONIDS } from '../../lib/constants'
interface PropTypes {
  getSum: () => void
  errors: any
}

export const CemetryExpenses = ({ errors, getSum }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const { clearErrors } = useFormContext()

  const onInputBlur = () => {
    getSum()
  }

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.payroll}
          name={CEMETRYOPERATIONIDS.payroll}
          label={formatMessage(m.payroll)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(CEMETRYOPERATIONIDS.payroll)}
          error={errors?.cemetryExpense?.payroll?.message}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.funeralCost}
          name={CEMETRYOPERATIONIDS.funeralCost}
          label={formatMessage(m.funeralCost)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(CEMETRYOPERATIONIDS.funeralCost)}
          error={errors?.cemetryExpense?.funeralCost?.message}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.chapelExpense}
          name={CEMETRYOPERATIONIDS.chapelExpense}
          label={formatMessage(m.chapelExpense)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(CEMETRYOPERATIONIDS.chapelExpense)}
          error={errors?.cemetryExpense?.chapelExpense?.message}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.cemeteryFundExpense}
          name={CEMETRYOPERATIONIDS.cemeteryFundExpense}
          label={formatMessage(m.cemeteryFundExpense)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(CEMETRYOPERATIONIDS.cemeteryFundExpense)}
          error={errors?.cemetryExpense?.cemeteryFundExpense?.message}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.donationsToOther}
          name={CEMETRYOPERATIONIDS.donationsToOther}
          label={formatMessage(m.donationsToOther)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(CEMETRYOPERATIONIDS.donationsToOther)}
          error={errors?.cemetryExpense?.donationsToOther?.message}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.otherOperationCost}
          name={CEMETRYOPERATIONIDS.otherOperationCost}
          label={formatMessage(m.otherOperationCost)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(CEMETRYOPERATIONIDS.otherOperationCost)}
          error={errors?.cemetryExpense?.otherOperationCost?.message}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.writtenOffExpense}
          name={CEMETRYOPERATIONIDS.writtenOffExpense}
          label={formatMessage(m.writtenOffExpense)}
          onBlur={() => onInputBlur()}
          onChange={() => clearErrors(CEMETRYOPERATIONIDS.writtenOffExpense)}
          error={errors?.cemetryExpense?.writtenOffExpense?.message}
          backgroundColor="blue"
          currency
        />
      </Box>
    </Fragment>
  )
}
