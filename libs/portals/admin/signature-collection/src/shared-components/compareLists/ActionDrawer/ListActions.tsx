import { Button, Drawer, Stack, Text } from '@island.is/island-ui/core'
import { useLoaderData } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'
import ActionExtendDeadline from '../../../shared-components/extendDeadline'
import ActionLockList from '../../../shared-components/lockList'
import ActionReviewComplete from '../../../shared-components/completeListReview'
import DownloadReports from '../../../shared-components/downloadReports'
import RemoveCandidate from '../../../shared-components/removeCandidate'
import { m } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'

const ListActions = () => {
  const { list, listStatus } = useLoaderData() as {
    list: SignatureCollectionList
    listStatus: string
  }
  const { formatMessage } = useLocale()

  return (
    <Drawer
      ariaLabel="actionsDrawer"
      baseId="actionsDrawer"
      disclosure={
        <Button variant="utility" icon="settings" iconType="outline">
          {formatMessage(m.listActionsTitle)}
        </Button>
      }
    >
      <Text variant="h2" marginTop={2} marginBottom={6}>
        {formatMessage(m.listActionsTitle)}
      </Text>

      <Stack space={8}>
        <DownloadReports areas={[]} collectionId={''} />
        <ActionLockList listId={list?.id} />
        <ActionReviewComplete listId={list?.id} listStatus={listStatus} />
        <ActionExtendDeadline listId={list?.id} endTime={list?.endTime} />
        <RemoveCandidate />
      </Stack>
    </Drawer>
  )
}

export default ListActions
