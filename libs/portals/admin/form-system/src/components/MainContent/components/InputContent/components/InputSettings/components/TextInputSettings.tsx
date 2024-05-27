import { useContext } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { FormSystemInput } from '@island.is/api/schema'
import { Checkbox } from '@island.is/island-ui/core'

export const TextInputSettings = () => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const { activeItem } = control
  const currentItem = activeItem.data as FormSystemInput
  const { inputSettings } = currentItem

  return (
    <Checkbox
      checked={inputSettings?.isLarge ?? false}
      label="Stórt textasvæði"
      onChange={(e) =>
        controlDispatch({
          type: 'SET_INPUT_SETTINGS',
          payload: {
            property: 'isLarge',
            value: e.target.checked,
            update: updateActiveItem,
          },
        })
      }
    />
  )
}
