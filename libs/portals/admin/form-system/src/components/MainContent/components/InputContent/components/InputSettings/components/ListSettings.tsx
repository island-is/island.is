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
import { FormSystemInput } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../../../../../lib/messages'

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
  const currentItem = activeItem.data as FormSystemInput
  const [radio, setRadio] = useState([true, false, false])

  const radioHandler = (index: number) => {
    setRadio((prev) =>
      prev.map((_, i) => {
        return index === i
      }),
    )
  }

  const { formatMessage } = useIntl()

  const getListType = (index: number) => {
    switch (index) {
      case 0:
        return 'sveitarfelog'
      case 1:
        return 'lond'
      case 2:
        return 'postnumer'
      case 3:
        return 'idngreinarMeistara'
      case 4:
        return 'skraningarflokkar'
      default:
        return 'customList'
    }
  }

  return (
    <Stack space={2}>
      {currentItem.type === 'Dropdown_list' && (
        <>
          <Row>
            <Column>
              <Box
                onClick={() => {
                  controlDispatch({
                    type: 'SET_LIST_TYPE',
                    payload: {
                      listType: 'customList',
                      update: updateActiveItem,
                    },
                  })
                  radioHandler(0)
                }}
              >
                <RadioButton
                  label={formatMessage(m.customList)}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onChange={() => { }}
                  checked={radio[0]}
                />
              </Box>
            </Column>
          </Row>
          <Row>
            <Column>
              <RadioButton
                label={formatMessage(m.predeterminedLists)}
                onChange={(e) => {
                  console.log()
                }}
                checked={radio[1]}
              />
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
