import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { HTMLEditor } from '../components/html-editor/HTMLEditor'
import { HTMLText } from '@dmr.is/regulations-tools/types'
import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../lib/messages'
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { useIntl } from 'react-intl'
import { toast } from '@island.is/island-ui/core'
import { ApiActions, draftActionId } from '../utils/constants'
import { htmlToPlainText } from '../utils/htmlHelpers'
import { getProviderErrorMessage } from '../utils/providerError'

// The runner writes `data: {}` next to `status: 'failure'`, so reading `data`
// without checking the status hands back an empty bag that looks like a plan.
type ProviderEntry = {
  status?: 'success' | 'failure'
  data?: {
    equalityReportContent?: string
    contentType?: string
    contentFilename?: string | null
    /** Only on the separate, on-demand PDF provider. */
    base64?: string
  } | null
  reason?: unknown
}

/**
 * ⚠️ **A PDF-backed plan arrives with BLANK content, and that is success.**
 *
 * DMR returns `equalityReportContent: null` when the plan was uploaded as a
 * file — the bytes are megabytes of base64 and are fetched separately — so the
 * "blank means the fetch failed" rule below is true only for HTML plans.
 * Without this check an uploaded plan would report a load error on a screen
 * whose whole purpose is to show the applicant they already have one.
 */
const isPdfPlan = (data: ProviderEntry['data']) => data?.contentType === 'PDF'

// Judged on plain text, since '' and '<p></p>' both render blank. The screen
// only shows when an active plan exists, so nothing to read means a failed
// fetch, not an empty plan.
const isBlank = (html?: string | null) =>
  !html || htmlToPlainText(html).length === 0

