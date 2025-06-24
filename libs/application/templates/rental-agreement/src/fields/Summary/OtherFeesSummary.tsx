import { FC } from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { applicationAnswers } from '../../shared'
import { Routes, OtherFeesPayeeOptions } from '../../utils/enums'
import { getOptionLabel } from '../../utils/summaryUtils'
import {
  formatCurrency,
  formatDate,
  getOtherFeesPayeeOptions,
} from '../../utils/utils'
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
  const { answers } = application

  const {
    housingFundPayee,
    electricityCostPayee,
    heatingCostPayee,
    otherCostItems,
    electricityCostMeterStatusDate,
    heatingCostMeterStatusDate,
    housingFundAmount,
    electricityCostMeterNumber,
    electricityCostMeterStatus,
    heatingCostMeterNumber,
    heatingCostMeterStatus,
  } = applicationAnswers(answers)

  const tenantPaysHouseFund = housingFundPayee === OtherFeesPayeeOptions.TENANT
  const tenantPaysElectricity =
    electricityCostPayee === OtherFeesPayeeOptions.TENANT
  const tenantPaysHeating = heatingCostPayee === OtherFeesPayeeOptions.TENANT
  const tenantPaysOtherFees = !!otherCostItems && otherCostItems.length > 0
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
            value={getOptionLabel(
              electricityCostPayee || '',
              getOtherFeesPayeeOptions,
              '',
            )}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
          <KeyValue
            label={summary.heatingCostLabel}
            value={getOptionLabel(
              heatingCostPayee || '',
              getOtherFeesPayeeOptions,
              '',
            )}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
          <KeyValue
            label={summary.houseFundLabel}
            value={getOptionLabel(
              housingFundPayee || '',
              getOtherFeesPayeeOptions,
              '',
            )}
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
              value={electricityCostMeterNumber || '-'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.meterStatusLabel}
              value={electricityCostMeterStatus || '-'}
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
              value={heatingCostMeterNumber || '-'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12', '6/12', '4/12', '4/12']}>
            <KeyValue
              label={summary.meterStatusLabel}
              value={heatingCostMeterStatus || '-'}
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
        isOtherCostItems.map((item, index) => (
          <SummaryCardRow
            key={`${item.description}_${index}`}
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
