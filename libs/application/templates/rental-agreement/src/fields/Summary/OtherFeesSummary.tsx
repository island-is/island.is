import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { RentalAgreement } from '../../lib/dataSchema'
import { summary } from '../../lib/messages'
import { divider, gridRow } from './summaryStyles.css'
import { KeyValue } from './KeyValue'
import { useLocale } from '@island.is/localization'
import {
  formatCurrency,
  formatDate,
  getRentalOtherFeesPayeeOptions,
} from '../../lib/utils'
import { RentOtherFeesPayeeOptions } from '../../lib/constants'
import { SummarySection } from './SummarySection'

type Props = {
  answers: RentalAgreement
}

export const OtherFeesSummary = ({ answers }: Props) => {
  const { formatMessage } = useLocale()

  const otherFeesPayee = (answer: string) => {
    const options = getRentalOtherFeesPayeeOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  return (
    <SummarySection sectionLabel={formatMessage(summary.otherCostsHeader)}>
      <GridRow className={gridRow}>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.electricityCostLabel}
            value={otherFeesPayee(
              answers.rentOtherFees.electricityCost as string,
            )}
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.heatingCostLabel}
            value={otherFeesPayee(answers.rentOtherFees.heatingCost as string)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.houseFundLabel}
            value={otherFeesPayee(answers.rentOtherFees.housingFund as string)}
          />
        </GridColumn>
      </GridRow>

      {answers.rentOtherFees.electricityCost ===
        RentOtherFeesPayeeOptions.TENANT && (
        <>
          <div className={divider} />

          <GridRow className={gridRow}>
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.electricityMeterNumberLabel}
                value={answers.rentOtherFees.electricityCostMeterNumber}
              />
            </GridColumn>
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.meterStatusLabel}
                value={answers.rentOtherFees.electricityCostMeterStatus}
              />
            </GridColumn>
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.dateOfMeterReadingLabel}
                value={
                  answers.rentOtherFees.electricityCostMeterStatusDate &&
                  formatDate(
                    answers.rentOtherFees.electricityCostMeterStatusDate.toString(),
                  )
                }
              />
            </GridColumn>
          </GridRow>
        </>
      )}

      {answers.rentOtherFees.heatingCost ===
        RentOtherFeesPayeeOptions.TENANT && (
        <>
          <div className={divider} />

          <GridRow className={gridRow}>
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.heatingCostMeterNumberLabel}
                value={answers.rentOtherFees.heatingCostMeterNumber}
              />
            </GridColumn>
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.meterStatusLabel}
                value={answers.rentOtherFees.heatingCostMeterStatus}
              />
            </GridColumn>
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.dateOfMeterReadingLabel}
                value={
                  answers.rentOtherFees.heatingCostMeterStatusDate &&
                  formatDate(
                    answers.rentOtherFees.heatingCostMeterStatusDate.toString(),
                  )
                }
              />
            </GridColumn>
          </GridRow>
        </>
      )}

      {answers.rentOtherFees.housingFund ===
        RentOtherFeesPayeeOptions.TENANT && (
        <>
          <div className={divider} />

          <GridRow className={gridRow}>
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.houseFundAmountLabel}
                value={formatCurrency(
                  answers.rentOtherFees.housingFundAmount as string,
                )}
              />
            </GridColumn>
          </GridRow>
        </>
      )}
    </SummarySection>
  )
}
