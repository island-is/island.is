import { FormSystemField } from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import { Checkbox, Inline, Input, Stack } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../../../../context/ControlContext'

export const TextFieldSettings = () => {
  const { control, controlDispatch, updateActiveItem, focus, setFocus } =
    useContext(ControlContext)
  const { activeItem } = control
  const currentItem = activeItem.data as FormSystemField
  const { fieldSettings } = currentItem
  const { isLarge, hasDescription, maxLength } = fieldSettings || {}
  const { formatMessage } = useIntl()

  return (
    <Stack space={2}>
      <Checkbox
        checked={hasDescription ?? false}
        label={formatMessage(m.hasDescription)}
        onChange={(e) =>
          controlDispatch({
            type: 'SET_FIELD_SETTINGS',
            payload: {
              property: 'hasDescription',
              value: e.target.checked,
              update: updateActiveItem,
            },
          })
        }
      />
      <Inline space={2}>
        <Checkbox
          checked={isLarge ?? false}
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
        {isLarge && (
          <Input
            name="maxTextLength"
            label={formatMessage(m.maxTextLength)}
            type="number"
            value={maxLength || ''}
            size="sm"
            backgroundColor="blue"
            onChange={(e) =>
              controlDispatch({
                type: 'SET_ANY_FIELD_SETTING',
                payload: {
                  property: 'maxLength',
                  value: Number(e.target.value),
                },
              })
            }
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && updateActiveItem()}
          />
        )}
      </Inline>
    </Stack>
  )
}
