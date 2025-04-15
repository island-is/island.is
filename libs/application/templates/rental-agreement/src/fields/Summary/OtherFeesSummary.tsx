import { FC } from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { OtherFeesPayeeOptions, Routes, TRUE } from '../../lib/constants'
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
import { getValueViaPath } from '@island.is/application/core'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route?: Routes
  hasChangeButton: boolean
}

export const OtherFeesSummary: FC<Props> = ({ ...props }) => {
  const { formatMessage } = useLocale()
  const { application, goToScreen, route, hasChangeButton } = props
  const { answers } = application

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

  const housingFund = getValueViaPath<OtherFeesPayeeOptions>(
    answers,
    'otherFees.housingFund',
  )
  const electricityCost = getValueViaPath<OtherFeesPayeeOptions>(
    answers,
    'otherFees.electricityCost',
  )
  const heatingCost = getValueViaPath<OtherFeesPayeeOptions>(
    answers,
    'otherFees.heatingCost',
  )
  const otherCosts = getValueViaPath<string>(
    answers,
    'otherFees.otherCostItems',
  )
  const otherCostItems = getValueViaPath<CostField[]>(
    answers,
    'otherFees.otherCostItems',
  )
  const electricityCostMeterStatusDate = getValueViaPath<string>(
    answers,
    'otherFees.electricityCostMeterStatusDate',
  )
  const heatingCostMeterStatusDate = getValueViaPath<string>(
    answers,
    'otherFees.heatingCostMeterStatusDate',
  )
  const housingFundAmount = getValueViaPath<string>(
    answers,
    'otherFees.housingFundAmount',
  )

  const tenantPaysHouseFund = housingFund === OtherFeesPayeeOptions.TENANT
  const tenantPaysElectricity = electricityCost === OtherFeesPayeeOptions.TENANT
  const tenantPaysHeating = heatingCost === OtherFeesPayeeOptions.TENANT
  const tenantPaysOtherFees = otherCosts?.includes(TRUE)
  const isOtherCostItems = Array.isArray(otherCostItems) ? otherCostItems : []

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
            value={otherFeesPayee(electricityCost || '')}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
          <KeyValue
            label={summary.heatingCostLabel}
            value={otherFeesPayee(heatingCost || '')}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
          <KeyValue
            label={summary.houseFundLabel}
            value={otherFeesHousingFundPayee(housingFund || '')}
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
              value={
                getValueViaPath(
                  answers,
                  'otherFees.electricityCostMeterNumber',
                  '-',
                ) as string
              }
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.meterStatusLabel}
              value={
                getValueViaPath(
                  answers,
                  'otherFees.electricityCostMeterStatus',
                  '-',
                ) as string
              }
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.dateOfMeterReadingLabel}
              value={
                (electricityCostMeterStatusDate &&
                  formatDate(electricityCostMeterStatusDate.toString())) ||
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
              value={
                getValueViaPath(
                  answers,
                  'otherFees.heatingCostMeterNumber',
                  '-',
                ) as string
              }
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.meterStatusLabel}
              value={
                getValueViaPath(
                  answers,
                  'otherFees.heatingCostMeterStatus',
                  '-',
                ) as string
              }
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.dateOfMeterReadingLabel}
              value={
                (heatingCostMeterStatusDate &&
                  formatDate(heatingCostMeterStatusDate.toString())) ||
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
              value={housingFundAmount ? formatCurrency(housingFundAmount) : ''}
            />
          </GridColumn>
        </SummaryCardRow>
      )}
      {tenantPaysOtherFees &&
        filterEmptyCostItems(isOtherCostItems).map((item, index) => (
          <SummaryCardRow
            editAction={goToScreen}
            route={route}
            hasChangeButton={hasChangeButton}
            isLast={otherCostItems && otherCostItems.length - 1 === index}
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
                  (item.amount && formatCurrency(item.amount.toString())) || '-'
                }
              />
            </GridColumn>
          </SummaryCardRow>
        ))}
    </SummaryCard>
  )
}
