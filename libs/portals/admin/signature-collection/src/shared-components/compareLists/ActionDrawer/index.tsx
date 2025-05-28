import { Box } from '@island.is/island-ui/core'
import ListActions from './ListActions'
import ListManagers from './ListManagers'

const ActionDrawer = () => {
  return (
    <Box marginTop={3} display="flex">
      <ListActions />
      <ListManagers />
    </Box>
  )
}

export default ActionDrawer
