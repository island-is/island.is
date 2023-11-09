import { Table as T, Icon } from '@island.is/island-ui/core'
import { QuantityCounter } from '../QuantityCounter/QuantityCounter'
import { RightsPortalDrug } from '@island.is/api/schema'
import { useState } from 'react'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../../lib/messages'
import { useIntl } from 'react-intl'

type DrugRowDrug = {
  name?: string | null
  strength?: string | null
  totalPrice?: number | null
  totalPaidIndividual?: number | null
}

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
  const intl = useIntl()

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
        {!!drug.totalPrice &&
          formatMessage(messages.medicinePaymentPaidAmount, {
            amount: intl.formatNumber(drug.totalPrice),
          })}
      </T.Data>
      <T.Data>
        {!!drug.totalPaidIndividual &&
          formatMessage(messages.medicinePaymentPaidAmount, {
            amount: drug.totalPaidIndividual,
          })}
      </T.Data>
      <T.Data>
        <button onClick={handleRemove}>
          <Icon icon="trash" color="blue400" type="outline" size="small" />
        </button>
      </T.Data>
    </>
  )
}
