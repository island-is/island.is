import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Modal } from '@island.is/service-portal/core'
import { useState } from 'react'
import { useCancelCollection } from '../hooks'

const CancelCollection = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { cancelCollection } = useCancelCollection()

  const onUnSignList = async () => {
    setModalIsOpen(false)
    await cancelCollection().then(({ data }) => {
      if (data?.success) {
        // TODO: refetch isOwner and user lists
      } else {
        toast.error(formatMessage(m.cancelCollectionModalToastError))
      }
    })
  }

  return (
    <Box marginTop={10} display={'flex'} justifyContent={'center'}>
      <Modal
        id="cancelCollection"
        isVisible={modalIsOpen}
        toggleClose={false}
        initialVisibility={false}
        disclosure={
          <Button
            variant="ghost"
            size="small"
            onClick={() => setModalIsOpen(true)}
          >
            {formatMessage(m.cancelCollectionButton)}
          </Button>
        }
      >
        <Text variant="h1" paddingTop={5}>
          {formatMessage(m.cancelCollectionModalMessage)}
        </Text>
        <Box marginTop={10} display="flex" justifyContent="center">
          <Button onClick={() => onUnSignList()}>
            {formatMessage(m.cancelCollectionModalConfirmButton)}
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default CancelCollection
