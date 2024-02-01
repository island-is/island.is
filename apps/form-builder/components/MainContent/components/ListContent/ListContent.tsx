import {
  GridColumn as Column,
  GridRow as Row,
  Select,
  Stack,
  Box,
  Button,
  RadioButton,
} from '@island.is/island-ui/core'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import FormBuilderContext from '../../../../context/FormBuilderContext'
import { getList } from '../../../../services/apiService'
import { IInput } from '../../../../types/interfaces'

type Props = {
  setInListBuilder: Dispatch<SetStateAction<boolean>>
}

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

export default function ListContent({ setInListBuilder }: Props) {
  const [radio, setRadio] = useState([true, false, false])
  const { lists, listsDispatch } = useContext(FormBuilderContext)
  const { activeItem } = lists
  return (
    <Stack space={2}>
      <Row>
        <Column>
          <Box onClick={() => radioHandler(0)}>
            <RadioButton label="Nýr fellilisti" checked={radio[0]} />
          </Box>
        </Column>
      </Row>
      <Row>
        <Column>
          <Box onClick={() => radioHandler(1)}>
            <RadioButton label="Tilbúnir fellilistar" checked={radio[1]} />
          </Box>
        </Column>
      </Row>
      {radio[0] && (
        <Button variant="ghost" onClick={() => setInListBuilder(true)}>
          Listasmiður
        </Button>
      )}
      {radio[1] && (
        <Column span="5/10">
          <Select
            placeholder="Veldu lista tegund"
            name="predeterminedLists"
            label="Tilbúnir fellilistar"
            options={predeterminedLists}
            backgroundColor="blue"
            onChange={async (e: { label: string; value: string }) => {
              const newList = await getList(e.value)
              console.log(newList)
              listsDispatch({
                type: 'setInputSettings',
                payload: {
                  inputSettings: {
                    ...(activeItem.data as IInput).inputSettings,
                    listi: newList.listi,
                  },
                },
              })
            }}
          />
        </Column>
      )}
    </Stack>
  )

  function radioHandler(index: number) {
    if (!radio[index])
      setRadio((prev) =>
        prev.map((_, i) => {
          return index === i
        }),
      )
  }
}
