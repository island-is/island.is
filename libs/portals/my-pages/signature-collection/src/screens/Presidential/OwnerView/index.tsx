import {
  SignatureCollectionCollectionType,
  SignatureCollectionList,
  SignatureCollectionSignedList,
} from '@island.is/api/schema'
import { ActionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import format from 'date-fns/format'
import { useNavigate } from 'react-router-dom'
import { m } from '../../../lib/messages'
import { SignatureCollectionPaths } from '../../../lib/paths'
import SignedLists from '../../shared/SignedLists'
import Managers from '../../shared/Managers'

const OwnerView = ({
  collectionType,
  listsForOwner,
  signedLists,
}: {
  collectionType: SignatureCollectionCollectionType
  listsForOwner: SignatureCollectionList[]
  signedLists: SignatureCollectionSignedList[]
}) => {
  useNamespaces('sp.signatureCollection')
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const user = useUserInfo()

  return (
    <Stack space={8}>
      <Box marginTop={[0, 5]}>
        {/* Signed list */}
        {!user?.profile.actor && (
          <SignedLists
            collectionType={collectionType}
            signedLists={signedLists ?? []}
          />
        )}

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
                  new Date(list.endTime) < new Date() || !list.active
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
      <Managers collectionType={collectionType} />
    </Stack>
  )
}

export default OwnerView
