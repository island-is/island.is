import {
  SignatureCollection,
  SignatureCollectionCollectionType,
} from '@island.is/api/schema'
import { ActionCard, Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import format from 'date-fns/format'
import { useNavigate } from 'react-router-dom'
import { useGetListsForOwner, useGetSignedList } from '../../../hooks'
import { m } from '../../../lib/messages'
import { SignatureCollectionPaths } from '../../../lib/paths'
import { Skeleton } from '../../../lib/skeletons'
import SignedLists from '../../shared/SignedLists'
import CancelCollection from './CancelCollection'
import Managers from '../../shared/Managers'

const collectionType = SignatureCollectionCollectionType.Presidential

const OwnerView = ({
  refetchIsOwner,
  currentCollection,
}: {
  refetchIsOwner: () => void
  currentCollection: SignatureCollection
}) => {
  useNamespaces('sp.signatureCollection')
  const navigate = useNavigate()
  const user = useUserInfo()
  const { formatMessage } = useLocale()
  const { listsForOwner, loadingOwnerLists } = useGetListsForOwner(
    collectionType,
    currentCollection?.id || '',
  )
  const { signedLists, loadingSignedLists } = useGetSignedList(collectionType)

  return (
    <Box>
      {!loadingOwnerLists && !loadingSignedLists && !!currentCollection ? (
        <Stack space={6}>
          {listsForOwner?.length === 0 && currentCollection.isActive && (
            <Button
              icon="open"
              iconType="outline"
              onClick={() =>
                window.open(
                  `${document.location.origin}/umsoknir/medmaelasofnun/`,
                )
              }
              size="small"
            >
              {formatMessage(m.createListButton)}
            </Button>
          )}
          <Box marginTop={[0, 5]}>
            {/* Signed list */}
            {!user?.profile.actor && <SignedLists signedLists={signedLists} />}

            {/* Candidate created lists */}
            <Text variant="h4" marginTop={[5, 7]} marginBottom={2}>
              {formatMessage(m.myListsDescription)}
            </Text>
            <Stack space={[3, 5]}>
              {listsForOwner.map((list) => {
                return (
                  <ActionCard
                    key={list.id}
                    backgroundColor="white"
                    heading={list.title}
                    eyebrow={`${formatMessage(m.endTime)} ${format(
                      new Date(list.endTime),
                      'dd.MM.yyyy',
                    )}`}
                    text={formatMessage(m.collectionTitle)}
                    cta={
                      new Date(list.endTime) > new Date() && list.active
                        ? {
                            label: formatMessage(m.viewList),
                            variant: 'text',
                            icon: 'arrowForward',
                            onClick: () => {
                              navigate(
                                SignatureCollectionPaths.ViewList.replace(
                                  ':id',
                                  list.id,
                                ),
                              )
                            },
                          }
                        : undefined
                    }
                    tag={
                      new Date(list.endTime) < new Date()
                        ? {
                            label: formatMessage(m.collectionClosed),
                            variant: 'red',
                            outlined: true,
                          }
                        : list.active
                        ? {
                            label: formatMessage(m.collectionActive),
                            variant: 'blue',
                            outlined: false,
                          }
                        : !list.active && !list.reviewed
                        ? {
                            label: formatMessage(m.collectionLocked),
                            variant: 'purple',
                            outlined: false,
                          }
                        : undefined
                    }
                    progressMeter={{
                      currentProgress: Number(list.numberOfSignatures),
                      maxProgress: list.area.min,
                      withLabel: true,
                    }}
                  />
                )
              })}
            </Stack>
          </Box>
          {listsForOwner?.length > 0 &&
            !user?.profile.actor &&
            currentCollection.isActive && (
              <CancelCollection refetchIsOwner={refetchIsOwner} />
            )}

          <Managers collectionType={collectionType} />
        </Stack>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default OwnerView
