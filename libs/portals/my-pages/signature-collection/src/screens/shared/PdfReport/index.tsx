import { useLocale } from '@island.is/localization'
import { Button } from '@island.is/island-ui/core'
import { Document, pdf } from '@react-pdf/renderer'
import MyPdfDocument from './Document'
import { useGetPdfReport } from '../../../hooks'
import { m } from '../../../lib/messages'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'
import { useEffect, useState } from 'react'

export const PdfReport = ({
  listId,
  collectionType,
}: {
  listId: string
  collectionType: SignatureCollectionCollectionType
}) => {
  const { formatMessage } = useLocale()
  const { report, refetch } = useGetPdfReport(listId || '', collectionType)

  const instance = pdf(<Document />)
  const [openAfterUpdate, setOpenAfterUpdate] = useState(false)

  useEffect(() => {
    if (report) {
      instance.updateContainer(
        <MyPdfDocument report={report} collectionType={collectionType} />,
        async () => {
          if (openAfterUpdate) {
            const url = await instance
              .toBlob()
              .then((b) => URL.createObjectURL(b))
            window.open(url, '_blank')
            setOpenAfterUpdate(false)
          }
        },
      )
    }
  }, [report, instance, collectionType, openAfterUpdate])

  const onClick = async () => {
    await refetch()
    setOpenAfterUpdate(true)
  }

  return (
    <Button
      variant="text"
      onClick={onClick}
      disabled={openAfterUpdate}
      loading={openAfterUpdate}
    >
      {formatMessage(m.downloadPdf)}
    </Button>
  )
}

export default PdfReport
