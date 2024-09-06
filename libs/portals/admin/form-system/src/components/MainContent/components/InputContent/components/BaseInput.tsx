import { useContext } from 'react'
import { ControlContext } from '../../../../../context/ControlContext'
import { FormSystemInput } from '@island.is/api/schema'
import {
  Stack,
  GridRow as Row,
  GridColumn as Column,
  Select,
  Option,
  Input,
  Checkbox,
} from '@island.is/island-ui/core'
import { SingleValue } from 'react-select'
import { useIntl } from 'react-intl'
import { m } from '../../../../../lib/messages'
import { inputTypesSelectObject } from '../../../../../lib/utils/inputTypes'

export const BaseInput = () => {
  const {
    control,
    controlDispatch,
    setFocus,
    focus,
    inputTypes,
    updateActiveItem,
  } = useContext(ControlContext)
  const { activeItem } = control
  const currentItem = activeItem.data as FormSystemInput

  const selectList = inputTypesSelectObject()
  const defaultValue = selectList.find((i) => i.value === currentItem?.type)
  const { formatMessage } = useIntl()

  return (
    <Stack space={2}>
      <Row>
        <Column span="5/10">
          <Select
            label={formatMessage(m.type)}
            name="inputTypeSelect"
            options={selectList}
            placeholder={formatMessage(m.chooseType)}
            backgroundColor="blue"
            isSearchable
            value={defaultValue}
            onChange={(e: SingleValue<Option<string>>) =>
              controlDispatch({
                type: 'CHANGE_INPUT_TYPE',
                payload: {
                  newValue: e?.value ?? '',
                  inputSettings:
                    inputTypes?.find((i) => i?.type === e?.value)
                      ?.inputSettings ?? {},
                  update: updateActiveItem,
                },
              })
            }
          />
        </Column>
      </Row>
      <Row>
        {/* Name  */}
        <Column span="10/10">
          <Input
            label={formatMessage(m.name)}
            name="name"
            value={currentItem?.name?.is ?? ''}
            backgroundColor="blue"
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_NAME',
                payload: {
                  lang: 'is',
                  newValue: e.target.value,
                },
              })
            }
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && updateActiveItem()}
          />
        </Column>
      </Row>
      <Row>
        {/* Name en */}
        <Column span="10/10">
          <Input
            label={formatMessage(m.nameEnglish)}
            name="nameEn"
            value={currentItem?.name?.en ?? ''}
            backgroundColor="blue"
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_NAME',
                payload: {
                  lang: 'en',
                  newValue: e.target.value,
                },
              })
            }
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && updateActiveItem()}
          />
        </Column>
      </Row>
      {/* Description  */}
      {['Message'].includes(currentItem?.type ?? '') && (
        <>
          <Row>
            <Column span="10/10">
              <Input
                label={formatMessage(m.description)}
                name="description"
                value={currentItem?.description?.is ?? ''}
                textarea
                backgroundColor="blue"
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
                onChange={(e) =>
                  controlDispatch({
                    type: 'CHANGE_DESCRIPTION',
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
                label={formatMessage(m.descriptionEnglish)}
                name="description"
                value={currentItem?.description?.en ?? ''}
                textarea
                backgroundColor="blue"
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
                onChange={(e) =>
                  controlDispatch({
                    type: 'CHANGE_DESCRIPTION',
                    payload: {
                      lang: 'en',
                      newValue: e.target.value,
                    },
                  })
                }
              />
            </Column>
          </Row>
        </>
      )}
      <Row>
        {/* Required checkbox */}
        <Column span="5/10">
          <Checkbox
            label={formatMessage(m.required)}
            checked={currentItem.isRequired ?? false}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_IS_REQUIRED',
                payload: {
                  update: updateActiveItem,
                },
              })
            }
          />
        </Column>
      </Row>
    </Stack>
  )
}
