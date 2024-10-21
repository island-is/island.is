import { useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { RecordObject } from '@island.is/application/types'
import debounce from 'lodash/debounce'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'
import { FinancialStatementsInaoTaxInfo } from '@island.is/api/schema'
import { CEMETERYOPERATIONIDS } from '../../utils/constants'
import { INPUTCHANGEINTERVAL } from '../../../../shared/utils/constants'
type Props = {
  data?: {
    financialStatementsInaoTaxInfo: FinancialStatementsInaoTaxInfo[]
  } | null
  loading: boolean
  getSum: () => void
  errors: RecordObject<unknown> | undefined
}

export const CemeteryExpenses = ({ data, loading, errors, getSum }: Props) => {
  const { formatMessage } = useLocale()
  const { clearErrors, setValue, getValues } = useFormContext()
  const values = getValues()

  const donationsToCemeteryFund = getValueViaPath(
    values,
    CEMETERYOPERATIONIDS.donationsToCemeteryFund,
  )

  useEffect(() => {
    if (data?.financialStatementsInaoTaxInfo) {
      if (!donationsToCemeteryFund) {
        setValue(
          CEMETERYOPERATIONIDS.donationsToCemeteryFund,
          data.financialStatementsInaoTaxInfo
            ?.find((x) => x.key === 334)
            ?.value?.toString() ?? '',
        )
      }
    }
    getSum()
  }, [data, getSum, setValue])

  const onInputChange = debounce((fieldId: string) => {
    getSum()
    clearErrors(fieldId)
  }, INPUTCHANGEINTERVAL)

  return (
    <>
      <Box paddingY={1}>
        <InputController
          id={CEMETERYOPERATIONIDS.payroll}
          name={CEMETERYOPERATIONIDS.payroll}
          label={formatMessage(m.payroll)}
          onChange={() => onInputChange(CEMETERYOPERATIONIDS.payroll)}
          error={
            errors && getErrorViaPath(errors, CEMETERYOPERATIONIDS.payroll)
          }
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETERYOPERATIONIDS.funeralCost}
          name={CEMETERYOPERATIONIDS.funeralCost}
          label={formatMessage(m.funeralCost)}
          onChange={() => onInputChange(CEMETERYOPERATIONIDS.funeralCost)}
          error={
            errors && getErrorViaPath(errors, CEMETERYOPERATIONIDS.funeralCost)
          }
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETERYOPERATIONIDS.chapelExpense}
          name={CEMETERYOPERATIONIDS.chapelExpense}
          label={formatMessage(m.chapelExpense)}
          onChange={() => onInputChange(CEMETERYOPERATIONIDS.chapelExpense)}
          error={
            errors &&
            getErrorViaPath(errors, CEMETERYOPERATIONIDS.chapelExpense)
          }
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETERYOPERATIONIDS.donationsToCemeteryFund}
          name={CEMETERYOPERATIONIDS.donationsToCemeteryFund}
          label={formatMessage(m.donationsToCemeteryFund)}
          loading={loading}
          onChange={() =>
            onInputChange(CEMETERYOPERATIONIDS.donationsToCemeteryFund)
          }
          error={
            errors &&
            getErrorViaPath(
              errors,
              CEMETERYOPERATIONIDS.donationsToCemeteryFund,
            )
          }
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETERYOPERATIONIDS.donationsToOther}
          name={CEMETERYOPERATIONIDS.donationsToOther}
          label={formatMessage(m.donationsToOther)}
          onChange={() => onInputChange(CEMETERYOPERATIONIDS.donationsToOther)}
          error={
            errors &&
            getErrorViaPath(errors, CEMETERYOPERATIONIDS.donationsToOther)
          }
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETERYOPERATIONIDS.otherOperationCost}
          name={CEMETERYOPERATIONIDS.otherOperationCost}
          label={formatMessage(m.otherOperationCost)}
          onChange={() =>
            onInputChange(CEMETERYOPERATIONIDS.otherOperationCost)
          }
          error={
            errors &&
            getErrorViaPath(errors, CEMETERYOPERATIONIDS.otherOperationCost)
          }
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={CEMETERYOPERATIONIDS.depreciation}
          name={CEMETERYOPERATIONIDS.depreciation}
          label={formatMessage(m.depreciation)}
          onChange={() => onInputChange(CEMETERYOPERATIONIDS.depreciation)}
          error={
            errors && getErrorViaPath(errors, CEMETERYOPERATIONIDS.depreciation)
          }
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
    </>
  )
}
