import { YES, getValueViaPath } from '@island.is/application/core'
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
}) => {
  const { answers } = application
  const [, updateState] = useState<unknown>()
  const forceUpdate = useCallback(() => updateState({}), [])
  const { setValue, getValues } = useFormContext()
  const [total, setTotal] = useState(0)
  const [debtsTotal, setDebtsTotal] = useState(0)
  const [shareTotal, setShareTotal] = useState(0)
  const [netTotal, setNetTotal] = useState(0)
  const [spouseTotal, setSpouseTotal] = useState(0)
  const [estateTotal, setEstateTotal] = useState(0)
  const [netPropertyForExchange, setNetPropertyForExchange] = useState(0)
  const formValues = getValues()
  const [customSpouseSharePercentage, setCustomSpouseSharePercentage] =
    useState(
      formValues?.customShare?.customSpouseSharePercentage
        ? formValues.customShare?.customSpouseSharePercentage / 100
        : 50 / 100,
    )

  const deceasedHadAssets = getDeceasedHadAssets(application)
  const deceasedWasInCohabitation = getDeceasedWasInCohabitation(application)

  const hasCustomSpouseSharePercentage =
    deceasedWasInCohabitation &&
    formValues?.customShare?.hasCustomSpouseSharePercentage === YES

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
    )
      .filter((item) => !!item.enabled)
      .map((item) => {
        const propertyValuation = valueToNumber(item.propertyValuation)
        const exchangeRateOrInterest = valueToNumber(
          item.exchangeRateOrInterest,
        )
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
    )
      .filter((item) => !!item.enabled)
      .map((item) => {
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
    )
      .filter((item) => !!item.enabled)
      .map((item) => {
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

    const inventory: CalcShared = [
      (answers.assets as unknown as EstateAssets)?.inventory ?? [],
    ].map((item) => {
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

    const money: CalcShared = [
      (answers.assets as unknown as EstateAssets)?.money ?? [],
    ].map((item) => {
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
    )
      .filter((item) => item?.enabled)
      .map((item) => {
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
    )
      .filter((item) => !!item.enabled)
      .map((item) => {
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
    )
      .filter((item) => !!item.enabled)
      .map((item) => {
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
    setDebtsTotal(getNumberValue('debts.debtsTotal'))
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

    setSpouseTotal(
      deceasedWasInCohabitation
        ? (netTotal - shareTotal) * (deceasedWasInCohabitation ? val : 1)
        : 0,
    )
  }, [
    customSpouseSharePercentage,
    netTotal,
    shareTotal,
    deceasedWasInCohabitation,
  ])

  // Set the estate total value
  useEffect(() => {
    const val = parseFloat(
      (customSpouseSharePercentage > 0
        ? 1 - customSpouseSharePercentage
        : 0.5
      ).toFixed(7),
    )

    setEstateTotal(
      (netTotal - shareTotal) * (deceasedWasInCohabitation ? val : 1),
    )
  }, [
    customSpouseSharePercentage,
    netTotal,
    shareTotal,
    deceasedWasInCohabitation,
  ])

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
      setValue('customShare.customSpouseSharePercentage', '50')
    }
  }, [hasCustomSpouseSharePercentage, setValue])

  useEffect(() => {
    updateShareCalculations()
  }, [
    customSpouseSharePercentage,
    hasCustomSpouseSharePercentage,
    updateShareCalculations,
  ])

  return (
    <Box>
      <Box marginTop={2}>
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
        <Box>
          {deceasedWasInCohabitation && (
            <TitleRow
              title={m.assetsToShareSpouseShare}
              value={roundedValueToNumber(spouseTotal)}
            />
          )}
          <TitleRow
            title={m.assetsToShareEstateShare}
            value={roundedValueToNumber(estateTotal)}
          />
        </Box>
        {deceasedHadAssets && shareTotal > 0 && (
          <TitleRow title={m.share} value={roundedValueToNumber(shareTotal)} />
        )}
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
