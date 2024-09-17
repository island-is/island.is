import {
  ActionCard,
  Box,
  Stack,
  Text,
  Table as T,
  Tooltip,
} from '@island.is/island-ui/core'
import { useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../../lib/paths'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import AddConstituency from './modals/AddConstituency'
import { SignatureCollectionList } from '@island.is/api/schema'
import { OwnerParliamentarySkeleton } from '../../../skeletons'
import { useGetListsForOwner } from '../../../hooks'
import { SignatureCollection } from '@island.is/api/schema'

const OwnerView = ({
  currentCollection,
}: {
  currentCollection: SignatureCollection
}) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const { listsForOwner, loadingOwnerLists } = useGetListsForOwner(
    currentCollection?.id || '',
  )

  return (
    <Stack space={8}>
      <Box marginTop={5}>
        <Box display="flex" justifyContent="spaceBetween" alignItems="baseline">
          <Text variant="h4">
            {formatMessage(m.myListsDescription) + ' '}
            <Tooltip
              placement="right"
              text={formatMessage(m.myListsInfo)}
              color="blue400"
            />
          </Text>
          {/* If the number of lists is equal to 6, it means that
          lists have been created in all of the constituencies */}
          {listsForOwner.length < 6 && (
            <AddConstituency lists={listsForOwner} />
          )}
        </Box>
        {loadingOwnerLists ? (
          <Box marginTop={2}>
            <OwnerParliamentarySkeleton />
          </Box>
        ) : (
          listsForOwner.map((list: SignatureCollectionList) => (
            <Box key={list.id} marginTop={3}>
              <ActionCard
                backgroundColor="white"
                heading={list.title}
                progressMeter={{
                  currentProgress: list.numberOfSignatures || 0,
                  maxProgress: list.area?.min || 0,
                  withLabel: true,
                }}
                cta={{
                  label: formatMessage(m.viewList),
                  variant: 'text',
                  icon: 'arrowForward',
                  onClick: () => {
                    navigate(
                      SignatureCollectionPaths.ViewParliamentaryList.replace(
                        ':id',
                        list.id,
                      ),
                      {
                        state: {
                          collectionId: currentCollection?.id || '',
                        },
                      },
                    )
                  },
                }}
              />
            </Box>
          ))
        )}
      </Box>
      <Box>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="baseline"
          marginBottom={3}
        >
          <Text variant="h4">
            {formatMessage(m.supervisors) + ' '}
            <Tooltip placement="right" text="info" color="blue400" />
          </Text>
        </Box>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{formatMessage(m.personName)}</T.HeadData>
              <T.HeadData>{formatMessage(m.personNationalId)}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            <T.Row>
              <T.Data width={'40%'}>{'Nafni Nafnason'}</T.Data>
              <T.Data>{'010130-3019'}</T.Data>
            </T.Row>
          </T.Body>
        </T.Table>
      </Box>
    </Stack>
  )
}

export default OwnerView
