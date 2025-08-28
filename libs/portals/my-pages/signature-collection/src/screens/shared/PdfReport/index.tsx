import { useLocale } from '@island.is/localization'
import { Box, Button } from '@island.is/island-ui/core'
import { usePDF, Document } from '@react-pdf/renderer'
import MyPdfDocument from './Document'
import { useGetPdfReport } from '../../../hooks'
import { m } from '../../../lib/messages'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'
import { useEffect } from 'react'

export const PdfReport = ({
  listId,
  collectionType,
}: {
  listId: string
  collectionType: SignatureCollectionCollectionType
}) => {
  const { formatMessage } = useLocale()
  const { report } = useGetPdfReport(listId || '', collectionType)

  const [instance, updateInstance] = usePDF({ document: <Document /> })

  useEffect(() => {
    if (report) {
      updateInstance(<MyPdfDocument report={report} collectionType={collectionType} />)
    }
  }, [report, updateInstance])

  return (
    <Box>
      <Button
        icon="download"
        iconType="outline"
        variant="ghost"
        onClick={() => window.open(instance.url?.toString(), '_blank')}
      >
        {formatMessage(m.downloadPdf)}
      </Button>
    </Box>
  )
}

export default PdfReport
