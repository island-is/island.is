import { Box } from '@island.is/island-ui/core'
import { SLICE_SPACING } from '@island.is/web/constants'

export const BorderAbove = () => {
  return (
    <Box
      borderTopWidth="standard"
      borderColor="standard"
      paddingBottom={SLICE_SPACING}
    />
  )
}
