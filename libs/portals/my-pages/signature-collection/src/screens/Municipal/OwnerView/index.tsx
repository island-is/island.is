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
      {signedLists && (
        <SignedLists
          collectionType={collectionType}
          signedLists={signedLists}
        />
      )}
      <Box>
        <Text variant="h4" marginBottom={3}>
          {formatMessage(m.myListsDescription)}
        </Text>
        {listsForOwner.map((list: SignatureCollectionList) => (
          <Box key={list.id} marginTop={3}>
            <ActionCard
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
          </Box>
        ))}
      </Box>
      <Managers collectionType={collectionType} />
    </Stack>
  )
}

export default OwnerView
