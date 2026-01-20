import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useParams, useRevalidator } from 'react-router-dom'
import { useProcessCollectionMutation } from './finishCollectionProcess.generated'
import {
  SignatureCollection,
  SignatureCollectionCollectionType,
} from '@island.is/api/schema'

const ActionCompleteCollectionProcessing = ({
  collection,
}: {
  collection: SignatureCollection
}) => {
  const { formatMessage } = useLocale()
  const [modalSubmitReviewIsOpen, setModalSubmitReviewIsOpen] = useState(false)

  // areaId is used for LocalGovernmental collections, instead of collection.id
  const { municipality: area = '' } = useParams<{ municipality?: string }>()
  const areaId = collection.areas.find((a) => a.name === area)?.collectionId

  const [processCollectionMutation, { loading }] =
    useProcessCollectionMutation()
  const { revalidate } = useRevalidator()

  const completeProcessing = async () => {
    try {
      const res = await processCollectionMutation({
        variables: {
          input: {
            collectionId:
              collection.collectionType ===
              SignatureCollectionCollectionType.LocalGovernmental
                ? areaId ?? ''
                : collection.id,
            collectionType: collection.collectionType,
          },
        },
      })
      if (res.data?.signatureCollectionAdminProcess.success) {
        toast.success(formatMessage(m.completeCollectionProcessing))
        setModalSubmitReviewIsOpen(false)
        revalidate()
      } else {
        toast.error(
          res?.data?.signatureCollectionAdminProcess.reasons?.[0] ??
            formatMessage(m.toggleCollectionProcessError),
        )
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <Box>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box display="flex">
            <Box marginTop={1}>
              <Tag>
                <Box display="flex" justifyContent="center">
                  <Icon icon="checkmark" type="outline" color="blue600" />
                </Box>
              </Tag>
            </Box>
            <Box marginLeft={3}>
              <Text variant="h4">
                {formatMessage(m.completeCollectionProcessing)}
              </Text>
              <Text marginBottom={2}>
                {formatMessage(m.completeCollectionProcessingDescription)}
              </Text>
              <Button
                variant="text"
                size="small"
                onClick={() => setModalSubmitReviewIsOpen(true)}
              >
                {formatMessage(m.completeCollectionProcessing)}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      <Modal
        id="reviewComplete"
        isVisible={modalSubmitReviewIsOpen}
        title={formatMessage(m.completeCollectionProcessing)}
        label={formatMessage(m.completeCollectionProcessing)}
        onClose={() => setModalSubmitReviewIsOpen(false)}
        closeButtonLabel={''}
      >
        <Box>
          <Text>
            {formatMessage(m.completeCollectionProcessingDescription)}
          </Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              iconType="outline"
              icon="checkmark"
              colorScheme="default"
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
