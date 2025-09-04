import { ActionCard, Stack, Text, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import Managers from '../../shared/Managers'
import {
  SignatureCollection,
  SignatureCollectionCollectionType,
  SignatureCollectionList,
} from '@island.is/api/schema'
import { useGetListsForOwner } from '../../../hooks'
import { useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../../lib/paths'
import SignedList from '../../shared/SignedList'
import { Skeleton } from '../../../lib/skeletons'

const OwnerView = ({
  currentCollection,
  collectionType,
}: {
  currentCollection: SignatureCollection
  collectionType: SignatureCollectionCollectionType
}) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { listsForOwner, loadingOwnerLists } = useGetListsForOwner(
    collectionType,
    '',
  )

  return (
    <Box>
      {!loadingOwnerLists ? (
        <Stack space={6}>
          <SignedList
            currentCollection={currentCollection}
            collectionType={collectionType}
          />
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
                  tag={{
                    label: formatMessage(m.collectionIsActive),
                    variant: 'blue',
                    outlined: false,
                  }}
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
