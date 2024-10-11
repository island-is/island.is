import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { m } from '../../../lib/messages'
import { RowItemType } from '../OverviewAssets/types'
import { getValueViaPath } from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { ApplicationDebts, Debt as DebtType } from '../../../types'
import { format as formatNationalId } from 'kennitala'

export const OverviewDebts: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  const debtsData = (answers.debts as unknown as ApplicationDebts)
    ?.domesticAndForeignDebts.data

  return (
    <Box marginTop={2}>
      {debtsData && debtsData.length ? (
        debtsData.map((debt: DebtType, index: number) => (
          <Debt
            key={index}
            assetNumber={debt.assetNumber}
            debtType={debt.debtType}
            description={debt.description}
            nationalId={debt.nationalId}
            propertyValuation={debt.propertyValuation}
          />
        ))
      ) : (
        <TopRow title={formatMessage(m.domesticAndForeignDebts)} value={'0'} />
      )}
      <Box>
        <TopRow
          title={formatMessage(m.funeralCostTitle)}
          value={getValueViaPath<string>(answers, 'funeralCost.total') || '0'}
        />

        <Box marginLeft={[0, 4]}>
          <Row
            title={formatMessage(m.funeralBuildCost)}
            value={formatCurrency(
              getValueViaPath<string>(answers, 'funeralCost.build') || '0',
            )}
          />
          <Row
            title={formatMessage(m.funeralCremationCost)}
            value={formatCurrency(
              getValueViaPath<string>(answers, 'funeralCost.cremation') || '0',
            )}
          />
          <Row
            title={formatMessage(m.funeralPrintCost)}
            value={formatCurrency(
              getValueViaPath<string>(answers, 'funeralCost.print') || '0',
            )}
          />
          <Row
            title={formatMessage(m.funeralFlowersCost)}
            value={formatCurrency(
              getValueViaPath<string>(answers, 'funeralCost.flowers') || '0',
            )}
          />
          <Row
            title={formatMessage(m.funeralMusicCost)}
            value={formatCurrency(
              getValueViaPath<string>(answers, 'funeralCost.music') || '0',
            )}
          />
          <Row
            title={formatMessage(m.funeralRentCost)}
            value={formatCurrency(
              getValueViaPath<string>(answers, 'funeralCost.rent') || '0',
            )}
          />
          <Row
            title={formatMessage(m.funeralFoodAndDrinkCost)}
            value={formatCurrency(
              getValueViaPath<string>(answers, 'funeralCost.food') || '0',
            )}
          />
          <Row
            title={formatMessage(m.funeralTombstoneCost)}
            value={formatCurrency(
              getValueViaPath<string>(answers, 'funeralCost.tombstone') || '0',
            )}
          />
          <Row
            title={formatMessage(m.funeralOtherCost)}
            value={formatCurrency(
              getValueViaPath<string>(answers, 'funeralCost.other') || '0',
            )}
          />
        </Box>
        <Box marginTop={3} marginBottom={4}>
          <Divider />
        </Box>
      </Box>
    </Box>
  )
}

export default OverviewDebts

const Debt = ({
  assetNumber,
  debtType,
  description,
  nationalId,
  propertyValuation,
}: DebtType) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={2}>
      {description && (
        <TopRow title={description} value={propertyValuation ?? ''} />
      )}
      <Box marginLeft={[0, 4]}>
        {nationalId && (
          <Row
            title={formatMessage(m.nationalId)}
            value={formatNationalId(nationalId)}
          />
        )}
        <Row title={formatMessage(m.debtsLoanIdentity)} value={assetNumber} />
        <Row title={formatMessage(m.debtType)} value={debtType} />
      </Box>
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
            {formatCurrency(value)}
          </Text>
        </Box>
      </GridColumn>
    </GridRow>
  )
}

const Row = ({ title, value }: RowItemType) => {
  const { formatMessage } = useLocale()

  return (
    <GridRow rowGap={0} marginBottom={1}>
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
}
