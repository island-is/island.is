import { FormSystemField } from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import {
  Checkbox,
  GridColumn as Column,
  GridRow as Row,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useContext } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { ToggleConnection } from './ToggleConnection'

export const CheckboxSettings = () => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const { activeItem } = control
  const currentItem = activeItem.data as FormSystemField
  const { fieldSettings } = currentItem
  const { formatMessage } = useLocale()
  return (
    <Stack space={2}>
      <Row>
        <Column>
          <Checkbox
            checked={fieldSettings?.isLarge ?? false}
            label={formatMessage(m.largeCheckbox)}
            onChange={(e) => {
              controlDispatch({
                type: 'SET_FIELD_SETTINGS',
                payload: {
                  property: 'isLarge',
                  value: e.target.checked,
                  update: updateActiveItem,
                },
              })
              if (!e.target.checked && fieldSettings?.hasDescription) {
                controlDispatch({
                  type: 'SET_FIELD_SETTINGS',
                  payload: {
                    property: 'hasDescription',
                    value: false,
                    update: updateActiveItem,
                  },
                })
              }
            }}
          />
        </Column>
      </Row>
      {fieldSettings?.isLarge && (
        <Row>
          <Column>
            <Checkbox
              checked={fieldSettings?.hasDescription ?? false}
              label={formatMessage(m.hasSublabel)}
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
          </Column>
        </Row>
      )}
      <Row>
        <Column>
          <ToggleConnection />
        </Column>
      </Row>
    </Stack>
  )
}
