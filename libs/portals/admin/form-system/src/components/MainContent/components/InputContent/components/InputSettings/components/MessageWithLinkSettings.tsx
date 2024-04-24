import { useContext } from 'react'
import ControlContext from '../../../../../../../context/ControlContext'
import {
  GridRow as Row,
  GridColumn as Column,
  Input,
  Checkbox,
  Stack,
} from '@island.is/island-ui/core'
import { FormSystemInput } from '@island.is/api/schema'

const MessageWithLinkSettings = () => {
  const { control, controlDispatch, focus, setFocus, updateActiveItem } =
    useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemInput
  const { inputSettings } = currentItem
  return (
    <Stack space={2}>
      <Row>
        <Column>
          <Checkbox
            label="Bæta við hlekk"
            checked={inputSettings?.hasLink ?? false}
            onChange={(e) =>
              controlDispatch({
                type: 'SET_MESSAGE_WITH_LINK_SETTINGS',
                payload: {
                  property: 'hasLink',
                  checked: e.target.checked,
                  update: updateActiveItem,
                },
              })
            }
          />
        </Column>
      </Row>
      {inputSettings !== undefined && inputSettings?.hasLink && (
        <Stack space={2}>
          <Row>
            <Column span="5/10">
              <Input
                label="Hnapptexti"
                name="buttonTitle"
                backgroundColor="blue"
                value={inputSettings?.buttonText?.is ?? ''}
                onChange={(e) =>
                  controlDispatch({
                    type: 'SET_MESSAGE_WITH_LINK_SETTINGS',
                    payload: {
                      property: 'buttonText',
                      lang: 'is',
                      value: e.target.value,
                    },
                  })
                }
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
              />
            </Column>
            <Column span="5/10">
              <Input
                label="Hnapptexti (enska)"
                name="buttonTitle"
                backgroundColor="blue"
                value={inputSettings.buttonText?.en ?? ''}
                onChange={(e) =>
                  controlDispatch({
                    type: 'SET_MESSAGE_WITH_LINK_SETTINGS',
                    payload: {
                      property: 'buttonText',
                      lang: 'en',
                      value: e.target.value,
                    },
                  })
                }
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
              />
            </Column>
          </Row>
          <Row>
            <Column span="10/10">
              <Input
                label="Url"
                name="url"
                backgroundColor="blue"
                placeholder="island.is"
                value={inputSettings?.url ?? ''}
                onChange={(e) =>
                  controlDispatch({
                    type: 'SET_MESSAGE_WITH_LINK_SETTINGS',
                    payload: {
                      property: 'url',
                      value: e.target.value,
                    },
                  })
                }
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
              />
            </Column>
          </Row>
        </Stack>
      )}
    </Stack>
  )
}

export default MessageWithLinkSettings
