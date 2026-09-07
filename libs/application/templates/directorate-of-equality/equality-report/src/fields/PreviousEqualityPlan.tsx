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
  data?: { equalityReportContent?: string } | null
  reason?: unknown
}

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

  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  useEffect(() => {
    const cached = getValueViaPath<string>(
      application.externalData,
      'previousEqualityReportContent.data.equalityReportContent',
    )
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

  return (
    <Box>
      <Box display="flex" justifyContent="flexEnd" marginBottom={2}>
        <Button
          variant="utility"
          size="small"
          icon="copy"
          iconType="outline"
          onClick={() => void handleCopy()}
          disabled={!content}
        >
          {formatMessage(
            messages.equalityReport.previousEqualityPlan.copyButton,
          )}
        </Button>
      </Box>
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
