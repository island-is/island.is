import {
  GridRow as Row,
  GridColumn as Column,
  Input,
  Checkbox,
  Stack,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import FormBuilderContext from '../../../../../context/FormBuilderContext'
import { IInput } from '../../../../../types/interfaces'
import { translationStation } from '../../../../../services/translationStation'

export default function MessageWithLink() {
  const { lists, listsDispatch, setIsTyping, onFocus, blur } =
    useContext(FormBuilderContext)
  const { activeItem } = lists
  const currentItem = activeItem.data as IInput
  const { inputSettings } = currentItem
  return (
    <Stack space={2}>
      <Row>
        <Column>
          <Checkbox
            label="Bæta við hlekk"
            checked={inputSettings?.erHlekkur}
            onChange={(e) =>
              listsDispatch({
                type: 'setMessageWithLinkSettings',
                payload: {
                  property: 'erHlekkur',
                  checked: e.target.checked,
                },
              })
            }
          />
        </Column>
      </Row>
      {inputSettings !== undefined ? (
        inputSettings.erHlekkur && (
          <Stack space={2}>
            <Row>
              <Column span="5/10">
                <Input
                  label="hnapptexti"
                  name="buttonTitle"
                  backgroundColor="blue"
                  value={inputSettings.hnapptexti?.is}
                  onChange={(e) => {
                    setIsTyping(true)
                    listsDispatch({
                      type: 'setMessageWithLinkSettings',
                      payload: {
                        property: 'hnapptexti',
                        lang: 'is',
                        value: e.target.value,
                      },
                    })
                  }}
                  onFocus={(e) => onFocus(e.target.value)}
                  onBlur={(e) => blur(e)}
                />
              </Column>
              <Column span="5/10">
                <Input
                  label="hnapptexti (enska)"
                  name="buttonTitle"
                  backgroundColor="blue"
                  value={inputSettings.hnapptexti?.en}
                  onChange={(e) => {
                    setIsTyping(true)
                    listsDispatch({
                      type: 'setMessageWithLinkSettings',
                      payload: {
                        property: 'hnapptexti',
                        lang: 'en',
                        value: e.target.value,
                      },
                    })
                  }}
                  onFocus={(e) => onFocus(e.target.value)}
                  onBlur={(e) => blur(e)}
                  buttons={[
                    {
                      label: 'translate',
                      name: 'reader',
                      onClick: async () => {
                        const translation = await translationStation(
                          inputSettings?.hnapptexti?.is,
                        )
                        listsDispatch({
                          type: 'setMessageWithLinkSettings',
                          payload: {
                            property: 'hnapptexti',
                            lang: 'en',
                            value: translation.translations[0].translatedText,
                          },
                        })
                      },
                    },
                  ]}
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
                  value={inputSettings?.url}
                  onChange={(e) =>
                    listsDispatch({
                      type: 'setMessageWithLinkSettings',
                      payload: {
                        property: 'url',
                        value: e.target.value,
                      },
                    })
                  }
                  onFocus={(e) => onFocus(e.target.value)}
                  onBlur={(e) => blur(e)}
                />
              </Column>
            </Row>
          </Stack>
        )
      ) : (
        <></>
      )}
    </Stack>
  )
}
