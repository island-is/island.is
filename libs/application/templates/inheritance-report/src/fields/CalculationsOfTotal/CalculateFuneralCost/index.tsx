import { getValueViaPath, YES } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { m } from '../../../lib/messages'
import { valueToNumber } from '../../../lib/utils/helpers'
import DoubleColumnRow from '../../../components/DoubleColumnRow'
import { InputController } from '@island.is/shared/form-fields'
import { GridRow } from '@island.is/island-ui/core'

export const CalculateFuneralCost: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { answers } = application
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const total = useMemo(() => {
    const buildCost = valueToNumber(
      getValueViaPath<string>(answers, 'funeralCost.build') ?? '0',
    )
    const cremationCost = valueToNumber(
      getValueViaPath<string>(answers, 'funeralCost.cremation') ?? '0',
    )
    const printCost = valueToNumber(
      getValueViaPath<string>(answers, 'funeralCost.print') ?? '0',
    )
    const flowersCost = valueToNumber(
      getValueViaPath<string>(answers, 'funeralCost.flowers') ?? '0',
    )
    const musicCost = valueToNumber(
      getValueViaPath<string>(answers, 'funeralCost.music') ?? '0',
    )
    const rentCost = valueToNumber(
      getValueViaPath<string>(answers, 'funeralCost.rent') ?? '0',
    )
    const foodCost = valueToNumber(
      getValueViaPath<string>(answers, 'funeralCost.food') ?? '0',
    )
    const tombstoneCost = valueToNumber(
      getValueViaPath<string>(answers, 'funeralCost.tombstone') ?? '0',
    )

    let sum =
      buildCost +
      cremationCost +
      printCost +
      flowersCost +
      musicCost +
      rentCost +
      foodCost +
      tombstoneCost

    const hasOtherCost = !!getValueViaPath<string[]>(
      answers,
      'funeralCost.hasOther',
    )?.includes(YES)

    if (hasOtherCost) {
      sum += valueToNumber(
        getValueViaPath<string>(answers, 'funeralCost.other') ?? '0',
      )
    }

    return sum
  }, [answers])

  useEffect(() => {
    setValue('funeralCost.total', total)
  }, [total, setValue])

  return (
    <GridRow>
      <DoubleColumnRow pushRight>
        <InputController
          id="funeralCost.total"
          name="funeralCost.total"
          format={(value: unknown) => formatCurrency(String(value))}
          label={formatMessage(m.funeralCostAmount)}
          backgroundColor="white"
          readOnly
        />
      </DoubleColumnRow>
    </GridRow>
  )
}

export default CalculateFuneralCost
