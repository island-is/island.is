import {
  Box,
  Input,
  Stack,
  GridColumn as Column,
} from '@island.is/island-ui/core'

const NationalId = () => {
  return (
    <Box>
      <Stack space={2}>
        <Column span="5/10">
          <Input label="Kennitala" name="kennitala" type="number" />
        </Column>
        <Column>
          <Input label="Nafn" name="nafn" disabled />
        </Column>
      </Stack>
    </Box>
  )
}
export default NationalId
