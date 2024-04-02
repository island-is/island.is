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
import { YES } from '../../lib/constants'
import { valueToNumber } from '../../lib/utils/helpers'
import { EstateAssets } from '../../types'
import { MessageDescriptor } from 'react-intl'
import { useFormContext } from 'react-hook-form'

/**
  
Ég og Stefán erum gift og eigum saman íbúð upp á 90 milljónir.
Við eigum 50/50 í henni, en höfum gert erfðaskrá sem tekur fram að ég eigi séreign í eigninni, 30 milljónir.

Þegar ég dey, þá reiknast þetta sem:
Okkar sameign = 90M-30M=60M sem svo skiptist í tvennt þþví ég átti 50% í íbúðinni, svo 30M til skipta
Ofan á þessar 30M til skipta bætist mín séreign, 30M sem fer beint til skipta. Svo til skipta fer 30M+30M=60M.

*/

type CalcShared = {
  value: number
  shareValue: number
  deceasedShare: number
}[]

type ShareItem = {
  title: MessageDescriptor
  items: CalcShared
}

const getShareValue = (value: number, deceasedShare: number): number => {
  const deceasedShareValue =
    deceasedShare > 0 ? valueToNumber(value * (deceasedShare / 100)) : 0

  const shareValue = Math.round((value - deceasedShareValue) / 2)

  return shareValue
}

export const CalculateShare: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { answers } = application
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const [shareTotal, setShareTotal] = useState(0)

  const [shareValues, setShareValues] = useState<
    Record<keyof Partial<EstateAssets>, ShareItem>
  >({
    bankAccounts: { title: m.bankAccount, items: [] },
    claims: { title: m.claimsTitle, items: [] },
    guns: { title: m.guns, items: [] },
    inventory: { title: m.inventoryTitle, items: [] },
    money: { title: m.moneyTitle, items: [] },
    otherAssets: { title: m.otherAssetsTitle, items: [] },
    realEstate: { title: m.realEstate, items: [] },
    stocks: { title: m.stocksTitle, items: [] },
    vehicles: { title: m.vehiclesTitle, items: [] },
  })
  console.log('CalculateShare answers', answers)

  const getNumberValue = (key: string) => {
    return valueToNumber(getValueViaPath(answers, key))
  }

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
      return {
        value,
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
      return {
        value,
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
      return {
        value,
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
      return {
        value,
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
      return {
        value,
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
      return {
        value,
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
      return {
        value,
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
      return {
        value,
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
      return {
        value,
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

    let shareTotal = 0

    for (const [_, value] of Object.entries(shareValues)) {
      const total = value.items.reduce((acc, item) => acc + item.shareValue, 0)
      shareTotal += total
    }

    setShareTotal(shareTotal)
    setValue(`shareTotal`, shareTotal)
  }, [setValue, shareValues])

  const assetsTotal = getNumberValue('assets.assetsTotal')
  const debtsTotal = getNumberValue('debts.debtsTotal')
  const businessTotal = getNumberValue('business.businessTotal')

  const shouldDeduct =
    getValueViaPath(answers, 'deceasedHadAssets') === YES &&
    getValueViaPath(answers, 'deceasedWasMarried') === YES

  // useEffect(() => {
  //   setValue('debts.debtsTotal', total)
  // }, [total, setValue])

  // Við þurfum að staðfesta að við séum að reikna hreina eign til skipta rétt => 8.1 / 2 = 8.2
  // Búshluti maka er 50% af hreinni eign
  //
  // Hrein eign:
  // eign - frádráttur (skuldir) + eign í atvinnurekstri - frádráttur (búshluti maka)
  const total = assetsTotal - debtsTotal + businessTotal
  const sharedDeduction = shouldDeduct ? total / 2 : 0

  const netPropertyForExchange = total - sharedDeduction

  return (
    <Box>
      {/* <Box display="flex" flexDirection="column" marginTop={4}>
        <Text variant="h4">
          {formatMessage(m.propertyForExchangeAlternative)}
        </Text>
        <Text>{formatCurrency(String(total))}</Text>
      </Box>
      <Box display="flex" flexDirection="column" marginTop={4}>
        <Text variant="h4">{formatMessage(m.totalDeductionAlternative)}</Text>
        <Text>{formatCurrency(String(sharedDeduction))}</Text>
      </Box>
      <Box display="flex" flexDirection="column" marginTop={4}>
        <Text variant="h4">{formatMessage(m.netPropertyForExchange)}</Text>
        <Text>{formatCurrency(String(netPropertyForExchange))}</Text>
      </Box> */}
      <Box marginTop={4}>
        <Box marginBottom={2}>
          <GridRow>
            <GridColumn span={['1/1', '1/2']}>
              <Text variant="h4">Hrein eign</Text>
            </GridColumn>
            <GridColumn span={['1/1', '1/2']}>
              <Text textAlign="right">
                {formatCurrency(String(shareTotal))}
              </Text>
            </GridColumn>
          </GridRow>
        </Box>
        <Box marginLeft={[0, 4]}>
          <GridRow rowGap={1}>
            <ItemRow item={shareValues.bankAccounts} />
            <ItemRow item={shareValues.claims} />
            <ItemRow item={shareValues.guns} />
            <ItemRow item={shareValues.inventory} />
            <ItemRow item={shareValues.money} />
            <ItemRow item={shareValues.otherAssets} />
            <ItemRow item={shareValues.realEstate} />
            <ItemRow item={shareValues.stocks} />
            <ItemRow item={shareValues.vehicles} />
          </GridRow>
        </Box>
        <Box marginY={4}>
          <GridRow>
            <GridColumn span={['1/1', '1/2']}>
              <Text variant="h4">Skuldir</Text>
            </GridColumn>
            <GridColumn span={['1/1', '1/2']}>
              <Text textAlign="right">{formatCurrency(String(0))}</Text>
            </GridColumn>
          </GridRow>
        </Box>
        <Divider weight="purple200" />
        <Box paddingTop={4}>
          <GridRow>
            <GridColumn span={['1/1', '1/2']}>
              <Text variant="h4">Hrein eign til skipta</Text>
            </GridColumn>
            <GridColumn span={['1/1', '1/2']}>
              <Text textAlign="right">{formatCurrency(String(0))}</Text>
            </GridColumn>
          </GridRow>
        </Box>
      </Box>
    </Box>
  )
}

export default CalculateShare

const ItemRow = ({ item }: { item: ShareItem }) => {
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
