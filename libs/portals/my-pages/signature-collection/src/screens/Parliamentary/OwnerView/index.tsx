import { ActionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocation, useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../../lib/paths'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import AddConstituency from './AddConstituency'
import {
  SignatureCollectionList,
  SignatureCollectionSignedList,
} from '@island.is/api/schema'
import { SignatureCollection } from '@island.is/api/schema'
import SignedLists from '../../shared/SignedLists'
import Managers from '../../shared/Managers'

const OwnerView = ({
  currentCollection,
  // list holder is an individual who owns a list or has a delegation of type Procuration Holder
  isListHolder,
  listsForOwner,
  signedLists,
}: {
  currentCollection: SignatureCollection
  isListHolder: boolean
  listsForOwner: SignatureCollectionList[]
  signedLists: SignatureCollectionSignedList[]
}) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const location = useLocation()
  const { collectionType } = currentCollection

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
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="baseline"
            marginBottom={2}
          >
            <Text variant="h4">{formatMessage(m.myListsDescription)}</Text>
            {isListHolder &&
              listsForOwner?.length < currentCollection?.areas.length && (
                <AddConstituency
                  lists={listsForOwner}
                  collection={currentCollection}
                  candidateId={listsForOwner[0]?.candidate?.id}
                />
              )}
          </Box>
          <Stack space={[3, 5]}>
            {listsForOwner.map((list) => (
              <ActionCard
                key={list.id}
                backgroundColor="white"
                heading={list.area?.name}
                progressMeter={{
                  currentProgress: list.numberOfSignatures || 0,
                  maxProgress: list.area?.min || 0,
                  withLabel: true,
                }}
                eyebrow={list.title}
                cta={
                  list.active
                    ? {
                        label: formatMessage(m.viewList),
                        variant: 'text',
                        icon: 'arrowForward',
                        onClick: () => {
                          const path = location.pathname.includes('fyrirtaeki')
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
            ))}
          </Stack>
        </Box>
      )}
      <Managers collectionType={collectionType} />
    </Stack>
  )
}

export default OwnerView
