import { useLocale } from '@island.is/localization'
import { Box, Button } from '@island.is/island-ui/core'
import { usePDF } from '@react-pdf/renderer'
import MyPdfDocument from './Document'
import { useEffect } from 'react'
import { useGetPdfReport } from '../../../hooks'
import { m } from '../../../lib/messages'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

export const PdfReport = ({
  listId,
  collectionType,
}: {
  listId: string
  collectionType: SignatureCollectionCollectionType
}) => {
  const { formatMessage } = useLocale()
  const { report } = useGetPdfReport(listId || '', collectionType)

  const [document, updateDocument] = usePDF({
    document: report && <MyPdfDocument report={report} />,
  })

  // Update pdf document after data is fetched
  useEffect(() => {
    if (report) {
      updateDocument()
    }
  }, [report, updateDocument])

  return (
    <Box>
      <Button
        icon="download"
        iconType="outline"
        variant="ghost"
        onClick={() => window.open(document?.url?.toString(), '_blank')}
      >
        {formatMessage(m.downloadPdf)}
      </Button>
    </Box>
  )
}

export default PdfReport
