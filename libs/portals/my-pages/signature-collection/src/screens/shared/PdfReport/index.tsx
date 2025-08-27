import { useLocale } from '@island.is/localization'
import { Button } from '@island.is/island-ui/core'
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
      // @ts-expect-error - updateDocument should be called without arguments based on working examples
      updateDocument()
    }
  }, [report, updateDocument])

  return (
    <Button
      variant="text"
      size="small"
      onClick={() => window.open(document?.url?.toString(), '_blank')}
    >
      {formatMessage(m.downloadPdf)}
    </Button>
  )
}

export default PdfReport
