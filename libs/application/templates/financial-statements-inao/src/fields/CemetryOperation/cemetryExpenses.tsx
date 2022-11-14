import React, { Fragment, useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath } from '@island.is/application/core'
import { RecordObject } from '@island.is/application/types'
import debounce from 'lodash/debounce'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'
import { INPUTCHANGEINTERVAL, CEMETRYOPERATIONIDS } from '../../lib/constants'
import { FinancialStatementsInaoTaxInfo } from '@island.is/api/schema'
interface PropTypes {
  data?: {
    financialStatementsInaoTaxInfo: FinancialStatementsInaoTaxInfo[]
  } | null
  loading: boolean
  getSum: () => void
  errors: RecordObject<unknown> | undefined
}

export const CemetryExpenses = ({
  data,
  loading,
  errors,
  getSum,
}: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const { clearErrors, setValue } = useFormContext()

  useEffect(() => {
    if (data?.financialStatementsInaoTaxInfo) {
      setValue(
        CEMETRYOPERATIONIDS.donationsToCemeteryFund,
        data.financialStatementsInaoTaxInfo?.[3]?.value?.toString() ?? '',
      )
    }
    getSum()
  }, [data, getSum, setValue])

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
          id={CEMETRYOPERATIONIDS.donationsToCemeteryFund}
          name={CEMETRYOPERATIONIDS.donationsToCemeteryFund}
          label={formatMessage(m.donationsToCemeteryFund)}
          loading={loading}
          onChange={() =>
            onInputChange(CEMETRYOPERATIONIDS.donationsToCemeteryFund)
          }
          error={
            errors &&
            getErrorViaPath(errors, CEMETRYOPERATIONIDS.donationsToCemeteryFund)
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
          id={CEMETRYOPERATIONIDS.depreciation}
          name={CEMETRYOPERATIONIDS.depreciation}
          label={formatMessage(m.depreciation)}
          onChange={() => onInputChange(CEMETRYOPERATIONIDS.depreciation)}
          error={
            errors && getErrorViaPath(errors, CEMETRYOPERATIONIDS.depreciation)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
    </Fragment>
  )
}
