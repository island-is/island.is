import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, Fragment } from 'react'
import { m } from '../../../lib/messages'
import {
  getBankAccountsDataRow,
  getGunsDataRow,
  getInventoryDataRow,
  getMoneyDataRow,
  getOtherAssetsDataRow,
  getRealEstateDataRow,
  getStocksDataRow,
  getVehiclesDataRow,
} from './rows'
import { SectionType, RowProps, RowItemType } from './types'
import { getValueViaPath } from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { calculateTotalAssets } from '../../../lib/utils/calculateTotalAssets'
import { PREPAID_INHERITANCE } from '../../../lib/constants'
import { getPrePaidOverviewSectionsToDisplay } from '../../../lib/utils/helpers'

export const OverviewAssets: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  const isPrePaid = answers.applicationFor === PREPAID_INHERITANCE
  const { includeRealEstate, includeStocks, includeMoney, includeOtherAssets } =
    getPrePaidOverviewSectionsToDisplay(isPrePaid, answers)

  const sections: SectionType[] = []

  // Real estate
  const realEstateDataRow = getRealEstateDataRow(answers)
  const totalRealEstate = formatCurrency(
    String(getValueViaPath(answers, 'assets.realEstate.total')) ?? '',
  )

  includeRealEstate &&
    sections.push({
      title: m.realEstate,
      data: realEstateDataRow,
      total: totalRealEstate,
      totalTitle: isPrePaid
        ? m.realEstateEstimationPrePaid
        : m.realEstateEstimation,
    })

  if (!isPrePaid) {
    // Vehicles
    const vehiclesDataRow = getVehiclesDataRow(answers)
    const vehiclesDataTotal = formatCurrency(
      String(getValueViaPath(answers, 'assets.vehicles.total')) ?? '',
    )

    sections.push({
      title: m.vehicles,
      data: vehiclesDataRow,
      total: vehiclesDataTotal,
      totalTitle: m.marketValueTotal,
    })

    // Guns
    const gunsDataRow = getGunsDataRow(answers)
    const gunsDataTotal = formatCurrency(
      String(getValueViaPath(answers, 'assets.guns.total')) ?? '',
    )

    sections.push({
      title: m.guns,
      data: gunsDataRow,
      total: gunsDataTotal,
      totalTitle: m.marketValueTotal,
    })

    // Inventory
    const inventoryDataRow = getInventoryDataRow(answers)
    const inventoryDataTotal = formatCurrency(
      String(getValueViaPath(answers, 'assets.inventory.value')) ?? '',
    )

    sections.push({
      title: m.inventoryTitle,
      data: inventoryDataRow,
      total: inventoryDataTotal,
      totalTitle: m.marketValueTotal,
      showTotalFirst: true,
    })

    // Bank accounts
    const bankAccountsDataRow = getBankAccountsDataRow(answers)
    const bankAccountsDataTotal = formatCurrency(
      String(getValueViaPath(answers, 'assets.bankAccounts.total')) ?? '',
    )

    sections.push({
      title: m.estateBankInfo,
      data: bankAccountsDataRow,
      total: bankAccountsDataTotal,
      totalTitle: m.banksBalance,
    })

    // Claims
    const claimsDataTotal = formatCurrency(
      String(getValueViaPath(answers, 'assets.claims.total')) ?? '',
    )

    sections.push({
      title: m.claimsTitle,
      total: claimsDataTotal,
      totalTitle: m.totalValue,
    })
  }

  // Stocks
  const stocksDataRow = getStocksDataRow(answers)
  const totalStocks = formatCurrency(
    String(getValueViaPath(answers, 'assets.stocks.total')) ?? '',
  )

  includeStocks &&
    sections.push({
      title: m.stocksTitle,
      data: stocksDataRow,
      total: totalStocks,
      totalTitle: isPrePaid ? m.totalValuePrePaid : m.totalValue,
    })

  // Money
  const moneyDataRow = getMoneyDataRow(answers)

  includeMoney &&
    sections.push({
      title: isPrePaid ? m.moneyTitlePrePaid : m.moneyTitle,
      data: moneyDataRow,
    })

  // Other assets
  const otherAssetsDataRow = getOtherAssetsDataRow(answers)
  const totalOtherAssets = formatCurrency(
    String(getValueViaPath(answers, 'assets.otherAssets.total')) ?? '',
  )

  includeOtherAssets &&
    sections.push({
      title: m.otherAssetsTitle,
      data: otherAssetsDataRow,
      total: totalOtherAssets,
      totalTitle: isPrePaid ? m.totalValuePrePaid : m.totalValue,
    })

  // const gunsDataRow = getGunsDataRow(answers)
  // const gunsDataTotal = formatCurrency(
  //   String(getValueViaPath(answers, 'assets.guns.total')) ?? '',
  // )

  // sections.push({
  //   title: m.guns,
  //   data: gunsDataRow,
  //   total: gunsDataTotal,
  //   totalTitle: m.marketValueTotal,
  // })

  const totalAssets = calculateTotalAssets(answers)

  return (
    <Box>
      {sections.map(
        ({ data, title, total, totalTitle, showTotalFirst }, index) => {
          const totalRow = totalTitle && total && (
            <TopRow title={totalTitle} value={total} />
          )

          return (
            <Fragment key={index}>
              <Box marginBottom={2}>
                <Text variant="h3">{formatMessage(title)}</Text>
              </Box>
              {showTotalFirst && totalRow}
              {data?.map((row, index) => (
                <Row key={index} row={row} />
              ))}
              {!showTotalFirst && totalRow}
              <Box marginBottom={6}>
                <Divider />
              </Box>
            </Fragment>
          )
        },
      )}
      <Box marginTop={6}>
        <TopRow
          titleVariant="h3"
          valueVariant="h3"
          title={m.overviewTotal}
          value={formatCurrency(String(totalAssets))}
        />
      </Box>
    </Box>
  )
}

