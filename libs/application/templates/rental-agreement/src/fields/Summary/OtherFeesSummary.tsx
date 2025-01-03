import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { RentalAgreement } from '../../lib/dataSchema'
import { RentOtherFeesPayeeOptions, Routes } from '../../lib/constants'
import {
  formatCurrency,
  formatDate,
  getRentalOtherFeesPayeeOptions,
} from '../../lib/utils'
import { KeyValue } from './components/KeyValue'
import { SummaryCardRow } from './components/SummaryCardRow'
import { SummaryCard } from './components/SummaryCard'
import { summary } from '../../lib/messages'

type Props = {
  answers: RentalAgreement
  goToScreen?: (id: string) => void
  route?: Routes
}

export const OtherFeesSummary = ({ answers, goToScreen, route }: Props) => {
  const { formatMessage } = useLocale()

  const otherFeesPayee = (answer: string) => {
    const options = getRentalOtherFeesPayeeOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const tenantPaysHouseFund =
    answers.rentOtherFees.housingFund === RentOtherFeesPayeeOptions.TENANT
  const tenantPaysElectricity =
    answers.rentOtherFees.electricityCost === RentOtherFeesPayeeOptions.TENANT
  const tenantPaysHeating =
    answers.rentOtherFees.heatingCost === RentOtherFeesPayeeOptions.TENANT

  return (
    <SummaryCard cardLabel={formatMessage(summary.otherCostsHeader)}>
      <SummaryCardRow
        editAction={goToScreen}
        route={route}
        isLast={
          !tenantPaysHouseFund && !tenantPaysElectricity && !tenantPaysHeating
        }
      >
        <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
          <KeyValue
            label={summary.electricityCostLabel}
            value={
              otherFeesPayee(answers.rentOtherFees.electricityCost as string) ||
              '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
          <KeyValue
            label={summary.heatingCostLabel}
            value={
              otherFeesPayee(answers.rentOtherFees.heatingCost as string) || '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
          <KeyValue
            label={summary.houseFundLabel}
            value={
              otherFeesPayee(answers.rentOtherFees.housingFund as string) || '-'
            }
          />
        </GridColumn>
      </SummaryCardRow>

      {tenantPaysElectricity && (
        <SummaryCardRow
          editAction={goToScreen}
          route={route}
          isLast={!tenantPaysHouseFund && !tenantPaysHeating}
        >
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.electricityMeterNumberLabel}
              value={answers.rentOtherFees.electricityCostMeterNumber || '-'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.meterStatusLabel}
              value={answers.rentOtherFees.electricityCostMeterStatus || '-'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.dateOfMeterReadingLabel}
              value={
                (answers.rentOtherFees.electricityCostMeterStatusDate &&
                  formatDate(
                    answers.rentOtherFees.electricityCostMeterStatusDate.toString(),
                  )) ||
                '-'
              }
            />
          </GridColumn>
        </SummaryCardRow>
      )}

      {tenantPaysHeating && (
        <SummaryCardRow
          editAction={goToScreen}
          route={route}
          isLast={!tenantPaysHouseFund}
        >
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.heatingCostMeterNumberLabel}
              value={answers.rentOtherFees.heatingCostMeterNumber || '-'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.meterStatusLabel}
              value={answers.rentOtherFees.heatingCostMeterStatus || '-'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.dateOfMeterReadingLabel}
              value={
                (answers.rentOtherFees.heatingCostMeterStatusDate &&
                  formatDate(
                    answers.rentOtherFees.heatingCostMeterStatusDate.toString(),
                  )) ||
                '-'
              }
            />
          </GridColumn>
        </SummaryCardRow>
      )}

      {tenantPaysHouseFund && (
        <SummaryCardRow editAction={goToScreen} route={route} isLast={true}>
          <GridColumn span={['12/12']}>
            <KeyValue
              label={summary.houseFundAmountLabel}
              value={
                formatCurrency(
                  answers.rentOtherFees.housingFundAmount as string,
                ) || '-'
              }
            />
          </GridColumn>
        </SummaryCardRow>
      )}
    </SummaryCard>
  )
}
