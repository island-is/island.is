import { useLocale } from '@island.is/localization'
import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useRevalidator } from 'react-router-dom'
import { useProcessCollectionMutation } from './finishCollectionProcess.generated'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

const ActionCompleteCollectionProcessing = ({
  collectionId,
  canProcess,
  collectionType,
}: {
  collectionId: string
  collectionType: SignatureCollectionCollectionType
  canProcess?: boolean
}) => {
  const { formatMessage } = useLocale()
  const [modalSubmitReviewIsOpen, setModalSubmitReviewIsOpen] = useState(false)

  const [processCollectionMutation, { loading }] =
    useProcessCollectionMutation()
  const { revalidate } = useRevalidator()

  const completeProcessing = async () => {
    try {
      const res = await processCollectionMutation({
        variables: { input: { collectionId, collectionType } },
      })
      if (res.data?.signatureCollectionAdminProcess.success) {
        toast.success(formatMessage(m.completeCollectionProcessing))
        setModalSubmitReviewIsOpen(false)
        revalidate()
      } else {
        toast.error(formatMessage(m.toggleCollectionProcessError))
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <Box marginTop={10}>
      <Box display="flex" justifyContent="center">
        <Box>
          <Button
            icon="lockClosed"
            iconType="outline"
            colorScheme="destructive"
            variant="text"
            onClick={() => setModalSubmitReviewIsOpen(true)}
            disabled={!canProcess}
          >
            {formatMessage(m.completeCollectionProcessing)}
          </Button>
        </Box>
      </Box>
      <Modal
        id="reviewComplete"
        isVisible={modalSubmitReviewIsOpen}
        title={formatMessage(m.completeCollectionProcessing)}
        label={formatMessage(m.completeCollectionProcessing)}
        onClose={() => setModalSubmitReviewIsOpen(false)}
        closeButtonLabel={''}
      >
        <Box marginTop={5}>
          <Text>
            {formatMessage(m.completeCollectionProcessingModalDescription)}
          </Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              iconType="outline"
              variant="ghost"
              colorScheme="destructive"
              onClick={() => completeProcessing()}
              loading={loading}
            >
              {formatMessage(m.completeCollectionProcessing)}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default ActionCompleteCollectionProcessing
