import { Table as T, Icon } from '@island.is/island-ui/core'
import { QuantityCounter } from '../QuantityCounter/QuantityCounter'
import { RightsPortalDrug } from '@island.is/api/schema'
import { useState } from 'react'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../../lib/messages'

type Props = {
  drug: RightsPortalDrug
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

  const currentPrice = (drug?.price ?? 0) * quantity

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
      <T.Data>{drug.name}</T.Data>
      <T.Data>{drug.strength}</T.Data>
      <T.Data>
        <QuantityCounter
          quantity={quantity}
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
        />
      </T.Data>
      <T.Data>
        {formatMessage(messages.medicinePaymentPaidAmount, {
          amount: currentPrice,
        })}
      </T.Data>
      <T.Data>Vantar gögn</T.Data>
      <T.Data>
        <button onClick={handleRemove}>
          <Icon icon="trash" color="blue400" type="outline" size="small" />
        </button>
      </T.Data>
    </>
  )
}
