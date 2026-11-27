import { FormSystemField } from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import { Checkbox, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useContext } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { FieldTextInput } from '../../FieldTextInput'
import { ToggleConnection } from './ToggleConnection'

export const CheckboxSettings = () => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const { activeItem, isReadOnly } = control
  const currentItem = activeItem.data as FormSystemField
  const { fieldSettings } = currentItem
  const { formatMessage } = useLocale()
  const hasSubLabelText = (['is', 'en'] as const).some(
    (lang) => (fieldSettings?.subLabel?.[lang] ?? '').trim().length > 0,
  )

  return (
    <Stack space={2}>
      <Checkbox
        checked={fieldSettings?.isLarge ?? false}
        label={formatMessage(m.largeCheckbox)}
        disabled={isReadOnly || (!!fieldSettings?.isLarge && hasSubLabelText)}
        tooltip={
          hasSubLabelText
            ? 'Ómögulegt að afvelja þar sem undirtexti er í notkun'
            : ''
        }
        onChange={(event) =>
          controlDispatch({
            type: 'SET_FIELD_SETTINGS',
            payload: {
              property: 'isLarge',
              value: event.target.checked,
              update: updateActiveItem,
            },
          })
        }
      />
      {fieldSettings?.isLarge && (
        <FieldTextInput
          property="subLabel"
          label={formatMessage(m.subLabel)}
          englishLabel={formatMessage(m.subLabelEnglish)}
        />
      )}
      <ToggleConnection />
    </Stack>
  )
}
