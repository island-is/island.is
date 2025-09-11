import { ActionCard, Stack, Text, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import Managers from '../../shared/Managers'
import {
  SignatureCollection,
  SignatureCollectionList,
} from '@island.is/api/schema'
import { useGetListsForOwner, useGetSignedList } from '../../../hooks'
import { useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../../lib/paths'
import SignedLists from '../../shared/SignedLists'
import { Skeleton } from '../../../lib/skeletons'

const OwnerView = ({
  currentCollection,
}: {
  currentCollection: SignatureCollection
}) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const collectionType = currentCollection?.collectionType ?? ''
  const { listsForOwner, loadingOwnerLists } = useGetListsForOwner(
    collectionType,
    '',
  )

  const { signedLists, loadingSignedLists } = useGetSignedList(collectionType)

  return (
    <Box>
      {!loadingOwnerLists && !loadingSignedLists ? (
        <Stack space={8}>
          <SignedLists signedLists={signedLists} />
          <Box>
            <Text variant="h4" marginBottom={3}>
              {formatMessage(m.myListsDescription)}
            </Text>
            {listsForOwner.map((list: SignatureCollectionList) => (
              <Box key={list.id} marginTop={3}>
                <ActionCard
                  backgroundColor="white"
                  heading={list.title}
                  progressMeter={{
                    currentProgress: list.numberOfSignatures || 0,
                    maxProgress: list.area?.min,
                    withLabel: true,
                  }}
                  eyebrow={list.area.name}
                  cta={
                    list.active
                      ? {
                          label: formatMessage(m.viewList),
                          variant: 'text',
                          icon: 'arrowForward',
                          onClick: () => {
                            navigate(
                              SignatureCollectionPaths.ViewMunicipalList.replace(
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
                        }
                      : undefined
                  }
                  tag={
                    list.active
                      ? {
                          label: formatMessage(m.collectionIsActive),
                          variant: 'blue',
                          outlined: false,
                        }
                      : {
                          label: formatMessage(m.collectionClosed),
                          variant: 'red',
                          outlined: true,
                        }
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
