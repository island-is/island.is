import { Box } from '@island.is/island-ui/core'
import { MainContent } from '../../MainContent/MainContent'

export const MainContentColumn = () => {
  return (
    <Box
      border="standard"
      borderRadius="standard"
      width="full"
      style={{
        minHeight: '500px',
        overflow: 'auto',
        maxHeight: '70vh',
        maxWidth: '1200px',
        width: '64%',
      }}
      position="fixed"
    >
      <MainContent />
    </Box>
  )
}
