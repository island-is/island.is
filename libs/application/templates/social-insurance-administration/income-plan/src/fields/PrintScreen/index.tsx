import { Box, Button } from '@island.is/island-ui/core'

export const PrintScreen = () => {
  return (
    <Box display="flex" justifyContent="flexEnd">
      <Button
        variant="utility"
        icon="print"
        onClick={(e) => {
          e.preventDefault()
          window.print()
        }}
      />
    </Box>
  )
}

export default PrintScreen
