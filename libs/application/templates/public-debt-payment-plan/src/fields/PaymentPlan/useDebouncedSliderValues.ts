import { useState } from 'react'
import { useDebounce } from 'react-use'
import { PaymentModeState } from '../../types'

export const useDebouncedSliderValues = (
  currentAnswers:
    | {
        amountPerMonth?: number | undefined
        numberOfMonths?: number | undefined
        paymentMode?: PaymentModeState | undefined
        id: string
      }
    | undefined,
) => {
  const [amount, setAmount] = useState(currentAnswers?.amountPerMonth)
  const [debouncedAmount, setDebouncedAmount] = useState(
    currentAnswers?.amountPerMonth,
  )
  const [months, setMonths] = useState(currentAnswers?.numberOfMonths)
  const [debouncedMonths, setDebouncedMonths] = useState(
    currentAnswers?.numberOfMonths,
  )

  // Debounce the slider values so the info table is not updated on every value change
  useDebounce(() => setDebouncedAmount(amount), 500, [amount])
  useDebounce(() => setDebouncedMonths(months), 500, [months])

  return {
    debouncedAmount,
    debouncedMonths,
    setAmount,
    setMonths,
  }
}
