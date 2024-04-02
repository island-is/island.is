import {
  GridRow as Row,
  GridColumn as Column,
  Stack,
  Input,
  Box,
} from '@island.is/island-ui/core'
import { useState } from 'react'

export default function PropertyNumberInput() {
  const [propertyNumber, setPropertyNumber] = useState('')
  return (
    <Box marginTop={2} padding={1}>
      <Stack space={2}>
        <Row>
          <Column span="5/10">
            <Input
              name="propertyNumber"
              label="Fasteignanúmer"
              placeholder="Sláðu inn fasteignanúmer"
              value={propertyNumber}
              onChange={(e) => setPropertyNumber(e.target.value)}
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
