import { FC } from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { RentalAgreement } from '../../lib/dataSchema'
import { OtherFeesPayeeOptions, Routes } from '../../lib/constants'
import { CostField } from '../../lib/types'
import {
  filterEmptyCostItems,
  formatCurrency,
  formatDate,
  getOtherFeesHousingFundPayeeOptions,
  getOtherFeesPayeeOptions,
} from '../../lib/utils'
import { KeyValue } from './components/KeyValue'
import { SummaryCardRow } from './components/SummaryCardRow'
import { SummaryCard } from './components/SummaryCard'
import { summary } from '../../lib/messages'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route?: Routes
  hasChangeButton: boolean
}

export const OtherFeesSummary: FC<Props> = ({ ...props }) => {
  const { formatMessage } = useLocale()
  const { application, goToScreen, route, hasChangeButton } = props
  const answers = application.answers as RentalAgreement

  const otherFeesPayee = (answer: string) => {
    const options = getOtherFeesPayeeOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const otherFeesHousingFundPayee = (answer: string) => {
    const options = getOtherFeesHousingFundPayeeOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const tenantPaysHouseFund =
    answers.otherFees.housingFund === OtherFeesPayeeOptions.TENANT
  const tenantPaysElectricity =
    answers.otherFees.electricityCost === OtherFeesPayeeOptions.TENANT
  const tenantPaysHeating =
    answers.otherFees.heatingCost === OtherFeesPayeeOptions.TENANT
  const tenantPaysOtherFees = answers.otherFees.otherCosts?.includes('true')
  const otherCostItems = Array.isArray(answers.otherFees.otherCostItems)
    ? answers.otherFees.otherCostItems
    : []

  return (
    <SummaryCard cardLabel={formatMessage(summary.otherCostsHeader)}>
      <SummaryCardRow
        editAction={goToScreen}
        route={route}
        hasChangeButton={hasChangeButton}
        isLast={
          !tenantPaysHouseFund && !tenantPaysElectricity && !tenantPaysHeating
        }
      >
        <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
          <KeyValue
            label={summary.electricityCostLabel}
            value={
              otherFeesPayee(answers.otherFees.electricityCost as string) || '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
          <KeyValue
            label={summary.heatingCostLabel}
            value={
              otherFeesPayee(answers.otherFees.heatingCost as string) || '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
          <KeyValue
            label={summary.houseFundLabel}
            value={
              otherFeesHousingFundPayee(
                answers.otherFees.housingFund as string,
              ) || '-'
            }
          />
        </GridColumn>
      </SummaryCardRow>

      {tenantPaysElectricity && (
        <SummaryCardRow
          editAction={goToScreen}
          route={route}
          hasChangeButton={hasChangeButton}
          isLast={!tenantPaysHouseFund && !tenantPaysHeating}
        >
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.electricityMeterNumberLabel}
              value={answers.otherFees.electricityCostMeterNumber || '-'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.meterStatusLabel}
              value={answers.otherFees.electricityCostMeterStatus || '-'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.dateOfMeterReadingLabel}
              value={
                (answers.otherFees.electricityCostMeterStatusDate &&
                  formatDate(
                    answers.otherFees.electricityCostMeterStatusDate.toString(),
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
          hasChangeButton={hasChangeButton}
          isLast={!tenantPaysHouseFund}
        >
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.heatingCostMeterNumberLabel}
              value={answers.otherFees.heatingCostMeterNumber || '-'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.meterStatusLabel}
              value={answers.otherFees.heatingCostMeterStatus || '-'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.dateOfMeterReadingLabel}
              value={
                (answers.otherFees.heatingCostMeterStatusDate &&
                  formatDate(
                    answers.otherFees.heatingCostMeterStatusDate.toString(),
                  )) ||
                '-'
              }
            />
          </GridColumn>
        </SummaryCardRow>
      )}

      {tenantPaysHouseFund && (
        <SummaryCardRow
          editAction={goToScreen}
          route={route}
          hasChangeButton={hasChangeButton}
          isLast={!tenantPaysOtherFees}
        >
          <GridColumn span={['12/12']}>
            <KeyValue
              label={summary.houseFundAmountLabel}
              value={
                formatCurrency(answers.otherFees.housingFundAmount as string) ||
                '-'
              }
            />
          </GridColumn>
        </SummaryCardRow>
      )}
      {tenantPaysOtherFees &&
        filterEmptyCostItems(otherCostItems as CostField[]).map(
          (item, index) => (
            <SummaryCardRow
              editAction={goToScreen}
              route={route}
              hasChangeButton={hasChangeButton}
              isLast={otherCostItems.length - 1 === index}
            >
              <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
                <KeyValue
                  label={summary.otherCostsLabel}
                  value={item.description || ''}
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
                <KeyValue
                  label={summary.otherCostsAmountLabel}
                  value={
                    (item.amount && formatCurrency(item.amount.toString())) ||
                    '-'
                  }
                />
              </GridColumn>
            </SummaryCardRow>
          ),
        )}
    </SummaryCard>
  )
}
