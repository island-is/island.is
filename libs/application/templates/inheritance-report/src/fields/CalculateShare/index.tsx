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
  roundedValueToNumber,
  valueToNumber,
} from '../../lib/utils/helpers'
import { EstateAssets } from '../../types'
import { MessageDescriptor } from 'react-intl'
import { useFormContext } from 'react-hook-form'
import { YES } from '../../lib/constants'
import ShareInput from '../../components/ShareInput'

type CalcShared = {
  value: number
  deduction: number
  shareValue: number
  deceasedShare: number
  deceasedShareValue: number
}[]

type ShareItem = {
  title: MessageDescriptor
  items: CalcShared
}

export const CalculateShare: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  errors,
}) => {
  const { answers } = application
  const [, updateState] = useState<unknown>()
  const forceUpdate = useCallback(() => updateState({}), [])
  const { formatMessage } = useLocale()
  const { setValue, getValues } = useFormContext()
  // Heildareign
  const [total, setTotal] = useState(0)
  // Heildarskuldir
  const [debtsTotal, setDebtsTotal] = useState(0)
  // Heildarséreign
  const [shareTotal, setShareTotal] = useState(0)
  // Hrein eign: Heildareign - Heildarskuldir
  const [netTotal, setNetTotal] = useState(0)
  // Búshluti makans: Hrein eign - Heildarséreign / 2
  const [spouseTotal, setSpouseTotal] = useState(0)
  // Búshluti dánarbús: Hrein eign - Heildarséreign / 2
  const [estateTotal, setEstateTotal] = useState(0)
  // Hrein eign til skipta: Heildarséreign + Búshluti dánarbús
  const [netPropertyForExchange, setNetPropertyForExchange] = useState(0)
  // Búshluti maka ef annar en 50%
  const formValues = getValues()
  const [customSpouseSharePercentage, setCustomSpouseSharePercentage] =
    useState(
      formValues?.customSpouseSharePercentage
        ? formValues.customSpouseSharePercentage / 100
        : 0,
    )

  const hasCustomSpouseSharePercentage =
    !!formValues?.hasCustomSpouseSharePercentage?.includes(YES)

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
  const getShareValue = (
    value: number,
    deceasedShare: number,
  ): { shareValue: number; deceasedShareValue: number } => {
    const deceasedShareValue =
      deceasedHadAssets && deceasedShare > 0
        ? valueToNumber(value * (deceasedShare / 100))
        : 0

    let shareValue = value

    if (deceasedWasInCohabitation) {
      shareValue = (value - deceasedShareValue) / 2 + deceasedShareValue
    }

    return {
      shareValue,
      deceasedShareValue,
    }
  }

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
      const propertyValuation = valueToNumber(item.propertyValuation)
      const exchangeRateOrInterest = valueToNumber(item.exchangeRateOrInterest)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const value = propertyValuation + exchangeRateOrInterest
      const { shareValue, deceasedShareValue } = getShareValue(
        value,
        deceasedShare,
      )
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShareValue,
        deceasedShare,
      }
    })

    const claims: CalcShared = (
      (answers.assets as unknown as EstateAssets)?.claims?.data ?? []
    ).map((item) => {
      const value = valueToNumber(item.propertyValuation)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const { shareValue, deceasedShareValue } = getShareValue(
        value,
        deceasedShare,
      )
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShareValue,
        deceasedShare,
      }
    })

    const guns: CalcShared = (
      (answers.assets as unknown as EstateAssets)?.guns?.data ?? []
    ).map((item) => {
      const value = valueToNumber(item.propertyValuation)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const { shareValue, deceasedShareValue } = getShareValue(
        value,
        deceasedShare,
      )
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShareValue,
        deceasedShare,
      }
    })

    const inventory: CalcShared = (
      [(answers.assets as unknown as EstateAssets)?.inventory] ?? []
    ).map((item) => {
      const value = valueToNumber(item.value)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const { shareValue, deceasedShareValue } = getShareValue(
        value,
        deceasedShare,
      )
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShareValue,
        deceasedShare,
      }
    })

    const money: CalcShared = (
      [(answers.assets as unknown as EstateAssets)?.money] ?? []
    ).map((item) => {
      const value = valueToNumber(item.value)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const { shareValue, deceasedShareValue } = getShareValue(
        value,
        deceasedShare,
      )
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShareValue,
        deceasedShare,
      }
    })

    const otherAssets: CalcShared = (
      (answers.assets as unknown as EstateAssets)?.otherAssets?.data ?? []
    ).map((item) => {
      const value = valueToNumber(item.value)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const { shareValue, deceasedShareValue } = getShareValue(
        value,
        deceasedShare,
      )
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShareValue,
        deceasedShare,
      }
    })

    const realEstate: CalcShared = (
      (answers.assets as unknown as EstateAssets)?.realEstate?.data ?? []
    ).map((item) => {
      const value = valueToNumber(item.propertyValuation)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const { shareValue, deceasedShareValue } = getShareValue(
        value,
        deceasedShare,
      )
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShareValue,
        deceasedShare,
      }
    })

    const stocks: CalcShared = (
      (answers.assets as unknown as EstateAssets)?.stocks?.data ?? []
    ).map((item) => {
      const value = valueToNumber(item.value)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const { shareValue, deceasedShareValue } = getShareValue(
        value,
        deceasedShare,
      )
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShareValue,
        deceasedShare,
      }
    })

    const vehicles: CalcShared = (
      (answers.assets as unknown as EstateAssets)?.vehicles?.data ?? []
    ).map((item) => {
      const value = valueToNumber(item.propertyValuation)
      const deceasedShare = valueToNumber(item.deceasedShare)
      const { shareValue, deceasedShareValue } = getShareValue(
        value,
        deceasedShare,
      )
      const deduction = deceasedWasInCohabitation ? value - shareValue : 0
      return {
        value,
        deduction,
        shareValue,
        deceasedShareValue,
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
    forceUpdate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Set the total value of all assets
  useEffect(() => {
    let x = 0

    for (const [_, value] of Object.entries(shareValues)) {
      x += value.items.reduce((acc, item) => acc + item.value, 0)
    }

    setTotal(x)
  }, [shareValues])

  // Set the total value of debts + funeral costs
  useEffect(() => {
    const funeralCost = getNumberValue('funeralCost.total')
    const debtsTotalValue = getNumberValue('debts.debtsTotal') + funeralCost

    setDebtsTotal(debtsTotalValue)
  }, [getNumberValue, total])

  // Set the total value of all deceased seperate assets
  useEffect(() => {
    let x = 0

    for (const [_, value] of Object.entries(shareValues)) {
      x += value.items.reduce((acc, item) => acc + item.deceasedShareValue, 0)
    }

    setShareTotal(x)
  }, [shareValues])

  // Set the net total value
  useEffect(() => {
    setNetTotal(total - debtsTotal)
  }, [total, debtsTotal])

  // Set the spouse total value
  useEffect(() => {
    const val = parseFloat(
      (customSpouseSharePercentage > 0
        ? customSpouseSharePercentage
        : 0.5
      ).toFixed(7),
    )

    setSpouseTotal((netTotal - shareTotal) * val)
  }, [customSpouseSharePercentage, netTotal, shareTotal])

  // Set the estate total value
  useEffect(() => {
    const val = parseFloat(
      (customSpouseSharePercentage > 0
        ? 1 - customSpouseSharePercentage
        : 0.5
      ).toFixed(7),
    )

    setEstateTotal((netTotal - shareTotal) * val)
  }, [customSpouseSharePercentage, netTotal, shareTotal])

  // Set the estate total value
  useEffect(() => {
    setNetPropertyForExchange(shareTotal + estateTotal)
  }, [estateTotal, shareTotal])

  // Update application answers
  useEffect(() => {
    setValue('total', total)
    setValue('debtsTotal', debtsTotal)
    setValue('shareTotal', shareTotal)
    setValue('netTotal', netTotal)
    setValue('spouseTotal', spouseTotal)
    setValue('estateTotal', estateTotal)
    setValue('netPropertyForExchange', netPropertyForExchange)
  }, [
    debtsTotal,
    estateTotal,
    netPropertyForExchange,
    netTotal,
    setValue,
    shareTotal,
    spouseTotal,
    total,
  ])

  useEffect(() => {
    if (!hasCustomSpouseSharePercentage) {
      setCustomSpouseSharePercentage(0)
      setValue('customSpouseSharePercentage', '0')
    }
  }, [hasCustomSpouseSharePercentage, setValue])

  useEffect(() => {
    updateShareCalculations()
  }, [
    customSpouseSharePercentage,
    hasCustomSpouseSharePercentage,
    updateShareCalculations,
  ])

  const inputError = (errors?.customSpouseSharePercentage as string) ?? ''

  return (
    <Box>
      {hasCustomSpouseSharePercentage && (
        <GridRow>
          <GridColumn span={['1/1', '1/2']}>
            <ShareInput
              name="customSpouseSharePercentage"
              label={formatMessage(m.assetsToShareCustomSpousePercentage)}
              onAfterChange={(val) => {
                setCustomSpouseSharePercentage(val / 100)
              }}
              errorMessage={inputError}
              required
            />
          </GridColumn>
        </GridRow>
      )}

      <Box marginTop={4}>
        <TitleRow
          title={m.assetsToShareTotalAssets}
          value={roundedValueToNumber(total)}
        />
        <TitleRow
          title={m.assetsToShareTotalDebts}
          value={roundedValueToNumber(debtsTotal)}
        />
        <TitleRow
          title={m.netProperty}
          value={roundedValueToNumber(netTotal)}
        />
        <TitleRow title={m.share} value={roundedValueToNumber(shareTotal)} />
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
          <TitleRow
            title={m.assetsToShareSpouseShare}
            value={roundedValueToNumber(spouseTotal)}
          />
          <TitleRow
            title={m.assetsToShareEstateShare}
            value={roundedValueToNumber(estateTotal)}
          />
        </Box>
        <Divider />
        <Box paddingTop={4}>
          <TitleRow
            title={m.netPropertyForExchange}
            value={roundedValueToNumber(netPropertyForExchange)}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default CalculateShare

const ShareItemRow = ({ item }: { item: ShareItem }) => {
  const { formatMessage } = useLocale()

  const total = item.items.reduce((acc, item) => acc + item.value, 0)
  const shareTotal = item.items.reduce(
    (acc, item) => acc + item.deceasedShareValue,
    0,
  )

  return (
    <GridColumn span={['1/1']}>
      <GridRow rowGap={0}>
        <GridColumn span={['1/1', '1/2']}>
          {item.title && (
            <Text variant="small">{formatMessage(item.title)}</Text>
          )}
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <Box textAlign={['left', 'right']}>
            <Text variant="small">
              {formatCurrency(String(roundedValueToNumber(total)))}
            </Text>
          </Box>
        </GridColumn>
        {shareTotal > 0 && (
          <>
            <GridColumn span={['1/1', '1/2']}>
              <Text variant="small">{formatMessage(m.share)}</Text>
            </GridColumn>
            <GridColumn span={['1/1', '1/2']}>
              <Box textAlign={['left', 'right']}>
                <Text variant="small">
                  {formatCurrency(String(roundedValueToNumber(shareTotal)))}
                </Text>
              </Box>
            </GridColumn>
          </>
        )}
      </GridRow>
    </GridColumn>
  )
}

const TitleRow = ({
  title,
  value,
}: {
  title: MessageDescriptor
  value: number
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={2}>
      <GridRow>
        <GridColumn span={['1/1', '1/2']}>
          <Text variant="h4">{formatMessage(title)}</Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <Box textAlign={['left', 'right']}>
            <Text>{formatCurrency(String(roundedValueToNumber(value)))}</Text>
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

// const ItemRow = ({
//   title,
//   total,
// }: {
//   title: MessageDescriptor
//   total: number
// }) => {
//   const { formatMessage } = useLocale()

//   return (
//     <GridColumn span={['1/1']}>
//       <GridRow rowGap={0}>
//         <GridColumn span={['1/1', '1/2']}>
//           {title && <Text variant="small">{formatMessage(title)}</Text>}
//         </GridColumn>
//         <GridColumn span={['1/1', '1/2']}>
//           <Box textAlign={['left', 'right']}>
//             <Text variant="small">{formatCurrency(String(total))}</Text>
//           </Box>
//         </GridColumn>
//       </GridRow>
//     </GridColumn>
//   )
// }
