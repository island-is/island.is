import React, { Fragment, useEffect } from 'react'
import { Box } from '@island.is/island-ui/core'
import { RecordObject } from '@island.is/application/types'
import debounce from 'lodash/debounce'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
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
  const { clearErrors, getValues, setValue } = useFormContext()

  useEffect(() => {
    const values = getValues()

    const careIncome = getValueViaPath(values, CEMETRYOPERATIONIDS.careIncome)
    const burialRevenue = getValueViaPath(
      values,
      CEMETRYOPERATIONIDS.burialRevenue,
    )
    const grantFromTheCemeteryFund = getValueViaPath(
      values,
      CEMETRYOPERATIONIDS.grantFromTheCemeteryFund,
    )

    if (data?.financialStatementsInaoTaxInfo) {
      if (!careIncome) {
        setValue(
          CEMETRYOPERATIONIDS.careIncome,
          data.financialStatementsInaoTaxInfo
            ?.find((x) => x.key === 300)
            ?.value?.toString() ?? '',
        )
      }
      if (!burialRevenue) {
        setValue(
          CEMETRYOPERATIONIDS.burialRevenue,
          data.financialStatementsInaoTaxInfo
            ?.find((x) => x.key === 301)
            ?.value?.toString() ?? '',
        )
      }
      if (!grantFromTheCemeteryFund) {
        setValue(
          CEMETRYOPERATIONIDS.grantFromTheCemeteryFund,
          data.financialStatementsInaoTaxInfo
            ?.find((x) => x.key === 302)
            ?.value?.toString() ?? '',
        )
      }
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
          rightAlign
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
          rightAlign
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
          rightAlign
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
          rightAlign
          error={
            errors && getErrorViaPath(errors, CEMETRYOPERATIONIDS.otherIncome)
          }
        />
      </Box>
    </Fragment>
  )
}
