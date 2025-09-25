import { Box, Button, Icon, Tag, Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { Modal } from '@island.is/portals/my-pages/core'
import { useState } from 'react'
import { useGetCurrentCollection, useIsOwner } from '../../../../hooks'
import { useMutation } from '@apollo/client'
import { cancelCollectionMutation } from '../../../../hooks/graphql/mutations'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionSuccess,
} from '@island.is/api/schema'

const CancelCandidacy = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { currentCollection } = useGetCurrentCollection(
    SignatureCollectionCollectionType.Presidential,
  )
  const { refetchIsOwner } = useIsOwner(currentCollection?.collectionType)

  const [cancelCollection, { loading }] = useMutation<{
    signatureCollectionCancel: SignatureCollectionSuccess
  }>(cancelCollectionMutation)

  const onCancelCandidacy = async () => {
    if (!currentCollection) return

    const { data } = await cancelCollection({
      variables: {
        input: {
          collectionId: currentCollection?.id ?? '',
          collectionType: currentCollection?.collectionType ?? '',
        },
      },
    })

    const success = data?.signatureCollectionCancel.success

    if (success) {
      toast.success(formatMessage(m.cancelCollectionModalToastSuccess))
      refetchIsOwner()
    } else {
      toast.error(formatMessage(m.cancelCollectionModalToastError))
    }

    setModalIsOpen(false)
  }

  return (
    <Box display="flex">
      <Box marginTop={1}>
        <Tag variant="red">
          <Box display="flex" justifyContent="center">
            <Icon icon="trash" type="outline" color="red600" />
          </Box>
        </Tag>
      </Box>
      <Box marginLeft={3}>
        <Text variant="h4">{formatMessage(m.deleteCollectionCandidacy)}</Text>
        <Text marginBottom={2}>
          {formatMessage(m.deleteCollectionDescription)}
        </Text>
        <Modal
          id="cancelCollection"
          isVisible={modalIsOpen}
          toggleClose={false}
          initialVisibility={false}
          onCloseModal={() => setModalIsOpen(false)}
          disclosure={
            <Button
              variant="text"
              colorScheme="destructive"
              onClick={() => setModalIsOpen(true)}
            >
              {formatMessage(m.deleteCollectionCandidacy)}
            </Button>
          }
        >
          <Box display="block" width="full">
            <Text variant="h2" marginBottom={2}>
              {formatMessage(m.cancelCollectionButton)}
            </Text>
            <Text variant="default">
              {formatMessage(m.cancelCollectionModalMessage)}
            </Text>
            <Box
              marginTop={[3, 5]}
              marginBottom={5}
              display="flex"
              justifyContent="center"
            >
              <Button
                onClick={() => onCancelCandidacy()}
                loading={loading}
                colorScheme="destructive"
              >
                {formatMessage(m.cancelCollectionModalConfirmButton)}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  )
}

export default CancelCandidacy
