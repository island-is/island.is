import {
  Stack,
  Text,
  GridRow as Row,
  GridColumn as Column,
  Select,
  Input,
  Box,
} from '@island.is/island-ui/core'
import { IInput } from '../../../../../types/interfaces'
import { useState } from 'react'


interface Props {
  title: string
  options: {
    label: string
    value: string
  }[]
  input: IInput
}
export default function SingleParty({ title, options, input }: Props) {
  // const { formDispatch } = useContext(FormBuilderContext)
  // const { applicantTypes } = formBuilder
  const [_focus, setFocus] = useState('')
  return (
    <Box marginTop={1} marginBottom={1}>
      <Stack space={2}>
        <Box marginBottom={1}>
          <Text variant="h4">{title}</Text>
        </Box>
        <Row>
          <Column span="5/10">
            <Select
              label="Tillögur"
              name="select1"
              backgroundColor="blue"
              options={options}
              placeholder={options[0].label}
            // onChange={(e: { label: string; value: string }) => {
            //   formDispatch({
            //     type: 'nameSuggestionChosen',
            //     payload: {},
            //   })
            // }}
            />
          </Column>
        </Row>
        <Row>
          <Column span="5/10">
            <Input
              label="Heiti"
              name="einstaklingur"
              backgroundColor="blue"
              placeholder={options[0].label}
              value={input.name.is}
              onFocus={(e) => setFocus(e.target.value)}
            // onChange={(e) => {
            //   listsDispatch({
            //     type: 'changeName',
            //     payload: {
            //       guid: input.guid,
            //       lang: 'is',
            //       newName: e.target.value
            //     }
            //   })
            // }}
            />
          </Column>
          <Column span="5/10">
            <Input
              label="Heiti (enska)"
              name="einstaklingurEn"
              backgroundColor="blue"
              placeholder={options[0].value}
              value={input.name.en}
              onFocus={(e) => setFocus(e.target.value)}
            />
          </Column>
        </Row>
      </Stack>
    </Box>
  )
}
