import {
  Box,
  Input,
  Stack,
  GridColumn as Column,
} from '@island.is/island-ui/core'
import { FormSystemInput } from '@island.is/api/schema'

interface Props {
  currentItem: FormSystemInput
}

const NationalId = ({ currentItem }: Props) => {
  return (
    <Box>
      <Stack space={2}>
        <Column span="5/10">
          <Input
            label="Kennitala"
            name="kennitala"
            type="number"
            required={currentItem?.isRequired ?? false}
          />
        </Column>
        <Column>
          <Input label="Nafn" name="nafn" disabled />
        </Column>
      </Stack>
    </Box>
  )
}
export default NationalId