export default OverviewAssets

const Row = ({ row }: RowProps) => {
  const { formatMessage } = useLocale()
  const { title, value, items } = row
  const hasItems = items && items?.length > 0

  return (
    <Box marginBottom={2}>
      {title && <TopRow title={title} value={value ?? ''} />}
      {hasItems && (
        <Box marginLeft={[0, 4]}>
          {items.map(({ title, value, type = 'default' }, index) => {
            switch (type) {
              case 'info':
                return <InfoRow key={index} title={title} value={value} />
              default:
                return (
                  <GridRow key={index} rowGap={0} marginBottom={1}>
                    <GridColumn span={['1/1', '1/2']}>
                      <Text as="span" variant="small">
                        {typeof title === 'string'
                          ? title
                          : formatMessage(title)}
                      </Text>
                    </GridColumn>
                    <GridColumn span={['1/1', '1/2']}>
                      <Box textAlign={['left', 'right']}>
                        <Text as="span" variant="small">
                          {value}
                        </Text>
                      </Box>
                    </GridColumn>
                  </GridRow>
                )
            }
          })}
        </Box>
      )}
    </Box>
  )
}

const TopRow = ({
  title,
  titleVariant = 'h4',
  valueVariant = 'default',
  value,
}: RowItemType) => {
  const { formatMessage } = useLocale()

  return (
    <GridRow rowGap={0} marginBottom={2}>
      <GridColumn span={['1/1', '1/2']}>
        <Text variant={titleVariant} as="span">
          {typeof title === 'string' ? title : formatMessage(title)}
        </Text>
      </GridColumn>
      <GridColumn span={['1/1', '1/2']}>
        <Box textAlign={['left', 'right']}>
          <Text variant={valueVariant} as="span">
            {value}
          </Text>
        </Box>
      </GridColumn>
    </GridRow>
  )
}

const InfoRow = ({ title, value }: RowItemType) => {
  const { formatMessage } = useLocale()

  return (
    <GridRow rowGap={0} marginBottom={2}>
      <GridColumn span="1/1">
        <Text as="span" variant="small">
          {typeof title === 'string' ? title : formatMessage(title)}
        </Text>
      </GridColumn>
      <GridColumn span="1/1">
        <Text as="span" variant="small">
          {value}
        </Text>
      </GridColumn>
    </GridRow>
  )
}
