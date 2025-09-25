import { ActionCard, Stack, Text, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import Managers from '../../shared/Managers'
import {
  SignatureCollection,
  SignatureCollectionList,
  SignatureCollectionSignedList,
} from '@island.is/api/schema'
import { useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../../lib/paths'
import SignedLists from '../../shared/SignedLists'
import format from 'date-fns/format'

const OwnerView = ({
  currentCollection,
  listsForOwner,
  signedLists,
}: {
  currentCollection: SignatureCollection
  listsForOwner: SignatureCollectionList[]
  signedLists: SignatureCollectionSignedList[]
}) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { id: collectionId, collectionType } = currentCollection

  return (
    <Stack space={8}>
      {signedLists?.length > 0 && (
        <SignedLists
          collectionType={collectionType}
          signedLists={signedLists}
        />
      )}

      {/* Candidate created lists */}
      {listsForOwner?.length > 0 && (
        <Box>
          <Text variant="h4" marginBottom={2}>
            {formatMessage(m.myListsDescription)}
          </Text>
          <Stack space={[3, 5]}>
            {listsForOwner.map((list) => (
              <ActionCard
                key={list.id}
                backgroundColor="white"
                heading={list.candidate.name ?? ''}
                progressMeter={{
                  currentProgress: list.numberOfSignatures || 0,
                  maxProgress: list.area?.min,
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
                          navigate(
                            SignatureCollectionPaths.ViewMunicipalList.replace(
                              ':id',
                              list.id,
                            ),
                            {
                              state: {
                                collectionId: collectionId || '',
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
            ))}
          </Stack>
        </Box>
      )}
      <Managers collectionType={collectionType} />
    </Stack>
  )
}

export default OwnerView
