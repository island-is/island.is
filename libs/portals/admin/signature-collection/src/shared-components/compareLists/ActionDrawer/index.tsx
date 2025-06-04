import { Box } from '@island.is/island-ui/core'
import ListActions from './ListActions'
import { Actions } from './ListActions'

interface ActionDrawerProps {
  allowedActions?: Actions[];
}

const ActionDrawer = ({ allowedActions }: ActionDrawerProps = {}) => {
  return (
    <Box marginTop={3} display="flex" columnGap={2}>
      <ListActions allowedActions={allowedActions} />
      {/*<ListManagers />*/}
    </Box>
  )
}

export default ActionDrawer
