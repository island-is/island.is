import { Button, Drawer, Stack, Text } from '@island.is/island-ui/core'
import { useLoaderData } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'
import ActionExtendDeadline from '../extendDeadline'
import ActionLockList from '../lockList'
import CompleteListReview from '../completeListReview'
import DownloadReports from '../downloadReports'
import RemoveList from '../removeList'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import CreateCollection from '../createCollection'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import ReviewCandidates from '../reviewCandidates'
import CompleteCollectionProcessing from '../completeCollectionProcessing'

export enum Actions {
  DownloadReports = 'downloadReports',
  CreateCollection = 'createCollection',
  LockList = 'lockList',
  ReviewComplete = 'reviewComplete',
  ExtendDeadline = 'extendDeadline',
  RemoveList = 'removeList',
  ReviewCandidates = 'reviewCandidates',
  CompleteCollectionProcessing = 'completeCollectionProcessing',
}

interface ListActionsProps {
  allowedActions?: Actions[]
}

const ListActions = ({ allowedActions }: ListActionsProps = {}) => {
  const { formatMessage } = useLocale()
  const { collection } = useLoaderData() as ListsLoaderReturn
  const { list, listStatus } = useLoaderData() as {
    list: SignatureCollectionList
    listStatus: string
  }

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
            isLocked={!list.active}
            listId={list.id}
            collectionType={list.collectionType}
          />
        )}
        {allowedActions?.includes(Actions.ReviewComplete) && (
          <CompleteListReview
            listId={list?.id}
            listStatus={listStatus}
            collectionType={list.collectionType}
          />
        )}
        {allowedActions?.includes(Actions.ExtendDeadline) && (
          <ActionExtendDeadline list={list} />
        )}
        {allowedActions?.includes(Actions.RemoveList) && (
          <RemoveList list={list} />
        )}
        {allowedActions?.includes(Actions.ReviewCandidates) && (
          <ReviewCandidates
            candidates={collection.candidates}
            collectionType={collection.collectionType}
          />
        )}
        {allowedActions?.includes(Actions.CompleteCollectionProcessing) && (
          <CompleteCollectionProcessing collection={collection} />
        )}
      </Stack>
    </Drawer>
  )
}

export default ListActions
