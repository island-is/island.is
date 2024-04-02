import { Input } from '@island.is/island-ui/core'
import { useState } from 'react'
import { IInput } from '../../../../../types/interfaces'

type Props = {
  currentItem: IInput
}

export default function NumberInput({ currentItem }: Props) {
  const {
    lagmarkslengd: minLength = 0,
    hamarkslengd: maxLength = 0,
    laggildi: min = 0,
    hagildi: max = 0,
  } = currentItem.inputSettings
  // need to implement saving into listsDispatch

  const [value] = useState<string>('')
  const [error, setError] = useState<string | undefined>(undefined)

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
      setError(undefined)
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
