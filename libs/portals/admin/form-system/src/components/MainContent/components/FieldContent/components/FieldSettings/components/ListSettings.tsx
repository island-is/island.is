import { useContext, useState } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'
import {
  GridColumn as Column,
  GridRow as Row,
  Select,
  Stack,
  Box,
  Button,
  RadioButton,
} from '@island.is/island-ui/core'
import { FormSystemField } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { FieldTypesEnum } from '@island.is/form-system/enums'

const predeterminedLists = [
  {
    label: 'Sveitarfélög',
    value: 0,
  },
  {
    label: 'Lönd',
    value: 1,
  },
  {
    label: 'Póstnúmer',
    value: 2,
  },
  {
    label: 'Iðngreinarmeistara',
    value: 3,
  },
  {
    label: 'Skráningarflokkar',
    value: 4,
  },
]

export const ListSettings = () => {
  const { control, setInListBuilder, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const { activeItem } = control
  const currentItem = activeItem.data as FormSystemField
  const [radio, setRadio] = useState([true, false, false])

  const radioHandler = (index: number) => {
    setRadio((prev) =>
      prev.map((_, i) => {
        return index === i
      }),
    )
  }

  const { formatMessage } = useIntl()
  const listTypes = [
    'sveitarfelog',
    'lond',
    'postnumer',
    'idngreinarMeistara',
    'skraningarflokkar',
  ]
  const getListType = (index: number) => listTypes[index] || 'customList'

  const onClickRadioHandler = (index: number) => {
    radioHandler(index)
    controlDispatch({
      type: 'SET_LIST_TYPE',
      payload: {
        listType: index === 0 ? 'customList' : 'other',
        update: updateActiveItem,
      },
    })
  }

  return (
    <Stack space={2}>
      {currentItem.fieldType === FieldTypesEnum.DROPDOWN_LIST && (
        <>
          <Row>
            <Column>
              <Box onClick={() => onClickRadioHandler(0)}>
                <RadioButton
                  label={formatMessage(m.customList)}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onChange={() => {}}
                  checked={radio[0]}
                />
              </Box>
            </Column>
          </Row>
          <Row>
            <Column>
              <Box onClick={() => onClickRadioHandler(1)}>
                <RadioButton
                  label={formatMessage(m.predeterminedLists)}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onChange={() => {}}
                  checked={radio[1]}
                />
              </Box>
            </Column>
          </Row>
        </>
      )}
      {radio[0] && (
        <Button variant="ghost" onClick={() => setInListBuilder(true)}>
          {formatMessage(m.listBuilder)}
        </Button>
      )}
      {radio[1] && (
        <Column span="5/10">
          <Select
            placeholder={formatMessage(m.chooseListType)}
            name="predeterminedLists"
            label={formatMessage(m.predeterminedLists)}
            options={predeterminedLists}
            backgroundColor="blue"
            onChange={(option) => {
              const listType = getListType(option?.value as number)
              controlDispatch({
                type: 'SET_LIST_TYPE',
                payload: {
                  listType: listType,
                  update: updateActiveItem,
                },
              })
            }}
          />
        </Column>
      )}
    </Stack>
  )
}
