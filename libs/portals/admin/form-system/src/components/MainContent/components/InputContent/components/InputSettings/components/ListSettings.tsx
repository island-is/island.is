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
    value: 'Sveitarfelog',
  },
  {
    label: 'Lönd',
    value: 'Lond',
  },
  {
    label: 'Póstnúmer',
    value: 'Postnumer',
  },
  {
    label: 'Iðngreinarmeistara',
    value: 'Idngreinarmeistara',
  },
]

export const ListSettings = () => {
  const { control, setInListBuilder } = useContext(ControlContext)
  const { activeItem } = control
  const currentItem = activeItem.data as FormSystemInput
  const [radio, setRadio] = useState([true, false, false])

  const radioHandler = (index: number) => {
    if (!radio[index])
      setRadio((prev) =>
        prev.map((_, i) => {
          return index === i
        }),
      )
  }

  const { formatMessage } = useIntl()

  return (
    <Stack space={2}>
      {currentItem.type === 'Dropdown_list' && (
        <>
          <Row>
            <Column>
              <Box onClick={() => radioHandler(0)}>
                <RadioButton
                  label={formatMessage(m.customList)}
                  checked={radio[0]}
                />
              </Box>
            </Column>
          </Row>
          <Row>
            <Column>
              <RadioButton
                label={formatMessage(m.predeterminedLists)}
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
          />
        </Column>
      )}
    </Stack>
  )
}
