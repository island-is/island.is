import {
  ActionCard,
  Box,
  Stack,
  Text,
  Table as T,
  Tooltip,
  DialogPrompt,
  Tag,
  Icon,
  toast,
  Button,
} from '@island.is/island-ui/core'
import { useLocation, useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../../lib/paths'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import AddConstituency from './AddConstituency'
import {
  SignatureCollectionList,
  SignatureCollectionSuccess,
} from '@island.is/api/schema'
import {
  CollectorSkeleton,
  OwnerParliamentarySkeleton,
} from '../../../skeletons'
import { useGetCollectors, useGetListsForOwner } from '../../../hooks'
import { SignatureCollection } from '@island.is/api/schema'
import { useMutation } from '@apollo/client'
import { cancelCollectionMutation } from '../../../hooks/graphql/mutations'
import copyToClipboard from 'copy-to-clipboard'
import { formatNationalId } from '@island.is/portals/core'
import SignedList from '../../shared/SignedList'

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
    useGetListsForOwner(currentCollection?.id || '')
  const { collectors, loadingCollectors } = useGetCollectors()

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
    <Stack space={8}>
      <Box marginTop={5}>
        <SignedList currentCollection={currentCollection} />
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="baseline"
          marginTop={[5, 10]}
        >
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
      <Box>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="baseline"
          marginBottom={3}
        >
          <Text variant="h4">
            {formatMessage(m.supervisors) + ' '}
            <Tooltip
              placement="bottom"
              text={formatMessage(m.supervisorsTooltip)}
            />
          </Text>
        </Box>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{formatMessage(m.personName)}</T.HeadData>
              <T.HeadData>{formatMessage(m.personNationalId)}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {loadingCollectors ? (
              <T.Row>
                <T.Data>
                  <CollectorSkeleton />
                </T.Data>
                <T.Data>
                  <CollectorSkeleton />
                </T.Data>
              </T.Row>
            ) : collectors.length ? (
              collectors.map((collector) => (
                <T.Row key={collector.nationalId}>
                  <T.Data width={'35%'}>{collector.name}</T.Data>
                  <T.Data>{formatNationalId(collector.nationalId)}</T.Data>
                </T.Row>
              ))
            ) : (
              <Text marginTop={2}>{formatMessage(m.noSupervisors)}</Text>
            )}
          </T.Body>
        </T.Table>
      </Box>
      <Box
        background="blue100"
        borderRadius="large"
        display={['block', 'flex', 'flex']}
        justifyContent="spaceBetween"
        alignItems="center"
        padding={3}
      >
        <Text marginBottom={[2, 0, 0]} variant="small">
          {formatMessage(m.copyLinkDescription)}
        </Text>
        <Box>
          <Button
            onClick={() => {
              const copied = copyToClipboard(
                `${document.location.origin}${listsForOwner[0].slug}`,
              )
              if (!copied) {
                return toast.error(formatMessage(m.copyLinkError))
              }
              toast.success(formatMessage(m.copyLinkSuccess))
            }}
            variant="text"
            icon="link"
            size="medium"
          >
            {formatMessage(m.copyLinkButton)}
          </Button>
        </Box>
      </Box>
    </Stack>
  )
}

export default OwnerView
