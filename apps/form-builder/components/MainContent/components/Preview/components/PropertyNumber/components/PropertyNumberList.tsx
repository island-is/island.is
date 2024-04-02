import {
  GridRow as Row,
  GridColumn as Column,
  Stack,
  Select,
  Input,
  Box,
} from '@island.is/island-ui/core'

const dummyList = [
  {
    label: 'Fasteign 1',
    value: '1',
  },
  {
    label: 'Fasteign 2',
    value: '2',
  },
  {
    label: 'Fasteign 3',
    value: '3',
  },
]

export default function PropertyNumberList() {
  return (
    <Box marginTop={2} padding={1}>
      <Stack space={2}>
        <Row>
          <Column span="5/10">
            <Select
              label="Veldu fasteign"
              options={dummyList}
              placeholder="Veldu fasteign"
            />
          </Column>
        </Row>
        <Row>
          <Column span="5/10">
            <Input
              name="address"
              label="Heimilisfang"
              disabled
              backgroundColor="blue"
            />
          </Column>
          <Column span="5/10">
            <Input name="town" label="Staður" disabled backgroundColor="blue" />
          </Column>
        </Row>
      </Stack>
    </Box>
  )
}
