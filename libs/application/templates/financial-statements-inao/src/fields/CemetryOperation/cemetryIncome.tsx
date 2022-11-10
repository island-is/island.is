import React, { Fragment, useEffect } from 'react'
import { Box } from '@island.is/island-ui/core'
import { RecordObject } from '@island.is/application/types'
import debounce from 'lodash/debounce'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { getErrorViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { CEMETRYOPERATIONIDS, INPUTCHANGEINTERVAL } from '../../lib/constants'
import { FinancialStatementsInaoTaxInfo } from '@island.is/api/schema'

interface PropTypes {
  data?: {
    financialStatementsInaoTaxInfo: FinancialStatementsInaoTaxInfo[]
  } | null
  loading: boolean
  getSum: () => void
  errors: RecordObject<unknown> | undefined
}

export const CemetryIncome = ({
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
        CEMETRYOPERATIONIDS.careIncome,
        data.financialStatementsInaoTaxInfo?.[0]?.value?.toString() ?? '',
      )
      setValue(
        CEMETRYOPERATIONIDS.burialRevenue,
        data.financialStatementsInaoTaxInfo?.[1]?.value?.toString() ?? '',
      )
      setValue(
        CEMETRYOPERATIONIDS.grantFromTheCemeteryFund,
        data.financialStatementsInaoTaxInfo?.[2]?.value?.toString() ?? '',
      )
      getSum()
    }
  }, [data, getSum, setValue])

  const onInputChange = debounce((fieldId: string) => {
    getSum()
    clearErrors(fieldId)
  }, INPUTCHANGEINTERVAL)

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={CEMETRYOPERATIONIDS.careIncome}
          loading={loading}
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
          loading={loading}
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
          loading={loading}
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
          loading={loading}
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