export const PreviousEqualityPlan = ({ application }: FieldBaseProps) => {
  const { locale } = useLocale()
  const { formatMessage } = useIntl()
  const [content, setContent] = useState<HTMLText | null>(null)
  // Starts true: HTMLEditor seeds itself from the value present at MOUNT and
  // ignores every later one, so it must not mount before the effect below has
  // resolved cached or fetched content — otherwise it renders blank for good.
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPdf, setIsPdf] = useState(false)
  const [pdfFilename, setPdfFilename] = useState<string | null>(null)
  const [downloadingPdf, setDownloadingPdf] = useState(false)

  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  useEffect(() => {
    const cachedData = getValueViaPath<ProviderEntry['data']>(
      application.externalData,
      'previousEqualityReportContent.data',
    )

    // Checked before the blank test below, which would otherwise read a PDF
    // plan's empty content as a failed fetch.
    if (isPdfPlan(cachedData)) {
      setIsPdf(true)
      setPdfFilename(cachedData?.contentFilename ?? null)
      setLoading(false)
      return
    }

    const cached = cachedData?.equalityReportContent
    // A run that failed while the API was down persists '' — short-circuiting
    // on it would render the blank editor forever.
    if (!isBlank(cached)) {
      setContent(cached as HTMLText)
      setLoading(false)
      return
    }

    updateApplicationExternalData({
      variables: {
        input: {
          id: application.id,
          dataProviders: [
            {
              actionId: draftActionId(
                ApiActions.getPreviousEqualityReportContent,
              ),
              order: 0,
            },
          ],
        },
        locale,
      },
    })
      .then((res) => {
        const entry = res.data?.updateApplicationExternalData?.externalData
          ?.previousEqualityReportContent as ProviderEntry | undefined

        // Same ordering as the cached path: a PDF plan's blank content is a
        // success, so it must be recognised before the blank test.
        if (entry?.status !== 'failure' && isPdfPlan(entry?.data)) {
          setIsPdf(true)
          setPdfFilename(entry?.data?.contentFilename ?? null)
          return
        }

        const html = entry?.data?.equalityReportContent

        // Blank counts as failed: a provider returning null (no report id)
        // still reports success. `reason` is set only on a real failure.
        if (entry?.status === 'failure' || isBlank(html)) {
          setError(
            getProviderErrorMessage(entry?.reason) ??
              formatMessage(
                messages.equalityReport.previousEqualityPlan.loadError,
              ),
          )
          return
        }

        setContent(html as HTMLText)
      })
      .catch(() => {
        setError(
          formatMessage(messages.equalityReport.previousEqualityPlan.loadError),
        )
      })
      .finally(() => setLoading(false))
  }, [])

  // Rejects on a denied permission, an unfocused document or an insecure
  // context, and `clipboard` is absent outright in some browsers — left
  // unhandled the button just does nothing.
  const handleCopy = async () => {
    if (!content) return
    try {
      await navigator.clipboard.writeText(htmlToPlainText(content))
      toast.success(
        formatMessage(messages.equalityReport.previousEqualityPlan.copied),
      )
    } catch {
      toast.error(
        formatMessage(messages.equalityReport.previousEqualityPlan.copyError),
      )
    }
  }

  /**
   * Fetches the earlier plan's bytes and hands them to the browser.
   *
   * On demand rather than on render: several megabytes of base64 should not be
   * pulled through the provider channel just because the applicant opened a
   * screen that mentions the document exists.
   */
  const handleDownloadPdf = async () => {
    setDownloadingPdf(true)
    try {
      const res = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              {
                actionId: draftActionId(
                  ApiActions.getPreviousEqualityReportPdf,
                ),
                order: 0,
              },
            ],
          },
          locale,
        },
      })

      const base64 = (
        res.data?.updateApplicationExternalData?.externalData
          ?.previousEqualityReportPdf as ProviderEntry | undefined
      )?.data?.base64 as string | undefined

      if (typeof base64 !== 'string') {
        toast.error(
          formatMessage(
            messages.equalityReport.previousEqualityPlan.pdfDownloadError,
          ),
        )
        return
      }

      // Same decode as the .docx template download in `Editor.tsx` — `atob`
      // yields a binary string, which has to be widened byte by byte before it
      // can become a Blob.
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

      const url = URL.createObjectURL(
        new Blob([bytes], { type: 'application/pdf' }),
      )
      const a = document.createElement('a')
      a.href = url
      a.download = pdfFilename ?? 'jafnrettisaaetlun.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch {
      toast.error(
        formatMessage(
          messages.equalityReport.previousEqualityPlan.pdfDownloadError,
        ),
      )
    } finally {
      setDownloadingPdf(false)
    }
  }

  if (loading) {
    return <SkeletonLoader height={300} />
  }

  // Editor and copy button both go — an empty plan to read and copy reads as
  // "there is no earlier plan".
  if (error) {
    return (
      <AlertMessage
        type="error"
        title={formatMessage(messages.errors.alertTitle)}
        message={error}
      />
    )
  }

  /*
   * No editor and no copy button: there is no rich text to show or copy, and
   * an empty editor beside a "copy" control would state the opposite of what is
   * true — that the earlier plan is blank.
   */
  if (isPdf) {
    return (
      <Box>
        <AlertMessage
          type="info"
          title={formatMessage(
            messages.equalityReport.previousEqualityPlan.alertTitle,
          )}
          message={formatMessage(
            messages.equalityReport.previousEqualityPlan.pdfNotice,
          )}
        />
        <Box display="flex" justifyContent="flexEnd" marginTop={2}>
          <Button
            variant="utility"
            size="small"
            icon="download"
            iconType="outline"
            loading={downloadingPdf}
            disabled={downloadingPdf}
            onClick={() => void handleDownloadPdf()}
          >
            {formatMessage(
              messages.equalityReport.previousEqualityPlan.pdfDownload,
            )}
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <HTMLEditor
        value={content ?? ('' as HTMLText)}
        readOnly
        fileUploader={() => Promise.resolve({} as unknown)}
        hideWarnings
        config={{ toolbar: false }}
      />
    </Box>
  )
}

export default PreviousEqualityPlan
