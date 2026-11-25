import { FormSystemField } from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import { Checkbox, Inline, Input, Stack } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../../../../context/ControlContext'

export const TextFieldSettings = () => {
  const { control, controlDispatch, updateActiveItem, focus, setFocus } =
    useContext(ControlContext)
  const { activeItem, isReadOnly } = control
  const currentItem = activeItem.data as FormSystemField
  const { isLarge, maxLength } = currentItem.fieldSettings || {}
  const { formatMessage } = useIntl()

  return (
    <Stack space={2}>
      <Inline space={2}>
        <Checkbox
          checked={isLarge ?? false}
          label={formatMessage(m.largeTextArea)}
          disabled={isReadOnly}
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
        {isLarge && (
          <Input
            name="maxTextLength"
            label={formatMessage(m.maxTextLength)}
            type="number"
            value={maxLength || ''}
            size="sm"
            backgroundColor="blue"
            readOnly={isReadOnly}
            onChange={(event) =>
              controlDispatch({
                type: 'SET_ANY_FIELD_SETTING',
                payload: {
                  property: 'maxLength',
                  value: Number(event.target.value),
                },
              })
            }
            onFocus={(event) => setFocus(event.target.value)}
            onBlur={(event) =>
              event.target.value !== focus && updateActiveItem()
            }
          />
        )}
      </Inline>
    </Stack>
  )
}
