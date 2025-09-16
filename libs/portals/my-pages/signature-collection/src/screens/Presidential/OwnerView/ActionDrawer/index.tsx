import { Box, Button, Drawer, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import CancelCandidacy from '../CancelCandidacy'

const ActionDrawer = () => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={5}>
      <Drawer
        ariaLabel="listActions"
        baseId="listActions"
        disclosure={
          <Button variant="utility" icon="settings" iconType="outline">
            {formatMessage(m.listActions)}
          </Button>
        }
      >
        <Text variant="h2" marginY={5}>
          {formatMessage(m.listActions)}
        </Text>
        {
          //Todo: we can add reports section to here once we have the info
        }
        <CancelCandidacy />
      </Drawer>
    </Box>
  )
}

export default ActionDrawer
