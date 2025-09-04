import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { Modal } from '@island.is/portals/my-pages/core'
import { useState } from 'react'
import { useGetCurrentCollection } from '../../../../hooks'
import { useMutation } from '@apollo/client'
import { cancelCollectionMutation } from '../../../../hooks/graphql/mutations'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionSuccess,
} from '@island.is/api/schema'

const CancelCollection = ({
  refetchIsOwner,
}: {
  refetchIsOwner: () => void
}) => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { currentCollection } = useGetCurrentCollection(
    SignatureCollectionCollectionType.Presidential,
  )

  const [cancelCollection, { loading }] =
    useMutation<SignatureCollectionSuccess>(cancelCollectionMutation, {
      variables: {
        input: {
          collectionId: currentCollection?.id ?? '',
          collectionType: currentCollection?.collectionType ?? '',
        },
      },
    })

  const onCancelCollection = async () => {
    await cancelCollection().then(({ data }) => {
      if (
        (
          data as unknown as {
            signatureCollectionCancel: SignatureCollectionSuccess
          }
        ).signatureCollectionCancel.success
      ) {
        toast.success(formatMessage(m.cancelCollectionModalToastSuccess))
        setModalIsOpen(false)
        refetchIsOwner()
      } else {
        toast.error(formatMessage(m.cancelCollectionModalToastError))
        setModalIsOpen(false)
      }
    })
  }

  return (
    <Box display="flex" justifyContent="center">
      <Modal
        id="cancelCollection"
        isVisible={modalIsOpen}
        toggleClose={false}
        initialVisibility={false}
        onCloseModal={() => setModalIsOpen(false)}
        disclosure={
          <Button
            variant="ghost"
            size="small"
            colorScheme="destructive"
            onClick={() => setModalIsOpen(true)}
          >
            {formatMessage(m.cancelCollectionButton)}
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
              onClick={() => onCancelCollection()}
              loading={loading}
              colorScheme="destructive"
            >
              {formatMessage(m.cancelCollectionModalConfirmButton)}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default CancelCollection
