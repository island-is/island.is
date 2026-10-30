import { Hidden, Icon, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { amountFormat } from '@island.is/portals/my-pages/core'
import { useState } from 'react'
import { messages } from '../../../../lib/messages'
import { QuantityCounter } from '../QuantityCounter/QuantityCounter'
import { DrugRowDrug } from '../../../../utils/types'

type Props = {
  drug: DrugRowDrug
  handleQuantityChange: (val: number) => void
  handleRemove: () => void
}

export const DrugRow: React.FC<Props> = ({
  drug,
  handleQuantityChange,
  handleRemove,
}) => {
  const { formatMessage } = useLocale()
  const [quantity, setQuantity] = useState(1)

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1)
    handleQuantityChange(quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
      handleQuantityChange(quantity - 1)
    }
  }

  return (
    <>
      <T.Data text={{ variant: 'medium' }}>{drug.name}</T.Data>
      <T.Data text={{ variant: 'medium' }}>{drug.strength}</T.Data>
      <T.Data text={{ variant: 'medium' }}>
        <QuantityCounter
          quantity={quantity}
          incrementLabel={formatMessage(
            messages.medicineCalculatorIncreaseLabel,
            { arg: drug.name },
          )}
          decrementLabel={formatMessage(
            messages.medicineCalculatorDecreaseLabel,
            { arg: drug.name },
          )}
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
        />
      </T.Data>
      <T.Data text={{ variant: 'medium' }}>
        {amountFormat(drug.totalPrice ?? 0)}
      </T.Data>
      <T.Data text={{ variant: 'medium' }}>
        {amountFormat(drug.totalPaidIndividual ?? 0)}
      </T.Data>
      <T.Data text={{ variant: 'medium' }} align="center">
        <Hidden print>
          <button
            onClick={handleRemove}
            aria-label={formatMessage(messages.medicineCalculatorRemoveLabel, {
              arg: drug.name,
            })}
          >
            <Icon icon="trash" color="blue400" type="outline" size="small" />
          </button>
        </Hidden>
      </T.Data>
    </>
  )
}
