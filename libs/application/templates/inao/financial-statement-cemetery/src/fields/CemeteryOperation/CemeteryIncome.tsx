import { useEffect } from 'react'
import { Box } from '@island.is/island-ui/core'
import { RecordObject } from '@island.is/application/types'
import debounce from 'lodash/debounce'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { FinancialStatementsInaoTaxInfo } from '@island.is/api/schema'
import { CEMETERYOPERATIONIDS, TaxInfoTypes } from '../../utils/constants'
import { INPUTCHANGEINTERVAL } from '@island.is/libs/application/templates/inao/shared/utils/constants'

type Props = {
  data?: {
    financialStatementsInaoTaxInfo: FinancialStatementsInaoTaxInfo[]
  } | null
  loading: boolean
  getSum: () => void
  errors: RecordObject<unknown> | undefined
}

export const CemetryIncome = ({ data, loading, errors, getSum }: Props) => {
  const { formatMessage } = useLocale()
  const { clearErrors, getValues, setValue } = useFormContext()

  useEffect(() => {
    const values = getValues()

    const careIncome = getValueViaPath(values, CEMETERYOPERATIONIDS.careIncome)
    const burialRevenue = getValueViaPath(
      values,
      CEMETERYOPERATIONIDS.burialRevenue,
    )
    const grantFromTheCemeteryFund = getValueViaPath(
      values,
      CEMETERYOPERATIONIDS.grantFromTheCemeteryFund,
    )

    if (data?.financialStatementsInaoTaxInfo) {
      if (!careIncome) {
        setValue(
          CEMETERYOPERATIONIDS.careIncome,
          data.financialStatementsInaoTaxInfo
            ?.find((x) => x.key === TaxInfoTypes.CARE_INCOME)
            ?.value?.toString() ?? '',
        )
      }
      if (!burialRevenue) {
        setValue(
          CEMETERYOPERATIONIDS.burialRevenue,
          data.financialStatementsInaoTaxInfo
            ?.find((x) => x.key === TaxInfoTypes.BURIAL_REVENUE)
            ?.value?.toString() ?? '',
        )
      }
      if (!grantFromTheCemeteryFund) {
        setValue(
          CEMETERYOPERATIONIDS.grantFromTheCemeteryFund,
          data.financialStatementsInaoTaxInfo
            ?.find((x) => x.key === TaxInfoTypes.GRANT_FROM_THE_CEMETERY_FUND)
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
    <>
      <Box paddingY={1}>
        <InputController
          id={CEMETERYOPERATIONIDS.careIncome}
          loading={loading}
          name={CEMETERYOPERATIONIDS.careIncome}
          label={formatMessage(m.careIncome)}
          onChange={() => onInputChange(CEMETERYOPERATIONIDS.careIncome)}
          backgroundColor="blue"
          currency
          rightAlign
          error={
            errors && getErrorViaPath(errors, CEMETERYOPERATIONIDS.careIncome)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETERYOPERATIONIDS.burialRevenue}
          loading={loading}
          name={CEMETERYOPERATIONIDS.burialRevenue}
          label={formatMessage(m.burialRevenue)}
          onChange={() => onInputChange(CEMETERYOPERATIONIDS.burialRevenue)}
          backgroundColor="blue"
          currency
          rightAlign
          error={
            errors &&
            getErrorViaPath(errors, CEMETERYOPERATIONIDS.burialRevenue)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETERYOPERATIONIDS.grantFromTheCemeteryFund}
          loading={loading}
          name={CEMETERYOPERATIONIDS.grantFromTheCemeteryFund}
          label={formatMessage(m.grantFromTheCemeteryFund)}
          onChange={() =>
            onInputChange(CEMETERYOPERATIONIDS.grantFromTheCemeteryFund)
          }
          backgroundColor="blue"
          currency
          rightAlign
          error={
            errors &&
            getErrorViaPath(
              errors,
              CEMETERYOPERATIONIDS.grantFromTheCemeteryFund,
            )
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETERYOPERATIONIDS.otherIncome}
          name={CEMETERYOPERATIONIDS.otherIncome}
          label={formatMessage(m.otherIncome)}
          onChange={() => onInputChange(CEMETERYOPERATIONIDS.otherIncome)}
          backgroundColor="blue"
          currency
          rightAlign
          error={
            errors && getErrorViaPath(errors, CEMETERYOPERATIONIDS.otherIncome)
          }
        />
      </Box>
    </>
  )
}
