import { Box } from '@island.is/island-ui/core'
import ListActions from './ListActions'
import ListManagers from './ListManagers'

const ActionDrawer = () => {
  return (
    <Box marginTop={3} display="flex" columnGap={2}>
      <ListActions />
      <ListManagers />
    </Box>
  )
}

export default ActionDrawer
