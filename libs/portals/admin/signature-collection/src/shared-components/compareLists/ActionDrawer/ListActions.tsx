import { Button, Drawer, Stack, Text } from '@island.is/island-ui/core'
import { useLoaderData } from 'react-router-dom'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionList,
} from '@island.is/api/schema'
import ActionExtendDeadline from '../../../shared-components/extendDeadline'
import ActionLockList from '../../../shared-components/lockList'
import ActionReviewComplete from '../../../shared-components/completeListReview'
import DownloadReports from '../../../shared-components/downloadReports'
import RemoveCandidate from '../../../shared-components/removeCandidate'

const ListActions = () => {
  const { list, listStatus } = useLoaderData() as {
    list: SignatureCollectionList
    listStatus: string
  }

  return (
    <Drawer
      ariaLabel={''}
      baseId={''}
      disclosure={
        <Button variant="utility" icon="settings" iconType="outline">
          Aðgerðir
        </Button>
      }
    >
      <Text variant="h2" marginTop={2} marginBottom={8}>
        Aðgerðir
      </Text>

      <Stack space={8}>
        <DownloadReports areas={[]} collectionId={''} />
        <ActionLockList listId={list?.id} />
        <ActionReviewComplete
          listId={list?.id}
          listStatus={listStatus}
          collectionType={SignatureCollectionCollectionType.Parliamentary}
        />
        <ActionExtendDeadline listId={list?.id} endTime={list?.endTime} />
        <RemoveCandidate />
      </Stack>
    </Drawer>
  )
}

export default ListActions
