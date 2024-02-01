import { Input } from '@island.is/island-ui/core'
import { useState } from 'react'
import { IInput } from '../../../../../types/interfaces'

type Props = {
  currentItem: IInput
}

export default function NumberInput({ currentItem }: Props) {
  const {
    lagmarkslengd: minLength,
    hamarkslengd: maxLength,
    laggildi: min,
    hagildi: max,
  } = currentItem.inputSettings
  // need to implement saving into listsDispatch

  const [value] = useState<number | null>(null)
  const [error, setError] = useState<string>(null)

  const changeHandler = (num: number) => {
    if (num.toString().length < minLength) {
      setError(`Lágmarkslengd er ${minLength}`)
    } else if (num.toString().length > maxLength) {
      setError(`Hámarkslengd er ${maxLength}`)
    } else if (num < min) {
      setError(`Lággildi er ${min}`)
    } else if (num > max) {
      setError(`Hágildi er ${max}`)
    } else {
      setError(null)
    }
  }

  return (
    <Input
      name="numberInput"
      label={currentItem.name.is}
      type="number"
      value={value}
      onChange={(e) => changeHandler(parseInt(e.target.value))}
      errorMessage={error}
    />
  )
}
