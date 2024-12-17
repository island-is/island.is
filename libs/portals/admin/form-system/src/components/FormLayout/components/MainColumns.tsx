import { Box } from '@island.is/island-ui/core'
import { MainContent } from '../../MainContent/MainContent'

export const MainContentColumn = () => {
  return (
    <Box
      border="standard"
      borderRadius="standard"
      width="full"
      marginTop={5}
      style={{ minHeight: '500px' }}
    >
      <MainContent />
    </Box>
  )
}
