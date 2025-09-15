import { Box, Text, Button, toast, Tag, Icon } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  SignatureCollectionCancelListsInput,
  SignatureCollectionCollectionType,
  SignatureCollectionList,
  SignatureCollectionSuccess,
} from '@island.is/api/schema'
import { cancelCollectionMutation } from '../../../hooks/graphql/mutations'
import { Modal } from '@island.is/portals/my-pages/core'
import { useNavigate } from 'react-router-dom'
import { useIsOwner } from '../../../hooks'

const CancelCollection = ({ list }: { list: SignatureCollectionList }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { refetchIsOwner } = useIsOwner(list.collectionType)
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const [cancelCollection, { loading }] = useMutation<
    { signatureCollectionCancel: SignatureCollectionSuccess },
    {
      input: SignatureCollectionCancelListsInput
    }
  >(cancelCollectionMutation, {
    variables: {
      input: {
        collectionType: list?.collectionType,
        listIds: [list.id],
        collectionId:
          list.collectionType ===
          SignatureCollectionCollectionType.LocalGovernmental
            ? list.area?.collectionId ?? ''
            : list.collectionId ?? '',
      },
    },
    onCompleted: ({ signatureCollectionCancel }) => {
      const { success } = signatureCollectionCancel ?? {}
      if (success) {
        toast.success(formatMessage(m.cancelCollectionModalToastSuccess))
      } else {
        toast.error(formatMessage(m.cancelCollectionModalToastError))
      }
      setModalIsOpen(false)
      refetchIsOwner()
      navigate(-1)
    },
    onError: () => {
      toast.error(formatMessage(m.cancelCollectionModalToastError))
      setModalIsOpen(false)
    },
  })

  return (
    <Box display="flex">
      <Box marginTop={1}>
        <Tag variant="red">
          <Box display="flex" justifyContent="center">
            <Icon icon="trash" type="outline" color="red600" />
          </Box>
        </Tag>
      </Box>
      <Box marginLeft={5}>
        <Text variant="h4">{formatMessage(m.deleteCollection)}</Text>
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
              {formatMessage(m.deleteCollection)}
            </Button>
          }
        >
          <Box display="block" width="full">
            <Text variant="h2" marginTop={[5, 0]}>
              {formatMessage(m.cancelCollectionButton)}
            </Text>
            <Text variant="default" marginTop={2}>
              {formatMessage(m.cancelCollectionModalMessage)}
            </Text>
            <Box
              marginTop={[7, 10]}
              marginBottom={5}
              display="flex"
              justifyContent="center"
            >
              <Button
                onClick={() => cancelCollection()}
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

export default CancelCollection
