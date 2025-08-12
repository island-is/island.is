import {
  ActionCard,
  Box,
  Stack,
  Text,
  DialogPrompt,
  Tag,
  Icon,
  toast,
} from '@island.is/island-ui/core'
import { useLocation, useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../../lib/paths'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import AddConstituency from './AddConstituency'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionList,
  SignatureCollectionSuccess,
} from '@island.is/api/schema'
import { OwnerParliamentarySkeleton } from '../../../lib/skeletons'
import { useGetListsForOwner } from '../../../hooks'
import { SignatureCollection } from '@island.is/api/schema'
import { useMutation } from '@apollo/client'
import { cancelCollectionMutation } from '../../../hooks/graphql/mutations'
import SignedList from '../../shared/SignedList'
import Managers from '../../shared/Managers'

const collectionType = SignatureCollectionCollectionType.Parliamentary

const OwnerView = ({
  refetchIsOwner,
  currentCollection,
  // list holder is an individual who owns a list or has a delegation of type Procuration Holder
  isListHolder,
}: {
  refetchIsOwner: () => void
  currentCollection: SignatureCollection
  isListHolder: boolean
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const { formatMessage } = useLocale()
  const { listsForOwner, loadingOwnerLists, refetchListsForOwner } =
    useGetListsForOwner(collectionType, currentCollection?.id || '')

  const [cancelCollection] = useMutation<SignatureCollectionSuccess>(
    cancelCollectionMutation,
    {
      onCompleted: () => {
        toast.success(formatMessage(m.cancelCollectionModalToastSuccess))
        refetchListsForOwner()
        refetchIsOwner()
      },
      onError: () => {
        toast.error(formatMessage(m.cancelCollectionModalToastError))
      },
    },
  )

  const onCancelCollection = (listId: string) => {
    cancelCollection({
      variables: {
        input: {
          collectionId: currentCollection?.id ?? '',
          listIds: listId,
        },
      },
    })
  }

  return (
    <Stack space={6}>
      <Box>
        <SignedList
          currentCollection={currentCollection}
          collectionType={collectionType}
        />
        <Box display="flex" justifyContent="spaceBetween" alignItems="baseline">
          <Text variant="h4">{formatMessage(m.myListsDescription) + ' '}</Text>
          {isListHolder &&
            !loadingOwnerLists &&
            listsForOwner?.length < currentCollection?.areas.length && (
              <AddConstituency
                lists={listsForOwner}
                collection={currentCollection}
                candidateId={listsForOwner[0]?.candidate?.id}
                refetch={refetchListsForOwner}
              />
            )}
        </Box>
        {loadingOwnerLists ? (
          <Box marginTop={3}>
            <OwnerParliamentarySkeleton />
          </Box>
        ) : (
          listsForOwner.map((list: SignatureCollectionList) => (
            <Box key={list.id} marginTop={3}>
              <ActionCard
                backgroundColor="white"
                heading={list.area?.name}
                progressMeter={{
                  currentProgress: list.numberOfSignatures || 0,
                  maxProgress: list.area?.min || 0,
                  withLabel: true,
                }}
                eyebrow={list.title.split(' - ')[0]}
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
                  list.active && isListHolder
                    ? {
                        label: 'Cancel collection',
                        renderTag: () => (
                          <DialogPrompt
                            baseId="cancel_collection_dialog"
                            title={
                              formatMessage(m.cancelCollectionButton) +
                              ' - ' +
                              list.area?.name
                            }
                            description={
                              listsForOwner.length === 1
                                ? formatMessage(
                                    m.cancelCollectionModalMessageLastList,
                                  )
                                : formatMessage(m.cancelCollectionModalMessage)
                            }
                            ariaLabel="delete"
                            disclosureElement={
                              <Tag outlined variant="red">
                                <Box display="flex" alignItems="center">
                                  <Icon
                                    icon="trash"
                                    size="small"
                                    type="outline"
                                  />
                                </Box>
                              </Tag>
                            }
                            onConfirm={() => {
                              onCancelCollection(list.id)
                            }}
                            buttonTextConfirm={formatMessage(
                              listsForOwner.length === 1
                                ? m.cancelCollectionModalConfirmButtonLastList
                                : m.cancelCollectionModalConfirmButton,
                            )}
                            buttonPropsConfirm={{
                              variant: 'primary',
                              colorScheme: 'destructive',
                            }}
                            buttonTextCancel={formatMessage(
                              m.cancelCollectionModalCancelButton,
                            )}
                          />
                        ),
                      }
                    : !list.active
                    ? {
                        label: formatMessage(m.listSubmitted),
                        variant: 'blueberry',
                      }
                    : undefined
                }
              />
            </Box>
          ))
        )}
      </Box>
      <Managers collectionType={collectionType} />
    </Stack>
  )
}

export default OwnerView
