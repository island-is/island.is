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
import { useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../../lib/paths'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import AddConstituency from './AddConstituency'
import {
  SignatureCollectionList,
  SignatureCollectionSuccess,
} from '@island.is/api/schema'
import { OwnerParliamentarySkeleton } from '../../../skeletons'
import { useGetListsForOwner } from '../../../hooks'
import { SignatureCollection } from '@island.is/api/schema'
import { useMutation } from '@apollo/client'
import { cancelCollectionMutation } from '../../../hooks/graphql/mutations'
import copyToClipboard from 'copy-to-clipboard'
import { constituencies } from '../../../lib/constants'

const OwnerView = ({
  currentCollection,
}: {
  currentCollection: SignatureCollection
}) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const { listsForOwner, loadingOwnerLists, refetchListsForOwner } =
    useGetListsForOwner(currentCollection?.id || '')

  const [cancelCollection] = useMutation<SignatureCollectionSuccess>(
    cancelCollectionMutation,
    {
      onCompleted: () => {
        toast.success(formatMessage(m.cancelCollectionModalToastSuccess))
        refetchListsForOwner()
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
        <Box display="flex" justifyContent="spaceBetween" alignItems="baseline">
          <Text variant="h4">
            {formatMessage(m.myListsDescription) + ' '}
            <Tooltip
              placement="right"
              text={formatMessage(m.myListsInfo)}
              color="blue400"
            />
          </Text>
          {listsForOwner.length < constituencies.length && (
            <AddConstituency lists={listsForOwner} />
          )}
        </Box>
        {loadingOwnerLists ? (
          <Box marginTop={2}>
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
                cta={{
                  label: formatMessage(m.viewList),
                  variant: 'text',
                  icon: 'arrowForward',
                  onClick: () => {
                    navigate(
                      SignatureCollectionPaths.ViewParliamentaryList.replace(
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
                }}
                tag={{
                  label: 'Cancel collection',
                  renderTag: () => (
                    <DialogPrompt
                      baseId="cancel_collection_dialog"
                      title={
                        formatMessage(m.cancelCollectionButton) +
                        ' - ' +
                        list.area?.name
                      }
                      description={formatMessage(
                        m.cancelCollectionModalMessage,
                      )}
                      ariaLabel="delete"
                      disclosureElement={
                        <Tag outlined variant="red">
                          <Box display="flex" alignItems="center">
                            <Icon icon="trash" size="small" type="outline" />
                          </Box>
                        </Tag>
                      }
                      onConfirm={() => {
                        onCancelCollection(list.id)
                      }}
                      buttonTextConfirm={formatMessage(
                        m.cancelCollectionModalConfirmButton,
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
                }}
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
            <Tooltip placement="right" text="info" color="blue400" />
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
            <T.Row>
              <T.Data width={'40%'}>{'Nafni Nafnason'}</T.Data>
              <T.Data>{'010130-3019'}</T.Data>
            </T.Row>
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
