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
  CollectionStatus,
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
  const params = useParams()
  const area = params.municipality ?? ''
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
        toast.error(formatMessage(m.toggleCollectionProcessError))
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
            <Tag>
              <Box display="flex" justifyContent="center">
                <Icon icon="checkmark" type="outline" color="blue600" />
              </Box>
            </Tag>
            <Box marginLeft={5}>
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
                disabled={collection.status === CollectionStatus.Processed}
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
        <Box marginTop={5}>
          <Text>
            {formatMessage(m.completeCollectionProcessingDescription)}
          </Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              iconType="outline"
              icon="checkmark"
              variant="ghost"
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
