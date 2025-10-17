import { useLocale } from '@island.is/localization'
import { Button, toast } from '@island.is/island-ui/core'
import { Document, pdf } from '@react-pdf/renderer'
import MyPdfDocument from './Document'
import { m } from '../../../lib/messages'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'
import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  getPdfReport,
  getPdfReportPresidentialCandidate,
} from '../../../hooks/graphql/queries'

export const PdfReport = ({
  listId,
  collectionType,
  candidateId,
}: {
  collectionType: SignatureCollectionCollectionType
  listId?: string
  candidateId?: string
}) => {
  const { formatMessage } = useLocale()

  // fetch LocalGovernmental or Parliamentary report
  const [getAreaReport, { data: areaReport, loading: loadingSummary }] =
    useLazyQuery(getPdfReport)

  // fetch Presidential report
  const [
    getCandidateReport,
    { data: candidateReport, loading: loadingCandidate },
  ] = useLazyQuery(getPdfReportPresidentialCandidate)

  const instance = pdf(<Document />)
  const [openAfterUpdate, setOpenAfterUpdate] = useState(false)

  useEffect(() => {
    const report =
      areaReport?.signatureCollectionListOverview ??
      candidateReport?.signatureCollectionCandidateReport

    if (!report) return

    instance.updateContainer(<MyPdfDocument report={report} />, async () => {
      if (openAfterUpdate) {
        const blob = await instance.toBlob()
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
        setOpenAfterUpdate(false)
      }
    })
  }, [areaReport, candidateReport, instance, collectionType, openAfterUpdate])

  const onClick = async () => {
    try {
      if (collectionType === SignatureCollectionCollectionType.Presidential) {
        await getCandidateReport({
          variables: { input: { candidateId, collectionType } },
        })
      } else {
        await getAreaReport({
          variables: { input: { listId, collectionType } },
        })
      }
    } catch {
      toast.error(formatMessage(m.pdfReportError))
    }

    setOpenAfterUpdate(true)
  }
  return (
    <Button
      variant="text"
      onClick={onClick}
      loading={loadingCandidate || loadingSummary}
    >
      {formatMessage(m.downloadPdf)}
    </Button>
  )
}

export default PdfReport
