import { useContext } from 'react'
import ControlContext from '../../../../../context/ControlContext'
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

const BaseInput = () => {
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

  const sortedInputTypes = inputTypes
    ?.map((i) => ({
      label: i?.type ?? '',
      value: i?.type ?? '',
    }))
    .sort((a, b) => (a?.label ?? '').localeCompare(b?.label ?? ''))

  const defaultOption =
    currentItem.type === ''
      ? null
      : sortedInputTypes?.find((o) => o.value === currentItem.type)

  return (
    <Stack space={2}>
      <Row>
        <Column span="5/10">
          <Select
            label="Tegund"
            name="inputTypeSelect"
            options={sortedInputTypes}
            placeholder="Veldu tegund"
            backgroundColor="blue"
            isSearchable
            value={defaultOption}
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
            label="Heiti"
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
            label="Heiti (enska)"
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
      {['Textalýsing'].includes(currentItem?.type ?? '') && (
        <>
          <Row>
            <Column span="10/10">
              <Input
                label="Lýsing"
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
                label="Lýsing (enska)"
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
            label="Krafist"
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

export default BaseInput
