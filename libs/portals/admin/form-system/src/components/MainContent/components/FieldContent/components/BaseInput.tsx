import { useContext } from 'react'
import { ControlContext } from '../../../../../context/ControlContext'
import { FormSystemField } from '@island.is/api/schema'
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
import { fieldTypesSelectObject } from '../../../../../lib/utils/fieldTypes'
import { m } from '@island.is/form-system/ui'

export const BaseInput = () => {
  const {
    control,
    controlDispatch,
    setFocus,
    focus,
    fieldTypes,
    updateActiveItem,
  } = useContext(ControlContext)
  const { activeItem } = control
  const currentItem = activeItem.data as FormSystemField
  const selectList = fieldTypesSelectObject()
  const defaultValue = fieldTypes?.find(
    (fieldType) => fieldType?.id === currentItem.fieldType,
  )
  const defaultOption: Option<string> | undefined = defaultValue
    ? { value: defaultValue.id ?? '', label: defaultValue.name?.is ?? '' }
    : undefined
  const { formatMessage } = useIntl()
  return (
    <Stack space={2}>
      <Row>
        <Column span="5/10">
          <Select
            label={formatMessage(m.type)}
            name="fieldTypeSelect"
            options={selectList}
            placeholder={formatMessage(m.chooseType)}
            backgroundColor="blue"
            isSearchable
            value={defaultOption}
            onChange={(e: SingleValue<Option<string>>) => {
              controlDispatch({
                type: 'CHANGE_FIELD_TYPE',
                payload: {
                  newValue: e?.value ?? '',
                  fieldSettings:
                    fieldTypes?.find((i) => i?.id === e?.value)
                      ?.fieldSettings ?? {},
                  update: updateActiveItem,
                },
              })
            }}
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
      {['Message'].includes(currentItem?.fieldType ?? '') && (
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
            onChange={() =>
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
