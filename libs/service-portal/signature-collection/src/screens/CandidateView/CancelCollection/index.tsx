import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { Modal } from '@island.is/service-portal/core'
import { useState } from 'react'
import { useGetListsForUser, useIsOwner } from '../../../hooks'
import { useMutation } from '@apollo/client'
import { cancelCollectionMutation } from '../../../hooks/graphql/mutations'
import { SignatureCollectionSuccess } from '@island.is/api/schema'

const CancelCollection = ({ collectionId }: { collectionId: string }) => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { refetchIsOwner } = useIsOwner()
  const { refetchListsForUser } = useGetListsForUser()
  const [cancelCollection, { loading }] =
    useMutation<SignatureCollectionSuccess>(cancelCollectionMutation, {
      variables: { input: { id: collectionId } },
    })

  const onCancelCollection = async () => {
    await cancelCollection().then(({ data }) => {
      if (
        (
          data as any as {
            signatureCollectionCancel: SignatureCollectionSuccess
          }
        ).signatureCollectionCancel.success
      ) {
        toast.success(formatMessage(m.cancelCollectionModalToastSuccess))
        setModalIsOpen(false)
        refetchIsOwner()
        refetchListsForUser()
      } else {
        toast.error(formatMessage(m.cancelCollectionModalToastError))
        setModalIsOpen(false)
      }
    })
  }

  return (
    <Box marginTop={[5, 8]} display={'flex'} justifyContent={'center'}>
      <Modal
        id="cancelCollection"
        isVisible={modalIsOpen}
        toggleClose={false}
        initialVisibility={false}
        onCloseModal={() => setModalIsOpen(false)}
        disclosure={
          <Button
            variant="text"
            size="small"
            colorScheme="destructive"
            onClick={() => setModalIsOpen(true)}
          >
            {formatMessage(m.cancelCollectionButton)}
          </Button>
        }
      >
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
      </Modal>
    </Box>
  )
}

export default CancelCollection
