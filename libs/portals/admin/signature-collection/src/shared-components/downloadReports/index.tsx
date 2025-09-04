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
import { useEffect, useRef, useState } from 'react'
import { Modal } from '@island.is/react/components'
import {
  SignatureCollection,
  SignatureCollectionArea,
  SignatureCollectionCollectionType,
} from '@island.is/api/schema'
import { m } from '../../lib/messages'
import { usePDF } from '@react-pdf/renderer'
import MyPdfDocument from './MyPdfDocument'
import { SignatureCollectionAreaSummaryReportDocument } from './MyPdfDocument/areaSummary.generated'
import { useLazyQuery } from '@apollo/client'

export const DownloadReports = ({
  collection,
}: {
  collection: SignatureCollection
}) => {
  const { formatMessage } = useLocale()
  const [modalDownloadReportsIsOpen, setModalDownloadReportsIsOpen] =
    useState(false)
  const [runGetSummaryReport, { data }] = useLazyQuery(
    SignatureCollectionAreaSummaryReportDocument,
  )
  const [instance, updateInstance] = usePDF({ document: undefined })
  const lastOpenedRef = useRef<string | null>(null)

  const handleDownloadClick = async (area: SignatureCollectionArea) => {
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
        updateInstance(
          <MyPdfDocument report={res.signatureCollectionAreaSummaryReport} />,
        )
      },
    })
  }

  useEffect(() => {
    if (data?.signatureCollectionAreaSummaryReport && instance?.url) {
      // Check if we already opened this report
      if (lastOpenedRef.current !== instance.url) {
        window.open(instance.url, '_blank')
        // mark it as opened
        lastOpenedRef.current = instance.url
      }
    }
  }, [data?.signatureCollectionAreaSummaryReport, instance?.url])

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
              <Text variant="h4">{formatMessage(m.downloadReports)}</Text>
              <Text marginBottom={2}>
                {formatMessage(m.downloadReportsDescription)}
              </Text>
              <Button
                variant="text"
                size="small"
                onClick={() => setModalDownloadReportsIsOpen(true)}
              >
                {formatMessage(m.downloadReports)}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      <Modal
        id="downloadReports"
        isVisible={modalDownloadReportsIsOpen}
        title={formatMessage(m.downloadReports)}
        label={''}
        onClose={() => {
          setModalDownloadReportsIsOpen(false)
        }}
        closeButtonLabel={''}
      >
        <Text>{formatMessage(m.downloadReportsDescription)}</Text>
        <Box marginY={5}>
          <Stack space={3}>
            {collection?.areas.map((area) => (
              <ActionCard
                key={area.id}
                heading={formatMessage(area.name)}
                headingVariant="h4"
                backgroundColor="blue"
                cta={{
                  label: formatMessage(m.downloadButton),
                  variant: 'text',
                  icon: 'download',
                  iconType: 'outline',
                  onClick: () => handleDownloadClick(area),
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
