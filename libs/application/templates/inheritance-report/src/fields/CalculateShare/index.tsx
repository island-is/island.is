import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useEffect, useState } from 'react'
import { m } from '../../lib/messages'
import {
  getDeceasedHadAssets,
  getDeceasedWasInCohabitation,
  valueToNumber,
} from '../../lib/utils/helpers'
import { EstateAssets } from '../../types'
import { MessageDescriptor } from 'react-intl'
import { useFormContext } from 'react-hook-form'

type CalcShared = {
  value: number
  deduction: number
  shareValue: number
  deceasedShare: number
}[]

type ShareItem = {
  title: MessageDescriptor
  items: CalcShared
}

export const CalculateShare: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { answers } = application
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const [shareTotal, setShareTotal] = useState(0)
  const [allDebtsTotal, setAllDebtsTotal] = useState(0)
  const [netPropertyForExchange, setNetPropertyForExchange] = useState(0)
  const [netProperty, setNetProperty] = useState(0)

  const [shareValues, setShareValues] = useState<
    Record<keyof Partial<EstateAssets>, ShareItem>
  >({
    bankAccounts: { title: m.estateBankInfo, items: [] },
    claims: { title: m.claimsTitle, items: [] },
    guns: { title: m.guns, items: [] },
    inventory: { title: m.inventoryTitle, items: [] },
    money: { title: m.moneyTitle, items: [] },
    otherAssets: { title: m.otherAssetsTitle, items: [] },
    realEstate: { title: m.realEstate, items: [] },
    stocks: { title: m.stocksTitle, items: [] },
    vehicles: { title: m.vehiclesTitle, items: [] },
  })

  const deceasedHadAssets = getDeceasedHadAssets(application)
  const deceasedWasInCohabitation = getDeceasedWasInCohabitation(application)

  // Dæmi:
  // Tvær manneskjur, A og B eru gift og eiga saman íbúð upp á 90 milljónir.
  // Þær eiga 50/50 í henni, en hafa gert erfðaskrá sem tekur fram að A eigi séreign í eigninni, 30 milljónir.
  // Þegar A deyr, þá reiknast þetta sem:
  // Sameign = 90M-30M=60M sem skiptist í tvennt því A átti 50% í íbúðinni, svo 30M til skipta
  // Ofan á þessar 30M til skipta bætist séreign A, 30M sem fer beint til skipta. Svo til skipta fer 30M+30M=60M.
  const getShareValue = (value: number, deceasedShare: number): number => {
    const deceasedShareValue =
      deceasedHadAssets && deceasedShare > 0
        ? valueToNumber(value * (deceasedShare / 100))
        : 0

    let shareValue = Math.round(value)

    if (deceasedWasInCohabitation) {
      if (deceasedHadAssets) {
        shareValue = Math.round(
          (value - deceasedShareValue) / 2 + deceasedShareValue,
        )
      } else {
        shareValue = Math.round((value - deceasedShareValue) / 2)
      }
    }

    return shareValue
  }

  console.log('CalculateShare answers', answers)

  const getNumberValue = useCallback(
    (key: string) => {
      return valueToNumber(getValueViaPath(answers, key))
    },
    [answers],
  )

  const updateShareCalculations = useCallback(() => {
    const bankAccounts: CalcShared = (
      (answers.assets as unknown as EstateAssets)?.bankAccounts?.data ?? []
    ).map((item) => {
      // console.log('bankAccount', item)
      const propertyValuation = valueToNumber(item.propertyValuation)
      const exchangeRateOrInterest = valueToNumber(item.exchangeRateOrInterest)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const value = propertyValuation + exchangeRateOrInterest
      const shareValue = getShareValue(value, deceasedShare)
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShare,
      }
    })

    const claims: CalcShared = (
      (answers.assets as unknown as EstateAssets)?.claims?.data ?? []
    ).map((item) => {
      // console.log('claim', item)
      const value = valueToNumber(item.propertyValuation)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const shareValue = getShareValue(value, deceasedShare)
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShare,
      }
    })

    const guns: CalcShared = (
      (answers.assets as unknown as EstateAssets)?.guns?.data ?? []
    ).map((item) => {
      // console.log('gun', item)
      const value = valueToNumber(item.propertyValuation)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const shareValue = getShareValue(value, deceasedShare)
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShare,
      }
    })

    const inventory: CalcShared = (
      [(answers.assets as unknown as EstateAssets)?.inventory] ?? []
    ).map((item) => {
      // console.log('inventory', item)
      const value = valueToNumber(item.value)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const shareValue = getShareValue(value, deceasedShare)
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShare,
      }
    })

    const money: CalcShared = (
      [(answers.assets as unknown as EstateAssets)?.money] ?? []
    ).map((item) => {
      // console.log('money', item)
      const value = valueToNumber(item.value)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const shareValue = getShareValue(value, deceasedShare)
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShare,
      }
    })

    const otherAssets: CalcShared = (
      (answers.assets as unknown as EstateAssets)?.otherAssets?.data ?? []
    ).map((item) => {
      // console.log('otherAsset', item)
      const value = valueToNumber(item.value)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const shareValue = getShareValue(value, deceasedShare)
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShare,
      }
    })

    const realEstate: CalcShared = (
      (answers.assets as unknown as EstateAssets)?.realEstate?.data ?? []
    ).map((item) => {
      // console.log('realEstate', item)
      const value = valueToNumber(item.propertyValuation)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const shareValue = getShareValue(value, deceasedShare)
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShare,
      }
    })

    const stocks: CalcShared = (
      (answers.assets as unknown as EstateAssets)?.stocks?.data ?? []
    ).map((item) => {
      // console.log('stock', item)
      const value = valueToNumber(item.value)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const shareValue = getShareValue(value, deceasedShare)
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShare,
      }
    })

    const vehicles: CalcShared = (
      (answers.assets as unknown as EstateAssets)?.vehicles?.data ?? []
    ).map((item) => {
      // console.log('vehicle', item)
      const value = valueToNumber(item.propertyValuation)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const shareValue = getShareValue(value, deceasedShare)
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShare,
      }
    })

    setShareValues({
      bankAccounts: {
        ...shareValues.bankAccounts,
        items: bankAccounts,
      },
      claims: {
        ...shareValues.claims,
        items: claims,
      },
      guns: {
        ...shareValues.guns,
        items: guns,
      },
      inventory: {
        ...shareValues.inventory,
        items: inventory,
      },
      money: {
        ...shareValues.money,
        items: money,
      },
      otherAssets: {
        ...shareValues.otherAssets,
        items: otherAssets,
      },
      realEstate: {
        ...shareValues.realEstate,
        items: realEstate,
      },
      stocks: {
        ...shareValues.stocks,
        items: stocks,
      },
      vehicles: {
        ...shareValues.vehicles,
        items: vehicles,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers.assets])

  useEffect(() => {
    updateShareCalculations()
  }, [updateShareCalculations])

  useEffect(() => {
    console.log('shareValues', shareValues)

    let netPropertyValue = 0
    let shareTotalValue = 0
    let deductionTotal = 0

    for (const [_, value] of Object.entries(shareValues)) {
      const total = value.items.reduce((acc, item) => acc + item.value, 0)
      netPropertyValue += total

      const share = value.items.reduce((acc, item) => acc + item.shareValue, 0)
      shareTotalValue += share

      const deduction = value.items.reduce(
        (acc, item) => acc + item.deduction,
        0,
      )
      deductionTotal += deduction
    }

    setNetProperty(netPropertyValue)
    setShareTotal(shareTotalValue)
    setValue(`netProperty`, netPropertyValue)
    setValue(`shareTotal`, shareTotalValue)
    setValue(`cohabitantShare`, deductionTotal)
  }, [setValue, shareValues])

  const funeralCost = getNumberValue('funeralCost.total')
  const businessDebts = getNumberValue('business.businessDebts.total')
  const publicCharges = getNumberValue('debts.publicCharges')

  useEffect(() => {
    const allDebtsTotalValue =
      getNumberValue('debts.debtsTotal') + funeralCost + businessDebts
    const netPropertyForExchangeValue = shareTotal - allDebtsTotalValue

    setAllDebtsTotal(allDebtsTotalValue)
    setNetPropertyForExchange(netPropertyForExchangeValue)

    setValue(`allDebtsTotal`, allDebtsTotalValue)
    setValue(`netPropertyForExchange`, netPropertyForExchangeValue)
    setValue(`netProperty`, netProperty)
  }, [
    businessDebts,
    funeralCost,
    getNumberValue,
    netProperty,
    setValue,
    shareTotal,
  ])

  const domesticAndForeignDebts = valueToNumber(
    getValueViaPath<number>(answers, 'debts.domesticAndForeignDebts.total'),
  )

  return (
    <Box>
      <Box marginTop={4}>
        <Box marginBottom={2}>
          <GridRow>
            <GridColumn span={['1/1', '1/2']}>
              <Text variant="h4">{formatMessage(m.netProperty)}</Text>
            </GridColumn>
            <GridColumn span={['1/1', '1/2']}>
              <Text textAlign="right">
                {formatCurrency(String(netProperty))}
              </Text>
            </GridColumn>
          </GridRow>
        </Box>
        <Box marginLeft={[0, 4]}>
          <GridRow rowGap={1}>
            <ShareItemRow item={shareValues.bankAccounts} />
            <ShareItemRow item={shareValues.claims} />
            <ShareItemRow item={shareValues.guns} />
            <ShareItemRow item={shareValues.inventory} />
            <ShareItemRow item={shareValues.money} />
            <ShareItemRow item={shareValues.otherAssets} />
            <ShareItemRow item={shareValues.realEstate} />
            <ShareItemRow item={shareValues.stocks} />
            <ShareItemRow item={shareValues.vehicles} />
          </GridRow>
        </Box>
        <Box marginY={4}>
          <Box marginBottom={2}>
            <GridRow>
              <GridColumn span={['1/1', '1/2']}>
                <Text variant="h4">
                  {formatMessage(m.domesticAndForeignDebts)}
                </Text>
              </GridColumn>
              <GridColumn span={['1/1', '1/2']}>
                <Text textAlign="right">
                  {formatCurrency(String(-allDebtsTotal))}
                </Text>
              </GridColumn>
            </GridRow>
          </Box>
          <Box marginLeft={[0, 4]}>
            <GridRow rowGap={1}>
              <ItemRow title={m.funeralCostTitle} total={-funeralCost} />
              <ItemRow
                title={m.domesticAndForeignDebts}
                total={-domesticAndForeignDebts}
              />
              <ItemRow title={m.publicChargesTitle} total={-publicCharges} />
              <ItemRow title={m.business} total={-businessDebts} />
            </GridRow>
          </Box>
        </Box>
        <Divider />
        <Box paddingTop={4}>
          <GridRow>
            <GridColumn span={['1/1', '1/2']}>
              <Text variant="h4">
                {formatMessage(m.netPropertyForExchange)}
              </Text>
            </GridColumn>
            <GridColumn span={['1/1', '1/2']}>
              <Text textAlign="right">
                {formatCurrency(String(netPropertyForExchange))}
              </Text>
            </GridColumn>
          </GridRow>
        </Box>
      </Box>
    </Box>
  )
}

