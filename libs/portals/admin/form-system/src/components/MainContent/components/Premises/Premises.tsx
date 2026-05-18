import { Box, Text } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../context/ControlContext'

export const Premises = () => {
  const { control, controlDispatch } = useContext(ControlContext)
  return (
    <div>
      <Box padding={2} marginBottom={2}>
        <Text variant="h4"></Text>
      </Box>
    </div>
  )
}
