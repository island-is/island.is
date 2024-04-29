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
import { m } from '../../lib/messages'
import {
  getBankAccountsDataRow,
  getGunsDataRow,
  getInventoryDataRow,
  getRealEstateDataRow,
  getVehiclesDataRow,
} from './rows'
import { SectionType, RowProps, RowItemType } from './types'
import { getValueViaPath } from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'

export const OverviewAssets: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const sections: SectionType[] = []

  // Real estate
  const realEstateDataRow = getRealEstateDataRow(answers)
  const realEstateDataTotal = formatCurrency(
    String(getValueViaPath(answers, 'assets.realEstate.total')) ?? '',
  )

  sections.push({
    title: m.realEstate,
    data: realEstateDataRow,
    total: realEstateDataTotal,
    totalTitle: m.realEstateEstimationOnDeath,
  })

  // Vehicles
  const vehiclesDataRow = getVehiclesDataRow(answers)
  const vehiclesDataTotal = formatCurrency(
    String(getValueViaPath(answers, 'assets.vehicles.total')) ?? '',
  )

  sections.push({
    title: m.vehicles,
    data: vehiclesDataRow,
    total: vehiclesDataTotal,
    totalTitle: m.marketValue,
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
    totalTitle: m.marketValue,
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
    totalTitle: m.marketValue,
  })

  // Bank accounts
  const bankAccountsDataRow = getBankAccountsDataRow(answers)
  const bankAccountsDataTotal = formatCurrency(
    String(getValueViaPath(answers, 'assets.inventory.value')) ?? '',
  )

  sections.push({
    title: m.inventoryTitle,
    data: bankAccountsDataRow,
    total: bankAccountsDataTotal,
    totalTitle: m.banksBalance,
  })

  return (
    <Box>
      <Box marginTop={2} as="p">
        <Text>{formatMessage(m.assetOverviewDescription)}</Text>
      </Box>
      <Box marginTop={6} />
      {sections.map(({ data, title, total, totalTitle }, index) => {
        return (
          <Fragment key={index}>
            <Box marginBottom={2}>
              <Text variant="h3">{formatMessage(title)}</Text>
            </Box>
            {data.map((row, index) => (
              <Row key={index} row={row} />
            ))}
            <TopRow title={totalTitle} value={total} />
            <Box marginBottom={6}>
              <Divider />
            </Box>
          </Fragment>
        )
      })}
    </Box>
  )
}

export default OverviewAssets

const Row = ({ row }: RowProps) => {
  const { formatMessage } = useLocale()
  const { title, value, items } = row

  const hasItems = items.length > 0

  return (
    <Box marginBottom={2}>
      <TopRow title={title} value={value} />
      {hasItems && (
        <Box marginLeft={[0, 4]}>
          {items.map(({ title, value }, index) => {
            return (
              <GridRow key={index} rowGap={0} marginBottom={1}>
                <GridColumn span={['1/1', '1/2']}>
                  <Text as="span" variant="small">
                    {typeof title === 'string' ? title : formatMessage(title)}
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
          })}
        </Box>
      )}
    </Box>
  )
}

const TopRow = ({ title, value }: RowItemType) => {
  const { formatMessage } = useLocale()

  return (
    <GridRow rowGap={0} marginBottom={2}>
      <GridColumn span={['1/1', '1/2']}>
        <Text variant="h4" as="span">
          {typeof title === 'string' ? title : formatMessage(title)}
        </Text>
      </GridColumn>
      <GridColumn span={['1/1', '1/2']}>
        <Box textAlign={['left', 'right']}>
          <Text as="span">{value}</Text>
        </Box>
      </GridColumn>
    </GridRow>
  )
}
