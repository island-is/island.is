import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'
import { YES } from '../../lib/constants'
import { valueToNumber } from '../../lib/utils/helpers'

/**
  
Ég og Stefán erum gift og eigum saman íbúð upp á 90 milljónir.
Við eigum 50/50 í henni, en höfum gert erfðaskrá sem tekur fram að ég eigi séreign í eigninni, 30 milljónir.

Þegar ég dey, þá reiknast þetta sem:
Okkar sameign = 90M-30M=60M sem svo skiptist í tvennt þþví ég átti 50% í íbúðinni, svo 30M til skipta
Ofan á þessar 30M til skipta bætist mín séreign, 30M sem fer beint til skipta. Svo til skipta fer 30M+30M=60M.

*/

export const CalculateShare: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { answers } = application
  const { formatMessage } = useLocale()

  const getNumberValue = (key: string) => {
    return valueToNumber(getValueViaPath(answers, key))
  }

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
      <Box display="flex" flexDirection="column" marginTop={4}>
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
      </Box>
    </Box>
  )
}

export default CalculateShare
