import { ActionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { EmptyState } from '@island.is/portals/my-pages/core'
import { sortAlpha } from '@island.is/shared/utils'
import { m } from '../../../lib/messages'
import SignedLists from '../SignedLists'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionList,
  SignatureCollectionSignedList,
} from '@island.is/api/schema'
import format from 'date-fns/format'

const SigneeView = ({
  collectionType,
  listsForUser,
  signedLists,
}: {
  collectionType: SignatureCollectionCollectionType
  listsForUser: SignatureCollectionList[]
  signedLists: SignatureCollectionSignedList[]
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      {listsForUser?.length === 0 && signedLists?.length === 0 && (
        <EmptyState
          title={m.noCollectionIsActive}
          description={m.noCollectionIsActiveDescription}
        />
      )}

      <Box marginTop={[0, 5]}>
        {signedLists && (
          <SignedLists
            collectionType={collectionType}
            signedLists={signedLists ?? []}
          />
        )}

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
                    eyebrow={`${formatMessage(m.endTime)} ${format(
                      new Date(list.endTime),
                      'dd.MM.yyyy',
                    )}`}
                    heading={
                      collectionType ===
                      SignatureCollectionCollectionType.LocalGovernmental
                        ? list.candidate.name
                        : list.title.split(' - ')[0]
                    }
                    text={
                      collectionType ===
                      SignatureCollectionCollectionType.Presidential
                        ? formatMessage(m.collectionTitle)
                        : collectionType ===
                          SignatureCollectionCollectionType.Parliamentary
                        ? formatMessage(m.collectionTitleParliamentary)
                        : `${formatMessage(m.collectionMunicipalListOwner)}: ${
                            list.candidate?.ownerName ?? ''
                          } (${format(
                            new Date(list.candidate?.ownerBirthDate),
                            'dd.MM.yyyy',
                          )})`
                    }
                    cta={
                      new Date(list.endTime) > new Date() && !list.maxReached
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
  )
}

export default SigneeView