export default CalculateShare

const ShareItemRow = ({ item }: { item: ShareItem }) => {
  const { formatMessage } = useLocale()

  const total = item.items.reduce((acc, item) => acc + item.shareValue, 0)

  return (
    <>
      <GridColumn span={['1/1', '1/2']}>
        {item.title && <Text variant="small">{formatMessage(item.title)}</Text>}
      </GridColumn>
      <GridColumn span={['1/1', '1/2']}>
        <Box textAlign="right">
          <Text variant="small">{formatCurrency(String(total))}</Text>
        </Box>
      </GridColumn>
    </>
  )
}

const ItemRow = ({
  title,
  total,
}: {
  title: MessageDescriptor
  total: number
}) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <GridColumn span={['1/1', '1/2']}>
        {title && <Text variant="small">{formatMessage(title)}</Text>}
      </GridColumn>
      <GridColumn span={['1/1', '1/2']}>
        <Box textAlign="right">
          <Text variant="small">{formatCurrency(String(total))}</Text>
        </Box>
      </GridColumn>
    </>
  )
}

// Fasteignir
// Innbú
// Farartæki
// Skotvopn
// Innstæður í bönkum og sparisjóðum
// Verðbréf og kröfur
// Hlutabréf
// Peningar og bankahólf
// Aðrar eignir
// Yfirlit eigna
