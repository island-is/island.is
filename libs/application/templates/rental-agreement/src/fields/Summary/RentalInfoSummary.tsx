import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { RentalAgreement } from '../../lib/dataSchema'
import { summary } from '../../lib/messages'
import { divider, gridRow, summarySection } from './summaryStyles.css'
import { KeyValue } from './KeyValue'
import { useLocale } from '@island.is/localization'
import {
  formatCurrency,
  formatDate,
  getRentalAmountIndexTypes,
  getRentalAmountPaymentDateOptions,
  getSecurityDepositTypeOptions,
} from '../../lib/utils'
import { TRUE } from '../../lib/constants'

type Props = {
  answers: RentalAgreement
}

export const RentalInfoSummary = ({ answers }: Props) => {
  const { formatMessage } = useLocale()

  const securityDepositType = (answer: string) => {
    const options = getSecurityDepositTypeOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const paymentDate = (answer: string) => {
    const options = getRentalAmountPaymentDateOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const indexType = (answer: string) => {
    const options = getRentalAmountIndexTypes()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  return (
    <Box className={summarySection}>
      {/* Property Address */}
      <GridRow className={gridRow}>
        <GridColumn span={['12/12']}>
          <KeyValue
            label={`${answers.registerProperty.address}, ${answers.registerProperty.municipality}`}
            value={`${formatMessage(summary.rentalPropertyIdPrefix)}${
              answers.registerProperty.propertyId
            }`}
            labelVariant="h4"
            labelAs="h4"
            valueVariant="medium"
            valueAs="p"
          />
        </GridColumn>
      </GridRow>

      <div className={divider} />

      {/* Rental period */}
      <GridRow className={gridRow}>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.rentalPeriodStartDateLabel}
            value={
              answers.rentalPeriod.startDate &&
              formatDate(answers.rentalPeriod.startDate.toString())
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={
              answers.rentalPeriod.isDefinite?.includes('true')
                ? summary.rentalPeriodEndDateLabel
                : summary.rentalPeriodDefiniteLabel
            }
            value={
              answers.rentalPeriod.isDefinite?.includes('true') &&
              answers.rentalPeriod.endDate
                ? formatDate(answers.rentalPeriod.endDate.toString())
                : summary.rentalPeriodDefiniteValue
            }
          />
        </GridColumn>
      </GridRow>

      <div className={divider} />

      {/* Rental amount and security deposit */}
      <GridRow className={gridRow}>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.rentalAmountLabel}
            value={formatCurrency(answers.rentalAmount.amount)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.securityDepositLabel}
            value={'---'} // TODO: Add value compared to the security deposit amount
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.securityTypeLabel}
            value={securityDepositType(
              answers.securityDeposit.securityType as string,
            )}
          />
        </GridColumn>
      </GridRow>

      <div className={divider} />

      {/* Rent due date and index */}
      <GridRow className={gridRow}>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.paymentDateOptionsLabel}
            value={paymentDate(
              answers.rentalAmount.paymentDateOptions as string,
            )}
          />
        </GridColumn>
        {answers.rentalAmount.isIndexConnected?.includes(TRUE) &&
          answers.rentalAmount.indexTypes && (
            <>
              <GridColumn span={['12/12', '4/12']}>
                <KeyValue
                  label={summary.indexTypeLabel}
                  value={indexType(answers.rentalAmount.indexTypes)}
                />
              </GridColumn>
              <GridColumn span={['12/12', '4/12']}>
                <KeyValue
                  label={summary.indexValueLabel}
                  value={answers.rentalAmount.indexValue}
                />
              </GridColumn>
            </>
          )}
      </GridRow>

      {/* <div className={divider} />

        <GridRow className={gridRow}>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue
              label={summary.paymentTransactionTypeLabel}
              value={'---'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue
              label={summary.paymentTransactionAccountLabel}
              value={'---'}
            />
          </GridColumn>
        </GridRow> */}
    </Box>
  )
}
