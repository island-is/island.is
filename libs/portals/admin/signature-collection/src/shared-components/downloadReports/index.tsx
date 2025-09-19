import { useLocale } from '@island.is/localization'
import {
  ActionCard,
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import {
  SignatureCollection,
  SignatureCollectionArea,
  SignatureCollectionCollectionType,
} from '@island.is/api/schema'
import { m } from '../../lib/messages'
import { pdf } from '@react-pdf/renderer'
import MyPdfDocument from './MyPdfDocument'
import { SignatureCollectionAreaSummaryReportDocument } from './MyPdfDocument/areaSummary.generated'
import { useLazyQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

export const DownloadReports = ({
  collection,
}: {
  collection: SignatureCollection
}) => {
  const { formatMessage } = useLocale()
  const [modalDownloadReportsIsOpen, setModalDownloadReportsIsOpen] =
    useState(false)
  const [runGetSummaryReport, { loading }] = useLazyQuery(
    SignatureCollectionAreaSummaryReportDocument,
  )
  const instance = pdf(undefined)

  const { municipality, constituencyName } = useParams<{
    municipality?: string
    constituencyName?: string
  }>()

  const collectionType = collection.collectionType
  // area is used for LocalGovernmental and Parliamentary collections,
  // to get the report for certain area
  const areaName =
    collectionType === SignatureCollectionCollectionType.LocalGovernmental
      ? municipality
      : collectionType === SignatureCollectionCollectionType.Parliamentary
      ? constituencyName
      : undefined

  const area = areaName
    ? collection.areas.find((a) => a.name === areaName)
    : undefined

  const handleDownloadClick = async (area: SignatureCollectionArea) => {
    if (!loading) {
      runGetSummaryReport({
        variables: {
          input: {
            areaId: area.id,
            collectionId:
              collection.collectionType ===
              SignatureCollectionCollectionType.LocalGovernmental
                ? area.collectionId
                : collection?.id,
          },
        },
        onCompleted: (res) => {
          instance.updateContainer(
            <MyPdfDocument report={res.signatureCollectionAreaSummaryReport} />,
            async () => {
              const url = await instance
                .toBlob()
                .then((b) => URL.createObjectURL(b))
              window.open(url, '_blank')
            },
          )
        },
        fetchPolicy: 'no-cache',
      })
    }
  }

  return (
    <Box>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box display="flex">
            <Tag>
              <Box display="flex" justifyContent="center">
                <Icon icon="document" type="outline" color="blue600" />
              </Box>
            </Tag>
            <Box marginLeft={5}>
              <Text variant="h4">{formatMessage(m.downloadReport)}</Text>
              <Text marginBottom={2}>
                {formatMessage(m.downloadReportsDescription)}
              </Text>
              <Button
                variant="text"
                size="small"
                onClick={() => setModalDownloadReportsIsOpen(true)}
              >
                {formatMessage(m.downloadReport)}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      <Modal
        id="downloadReports"
        isVisible={modalDownloadReportsIsOpen}
        title={formatMessage(m.downloadReport)}
        label={''}
        onClose={() => {
          setModalDownloadReportsIsOpen(false)
        }}
        closeButtonLabel={''}
      >
        <Text>{formatMessage(m.downloadReportsDescription)}</Text>
        <Box marginY={5}>
          <Stack space={3}>
            {(area ? [area] : collection?.areas || []).map((area) => (
              <ActionCard
                key={area.id}
                heading={formatMessage(area.name ?? '')}
                headingVariant="h4"
                backgroundColor="blue"
                cta={{
                  label: formatMessage(m.downloadButton),
                  variant: 'text',
                  icon: 'download',
                  iconType: 'outline',
                  onClick: () => handleDownloadClick(area),
                  disabled: loading,
                }}
              />
            ))}
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}

export default DownloadReports
