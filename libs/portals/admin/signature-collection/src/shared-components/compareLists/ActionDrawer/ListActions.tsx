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
import CreateCollection from '../../createCollection'
import { ListsLoaderReturn } from '../../../loaders/AllLists.loader'
import ReviewCandidates from '../../reviewCandidates'

export enum Actions {
  DownloadReports = 'downloadReports',
  CreateCollection = 'createCollection',
  LockList = 'lockList',
  ReviewComplete = 'reviewComplete',
  ExtendDeadline = 'extendDeadline',
  RemoveCandidate = 'removeCandidate',
  ReviewCandidates = 'reviewCandidates',
}

interface ListActionsProps {
  allowedActions?: Actions[]
}

const ListActions = ({ allowedActions }: ListActionsProps = {}) => {
  const { list, listStatus } = useLoaderData() as {
    list: SignatureCollectionList
    listStatus: string
  }
  const { collection } = useLoaderData() as ListsLoaderReturn
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
        {allowedActions?.includes(Actions.DownloadReports) && (
          <DownloadReports collection={collection} />
        )}
        {allowedActions?.includes(Actions.CreateCollection) && (
          <CreateCollection collection={collection} />
        )}
        {allowedActions?.includes(Actions.LockList) && (
          <ActionLockList
            listId={list.id}
            collectionType={list.collectionType}
          />
        )}
        {allowedActions?.includes(Actions.ReviewComplete) && (
          <ActionReviewComplete
            listId={list?.id}
            listStatus={listStatus}
            collectionType={list.collectionType}
          />
        )}
        {allowedActions?.includes(Actions.ExtendDeadline) && (
          <ActionExtendDeadline list={list} />
        )}
        {allowedActions?.includes(Actions.RemoveCandidate) && (
          <RemoveCandidate list={list} />
        )}
        {allowedActions?.includes(Actions.ReviewCandidates) && (
          <ReviewCandidates candidates={collection.candidates} />
        )}
      </Stack>
    </Drawer>
  )
}

export default ListActions
