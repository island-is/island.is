import { FormSystemField } from '@island.is/api/schema'
import {
  GridColumn as Column,
  GridRow as Row,
  Input,
  Stack,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { ToggleConnection } from './ToggleConnection'

export const NumberSettings = () => {
  const { control, controlDispatch, setFocus, focus, updateActiveItem } =
    useContext(ControlContext)

  const { activeItem, isReadOnly } = control
  const currentItem = activeItem.data as FormSystemField
  const { minValue, maxValue, isDecimal } = currentItem.fieldSettings ?? {}

  return (
    <Stack space={2}>
      <Row>
        <Column>
          <ToggleSwitchCheckbox
            name="isDecimal"
            label="Leyfa tugabrot"
            checked={isDecimal ?? false}
            disabled={isReadOnly}
            onChange={(checked) =>
              controlDispatch({
                type: 'SET_ANY_FIELD_SETTING',
                payload: {
                  property: 'isDecimal',
                  value: checked,
                  update: updateActiveItem,
                },
              })
            }
          />
        </Column>
      </Row>

      <Row>
        <Column span="4/12">
          <Input
            name="minValue"
            backgroundColor="blue"
            label="Lágmarksgildi"
            type="number"
            value={minValue ?? ''}
            readOnly={isReadOnly}
            onChange={(e) =>
              controlDispatch({
                type: 'SET_ANY_FIELD_SETTING',
                payload: {
                  property: 'minValue',
                  value:
                    e.target.value === '' ? undefined : Number(e.target.value),
                },
              })
            }
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && updateActiveItem()}
          />
        </Column>

        <Column span="4/12">
          <Input
            name="maxValue"
            backgroundColor="blue"
            label="Hámarksgildi"
            type="number"
            value={maxValue ?? ''}
            readOnly={isReadOnly}
            onChange={(e) =>
              controlDispatch({
                type: 'SET_ANY_FIELD_SETTING',
                payload: {
                  property: 'maxValue',
                  value:
                    e.target.value === '' ? undefined : Number(e.target.value),
                },
              })
            }
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && updateActiveItem()}
          />
        </Column>
      </Row>
    </Stack>
  )
}
