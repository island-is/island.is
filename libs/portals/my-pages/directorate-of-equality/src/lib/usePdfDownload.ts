import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { downloadLink } from '@island.is/portals/my-pages/core'

import { messages } from './messages'
import {
  useDirectorateOfEqualityImprovementPlanPdfLazyQuery,
  useDirectorateOfEqualityReportPdfLazyQuery,
} from './pdf.generated'

export const usePdfDownload = (id: string) => {
  const { formatMessage } = useLocale()
  const [getReportPdf, { loading: reportPdfLoading }] =
    useDirectorateOfEqualityReportPdfLazyQuery({ fetchPolicy: 'no-cache' })
  const [getImprovementPlanPdf, { loading: improvementPlanPdfLoading }] =
    useDirectorateOfEqualityImprovementPlanPdfLazyQuery({
      fetchPolicy: 'no-cache',
    })

  const save = (content: string | undefined, fileName: string) => {
    if (!content) {
      toast.error(formatMessage(messages.downloadPdfError))
      return
    }
    downloadLink(content, 'application/pdf', `${fileName}.pdf`)
  }

  const downloadReportPdf = async (fileName: string) => {
    const { data } = await getReportPdf({ variables: { input: { id } } })
    save(data?.directorateOfEqualityReportPdf?.content, fileName)
  }

  const downloadImprovementPlanPdf = async (fileName: string) => {
    const { data } = await getImprovementPlanPdf({
      variables: { input: { id } },
    })
    save(data?.directorateOfEqualityImprovementPlanPdf?.content, fileName)
  }

  return {
    downloadReportPdf,
    reportPdfLoading,
    downloadImprovementPlanPdf,
    improvementPlanPdfLoading,
  }
}
