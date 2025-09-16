import { ActionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocation, useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../../lib/paths'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import AddConstituency from './AddConstituency'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionList,
} from '@island.is/api/schema'
import { useGetListsForOwner, useGetSignedList } from '../../../hooks'
import { SignatureCollection } from '@island.is/api/schema'
import SignedLists from '../../shared/SignedLists'
import Managers from '../../shared/Managers'
import { Skeleton } from '../../../lib/skeletons'
import format from 'date-fns/format'

const collectionType = SignatureCollectionCollectionType.Parliamentary

const OwnerView = ({
  currentCollection,
  // list holder is an individual who owns a list or has a delegation of type Procuration Holder
  isListHolder,
}: {
  currentCollection: SignatureCollection
  isListHolder: boolean
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const { formatMessage } = useLocale()
  const { listsForOwner, loadingOwnerLists, refetchListsForOwner } =
    useGetListsForOwner(collectionType, currentCollection?.id || '')
  const { signedLists, loadingSignedLists } = useGetSignedList(collectionType)

  return (
    <Box>
      {!loadingOwnerLists && !loadingSignedLists && !!currentCollection ? (
        <Stack space={8}>
          <SignedLists signedLists={signedLists ?? []} />
          <Box>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="baseline"
            >
              <Text variant="h4">{formatMessage(m.myListsDescription)}</Text>
              {isListHolder &&
                !loadingOwnerLists &&
                listsForOwner?.length < currentCollection?.areas.length && (
                  <AddConstituency
                    lists={listsForOwner}
                    collection={currentCollection}
                    candidateId={listsForOwner[0]?.candidate?.id}
                    refetch={refetchListsForOwner}
                  />
                )}
            </Box>
            {listsForOwner.map((list: SignatureCollectionList) => (
              <Box key={list.id} marginTop={3}>
                <ActionCard
                  backgroundColor="white"
                  heading={list.area?.name}
                  progressMeter={{
                    currentProgress: list.numberOfSignatures || 0,
                    maxProgress: list.area?.min || 0,
                    withLabel: true,
                  }}
                  eyebrow={`${formatMessage(m.endTime)} ${format(
                    new Date(list.endTime),
                    'dd.MM.yyyy',
                  )}`}
                  cta={
                    list.active
                      ? {
                          label: formatMessage(m.viewList),
                          variant: 'text',
                          icon: 'arrowForward',
                          onClick: () => {
                            const path = location.pathname.includes(
                              'fyrirtaeki',
                            )
                              ? SignatureCollectionPaths.CompanyViewParliamentaryList
                              : SignatureCollectionPaths.ViewParliamentaryList
                            navigate(path.replace(':id', list.id), {
                              state: {
                                collectionId: currentCollection?.id || '',
                              },
                            })
                          },
                        }
                      : undefined
                  }
                  tag={
                    !list.active
                      ? {
                          label: formatMessage(m.collectionClosed),
                          variant: 'red',
                          outlined: true,
                        }
                      : undefined
                  }
                />
              </Box>
            ))}
          </Box>
          <Managers collectionType={collectionType} />
        </Stack>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default OwnerView
