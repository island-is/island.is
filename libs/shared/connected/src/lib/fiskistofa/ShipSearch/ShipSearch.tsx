import { useState } from 'react'
import { Box, Button, Input } from '@island.is/island-ui/core'

export const ShipSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <Box>
      <Input
        name="Skipaskrárnúmer eða nafn skips"
        value={searchTerm}
        onChange={(ev) => setSearchTerm(ev.target.value)}
      />
      <Button>Leita</Button>
    </Box>
  )
}
