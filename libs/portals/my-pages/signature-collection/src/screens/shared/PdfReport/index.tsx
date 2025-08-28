import { useLocale } from '@island.is/localization'
import { Button } from '@island.is/island-ui/core'
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
      updateInstance(
        <MyPdfDocument report={report} collectionType={collectionType} />,
      )
    }
    // eslint-disable-next-line
  }, [report, updateInstance])

  return (
    <Button
      variant="text"
      onClick={() => window.open(instance.url?.toString(), '_blank')}
    >
      {formatMessage(m.downloadPdf)}
    </Button>
  )
}

export default PdfReport
