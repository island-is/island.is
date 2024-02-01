import {
  GridRow as Row,
  GridColumn as Column,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import FormBuilderContext from '../../../../../context/FormBuilderContext'
import { IInput } from '../../../../../types/interfaces'

export default function NumberInput() {
  const { lists, listsDispatch, onFocus, blur } = useContext(FormBuilderContext)
  const { activeItem } = lists
  const currentItem = activeItem.data as IInput
  const { inputSettings } = currentItem

  return (
    <Stack space={2}>
      <Row>
        <Column span="5/10">
          <Input
            label="Lágmarkslengd"
            type="number"
            name="minLength"
            backgroundColor="blue"
            value={inputSettings.lagmarkslengd}
            onFocus={(e) => onFocus(e.target.value)}
            onBlur={(e) => blur(e)}
            onChange={(e) =>
              listsDispatch({
                type: 'setNumberInputSettings',
                payload: {
                  property: 'lagmarkslengd',
                  value: e.target.value,
                },
              })
            }
          />
        </Column>
        <Column span="5/10">
          <Input
            label="Hámarkslengd"
            type="number"
            name="maxLength"
            backgroundColor="blue"
            value={inputSettings.hamarkslengd}
            onFocus={(e) => onFocus(e.target.value)}
            onBlur={(e) => blur(e)}
            onChange={(e) =>
              listsDispatch({
                type: 'setNumberInputSettings',
                payload: {
                  property: 'hamarkslengd',
                  value: e.target.value,
                },
              })
            }
          />
        </Column>
      </Row>
      <Row>
        <Column span="5/10">
          <Input
            label="Lággildi"
            type="number"
            name="minNumber"
            backgroundColor="blue"
            value={inputSettings.laggildi}
            onFocus={(e) => onFocus(e.target.value)}
            onBlur={(e) => blur(e)}
            onChange={(e) =>
              listsDispatch({
                type: 'setNumberInputSettings',
                payload: {
                  property: 'laggildi',
                  value: e.target.value,
                },
              })
            }
          />
        </Column>
        <Column span="5/10">
          <Input
            label="Hágildi"
            type="number"
            name="maxNumber"
            backgroundColor="blue"
            value={inputSettings.hagildi}
            onFocus={(e) => onFocus(e.target.value)}
            onBlur={(e) => blur(e)}
            onChange={(e) =>
              listsDispatch({
                type: 'setNumberInputSettings',
                payload: {
                  property: 'hagildi',
                  value: e.target.value,
                },
              })
            }
          />
        </Column>
      </Row>
    </Stack>
  )
}
