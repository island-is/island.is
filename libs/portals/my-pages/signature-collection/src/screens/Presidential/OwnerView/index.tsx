import {
  SignatureCollection,
  SignatureCollectionCollectionType,
} from '@island.is/api/schema'
import { ActionCard, Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import format from 'date-fns/format'
import { useNavigate } from 'react-router-dom'
import { useGetListsForOwner } from '../../../hooks'
import { m } from '../../../lib/messages'
import { SignatureCollectionPaths } from '../../../lib/paths'
import { Skeleton } from '../../../lib/skeletons'
import SignedList from '../../shared/SignedList'
import CancelCollection from './CancelCollection'
import ShareLink from '../../shared/ShareLink'

const collectionType = SignatureCollectionCollectionType.Presidential

const OwnerView = ({
  currentCollection,
}: {
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

  return (
    <Box>
      {!loadingOwnerLists && !!currentCollection ? (
        <Box>
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
            <Text variant="h3" marginBottom={2}>
              {formatMessage(m.collectionTitle)}
            </Text>
            <ShareLink slug={listsForOwner?.[0]?.slug} />

            {/* Signed list */}
            {!user?.profile.actor && (
              <SignedList
                currentCollection={currentCollection}
                collectionType={collectionType}
              />
            )}

            {/* Candidate created lists */}
            <Text marginTop={[5, 7]} marginBottom={2}>
              {formatMessage(m.myListsDescription)}
            </Text>
            <Stack space={[3, 5]}>
              {listsForOwner.map((list) => {
                return (
                  <ActionCard
                    key={list.id}
                    backgroundColor="white"
                    heading={list.title}
                    eyebrow={
                      formatMessage(m.endTime) +
                      ' ' +
                      format(new Date(list.endTime), 'dd.MM.yyyy')
                    }
                    text={formatMessage(m.collectionTitle)}
                    cta={
                      new Date(list.endTime) > new Date()
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
            currentCollection.isActive && <CancelCollection />}
        </Box>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default OwnerView
