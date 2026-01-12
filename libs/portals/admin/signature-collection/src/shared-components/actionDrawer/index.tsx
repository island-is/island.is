import { Box } from '@island.is/island-ui/core'
import ListActions, { Actions } from './ListActions'
import ListManagers from './ListManagers'

interface ActionDrawerProps {
  allowedActions?: Actions[]
  withManagers?: boolean
}

const ActionDrawer = ({
  allowedActions,
  withManagers,
}: ActionDrawerProps = {}) => {
  return (
    <Box marginTop={3} display="flex" columnGap={2}>
      <ListActions allowedActions={allowedActions} />
      {withManagers && <ListManagers />}
    </Box>
  )
}

export default ActionDrawer
