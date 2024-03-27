import { IInput } from '../../../../../../types/interfaces'
import {
  PropertyNumberCombined,
  PropertyNumberInput,
  PropertyNumberList,
} from './components'

interface Props {
  currentItem: IInput
}

export default function PropertyNumber({ currentItem }: Props) {
  const { inputSettings: settings } = currentItem
  const { erListi: hasList, erInnslattur: hasInput } = settings

  return (
    <>
      {hasList && !hasInput ? (
        <PropertyNumberList />
      ) : !hasList && hasInput ? (
        <PropertyNumberInput />
      ) : hasList && hasInput ? (
        <PropertyNumberCombined />
      ) : null}
    </>
  )
}
