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
import { useEffect, useState } from 'react'
import { Modal } from '@island.is/react/components'
import {
  SignatureCollection,
  SignatureCollectionAreaSummaryReport,
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
  const [pdfState, setPdfState] = useState({ areaId: '', pdfUrl: '' })

  const [runGetSummaryReport, { data }] = useLazyQuery(
    SignatureCollectionAreaSummaryReportDocument,
  )

  const [document, updateDocument] = usePDF({
    document: data && (
      <MyPdfDocument
        report={
          data?.signatureCollectionAreaSummaryReport as SignatureCollectionAreaSummaryReport
        }
      />
    ),
  })

  const handleDownloadClick = (area: string) => {
    // Fetch the report if it has not been fetched yet
    if (area !== pdfState.areaId) {
      runGetSummaryReport({
        variables: {
          input: {
            areaId: area,
            collectionId: collection?.id,
          },
        },
      })
      setPdfState({ ...pdfState, areaId: area })
    } else {
      // Open the document in a new tab if it has already been fetched
      window.open(document?.url?.toString(), '_blank')
    }
  }

  // Update pdf document after correct data is fetched
  useEffect(() => {
    if (data?.signatureCollectionAreaSummaryReport?.id === pdfState.areaId) {
      // @ts-expect-error - updateDocument should be called without arguments based on working examples
      updateDocument()
    }
  }, [data, pdfState, updateDocument])

  // Open the document in a new tab when it has been generated
  useEffect(() => {
    if (document.url && document.url !== pdfState.pdfUrl) {
      window.open(document.url, '_blank')
      setPdfState({ ...pdfState, pdfUrl: document?.url ?? '' })
    }
  }, [document.url, pdfState])

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
                  onClick: () => handleDownloadClick(area.id),
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
