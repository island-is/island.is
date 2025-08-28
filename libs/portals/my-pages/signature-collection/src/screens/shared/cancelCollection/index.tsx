import { Box, Text, Button, toast, Tag, Icon } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionSuccess,
} from '@island.is/api/schema'
import { cancelCollectionMutation } from '../../../hooks/graphql/mutations'
import { useGetCurrentCollection } from '../../../hooks'
import { Modal } from '@island.is/portals/my-pages/core'

const CancelCollection = ({ listId }: { listId: string }) => {
  const { currentCollection } = useGetCurrentCollection(
    SignatureCollectionCollectionType.LocalGovernmental,
  )

  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const [cancelCollection, { loading }] =
    useMutation<SignatureCollectionSuccess>(cancelCollectionMutation, {
      variables: {
        input: {
          collectionId: currentCollection?.id ?? '',
          collectionType: currentCollection?.collectionType,
          listIds: listId,
        },
      },
      onCompleted: () => {
        setModalIsOpen(false)
        toast.success(formatMessage(m.cancelCollectionModalToastSuccess))
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
