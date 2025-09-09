import { ActionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { EmptyState } from '@island.is/portals/my-pages/core'
import { useGetListsForUser, useGetSignedList } from '../../../hooks'
import { Skeleton } from '../../../lib/skeletons'
import { sortAlpha } from '@island.is/shared/utils'
import { m } from '../../../lib/messages'
import SignedList from '../SignedList'
import {
  SignatureCollection,
  SignatureCollectionCollectionType,
} from '@island.is/api/schema'
import format from 'date-fns/format'

const SigneeView = ({
  currentCollection,
  collectionType,
}: {
  currentCollection: SignatureCollection
  collectionType: SignatureCollectionCollectionType
}) => {
  const { formatMessage } = useLocale()
  const { signedLists, loadingSignedLists } = useGetSignedList(collectionType)
  const { listsForUser, loadingUserLists, getListsForUserError } =
    useGetListsForUser(collectionType, currentCollection?.id)

  if (getListsForUserError) {
    return (
      <EmptyState
        title={m.noUserFound}
        description={m.noUserFoundDescription}
      />
    )
  }

  return (
    <Box>
      {!loadingSignedLists && !loadingUserLists ? (
        <Box>
          {listsForUser?.length === 0 && signedLists?.length === 0 && (
            <Box marginTop={10}>
              <EmptyState
                title={m.noCollectionIsActive}
                description={m.noCollectionIsActiveDescription}
              />
            </Box>
          )}

          <Box marginTop={[0, 5]}>
            {/* Signed list */}
            <SignedList collectionType={collectionType} />

            {/* Other available lists */}
            <Box marginTop={[5, 10]}>
              {listsForUser?.length > 0 && (
                <Text marginBottom={2} variant="h4">
                  {formatMessage(m.mySigneeListsByAreaHeader)}
                </Text>
              )}

              <Stack space={3}>
                {listsForUser?.length > 0 &&
                  [...listsForUser]?.sort(sortAlpha('title')).map((list) => {
                    return (
                      <ActionCard
                        key={list.id}
                        backgroundColor="white"
                        eyebrow={list.area?.name}
                        heading={list.title.split(' - ')[0]}
                        text={
                          currentCollection?.collectionType ===
                          SignatureCollectionCollectionType.Presidential
                            ? formatMessage(m.collectionTitle)
                            : currentCollection?.collectionType ===
                              SignatureCollectionCollectionType.Parliamentary
                            ? formatMessage(m.collectionTitleParliamentary)
                            : `${formatMessage(
                                m.collectionMunicipalListOwner,
                              )}: ${list.candidate?.ownerName ?? ''} (${format(
                                new Date(list.candidate?.ownerBirthDate),
                                'dd.MM.yyyy',
                              )})`
                        }
                        cta={
                          new Date(list.endTime) > new Date() &&
                          !list.maxReached
                            ? {
                                label: formatMessage(m.signList),
                                variant: 'text',
                                icon: 'arrowForward',
                                disabled: !!signedLists.length,
                                onClick: () => {
                                  window.open(
                                    `${document.location.origin}${list.slug}`,
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
                            : list.maxReached
                            ? {
                                label: formatMessage(m.collectionMaxReached),
                                variant: 'red',
                                outlined: true,
                              }
                            : undefined
                        }
                      />
                    )
                  })}
              </Stack>
            </Box>
          </Box>
        </Box>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default SigneeView
