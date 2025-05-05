import { useContext } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { FormSystemField } from '@island.is/api/schema'
import { Checkbox } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'

export const TextFieldSettings = () => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const { activeItem } = control
  const currentItem = activeItem.data as FormSystemField
  const { fieldSettings } = currentItem
  const { formatMessage } = useIntl()

  return (
    <Checkbox
      checked={fieldSettings?.isLarge ?? false}
      label={formatMessage(m.largeTextArea)}
      onChange={(e) =>
        controlDispatch({
          type: 'SET_FIELD_SETTINGS',
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
