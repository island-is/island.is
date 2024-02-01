import {
  GridRow as Row,
  GridColumn as Column,
  Select,
  Stack,
  Input,
  Checkbox,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import FormBuilderContext from '../../../../../context/FormBuilderContext'
import { IInput } from '../../../../../types/interfaces'
import { translationStation } from '../../../../../services/translationStation'

export default function BaseInput() {
  const {
    formBuilder,
    lists,
    listsDispatch,
    changeHandler,
    changeSelectHandler,
    onFocus,
    blur,
  } = useContext(FormBuilderContext)
  const { activeItem } = lists
  const currentItem = activeItem.data as IInput

  const options = formBuilder.inputTypes
    .map((it) => {
      return {
        label: it.type,
        value: it.type,
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label))

  const defaultOption =
    currentItem.type === ''
      ? null
      : options.find((o) => o.value === currentItem.type)

  return (
    <Stack space={2}>
      {defaultOption !== undefined && (
        <Row>
          <Column span="5/10">
            <Select
              label="Tegund"
              name="inputTypeSelect"
              options={options}
              placeholder="Veldu tegund"
              backgroundColor="blue"
              isSearchable
              value={defaultOption}
              onChange={(e) => changeSelectHandler(e)}
            />
          </Column>
        </Row>
      )}
      <Row>
        {/* Name  */}
        <Column span="10/10">
          <Input
            label="Heiti"
            name="name"
            value={currentItem.name.is}
            backgroundColor="blue"
            onChange={(e) => changeHandler(e, 'name')}
            onFocus={(e) => onFocus(e.target.value)}
            onBlur={(e) => blur(e)}
          />
        </Column>
      </Row>
      <Row>
        {/* Name en */}
        <Column span="10/10">
          <Input
            label="Heiti (enska)"
            name="nameEn"
            value={currentItem.name.en}
            backgroundColor="blue"
            onChange={(e) => changeHandler(e, 'nameEn')}
            onFocus={(e) => onFocus(e.target.value)}
            onBlur={(e) => blur(e)}
            buttons={[
              {
                label: 'translate',
                name: 'reader',
                onClick: async () => {
                  const translation = await translationStation(
                    currentItem.name.is,
                  )
                  listsDispatch({
                    type: 'changeName',
                    payload: {
                      lang: 'en',
                      newValue: translation.translations[0].translatedText,
                    },
                  })
                },
              },
            ]}
          />
        </Column>
      </Row>
      {/* Description  */}
      {['Textalýsing'].includes(currentItem.type) && (
        <>
          <Row>
            <Column span="10/10">
              <Input
                label="Lýsing"
                name="description"
                value={currentItem.description.is}
                textarea
                backgroundColor="blue"
                onFocus={(e) => onFocus(e.target.value)}
                onBlur={(e) => blur(e)}
                onChange={(e) =>
                  listsDispatch({
                    type: 'setDescription',
                    payload: {
                      lang: 'is',
                      newValue: e.target.value,
                    },
                  })
                }
              />
            </Column>
          </Row>
          <Row>
            <Column span="10/10">
              <Input
                label="Lýsing (enska)"
                name="description"
                value={currentItem.description.en}
                textarea
                backgroundColor="blue"
                onFocus={(e) => onFocus(e.target.value)}
                onBlur={(e) => blur(e)}
                onChange={(e) =>
                  listsDispatch({
                    type: 'setDescription',
                    payload: {
                      lang: 'en',
                      newValue: e.target.value,
                    },
                  })
                }
                buttons={[
                  {
                    label: 'translate',
                    name: 'reader',
                    onClick: async () => {
                      const translation = await translationStation(
                        currentItem.description.is,
                      )
                      listsDispatch({
                        type: 'setDescription',
                        payload: {
                          lang: 'en',
                          newValue: translation.translations[0].translatedText,
                        },
                      })
                    },
                  },
                ]}
              />
            </Column>
          </Row>
        </>
      )}
      <Row>
        {/* Required checkbox */}
        <Column span="5/10">
          <Checkbox
            label="Krafist"
            checked={currentItem.isRequired}
            onChange={(e) =>
              listsDispatch({
                type: 'setIsRequired',
                payload: {
                  guid: currentItem.guid,
                  isRequired: e.target.checked,
                },
              })
            }
          />
        </Column>
      </Row>
    </Stack>
  )
}
