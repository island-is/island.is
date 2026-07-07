import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { HTMLEditor } from '../components/html-editor/HTMLEditor'
import { HTMLText } from '@dmr.is/regulations-tools/types'
import { Box, Button, SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../lib/messages'
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { useIntl } from 'react-intl'
import { toast } from '@island.is/island-ui/core'
import { ApiActions } from '../utils/constants'

export const PreviousEqualityPlan = ({ application }: FieldBaseProps) => {
  const { locale } = useLocale()
  const { formatMessage } = useIntl()
  const [content, setContent] = useState<HTMLText | null>(null)
  const [loading, setLoading] = useState(false)

  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  useEffect(() => {
    const cached = getValueViaPath<string>(
      application.externalData,
      'previousEqualityReportContent.data.equalityReportContent',
    )
    if (cached !== undefined && cached !== null) {
      setContent(cached as HTMLText)
      return
    }

    setLoading(true)
    updateApplicationExternalData({
      variables: {
        input: {
          id: application.id,
          dataProviders: [
            {
              actionId: ApiActions.getPreviousEqualityReportContent,
              order: 0,
            },
          ],
        },
        locale,
      },
    })
      .then((res) => {
        const html =
          res.data?.updateApplicationExternalData?.externalData
            ?.previousEqualityReportContent?.data?.equalityReportContent
        setContent((html ?? '') as HTMLText)
      })
      .catch(() => {
        toast.error(
          formatMessage(messages.equalityReport.information.editorUploadError),
        )
        setContent('' as HTMLText)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleCopy = () => {
    if (!content) return
    const plain = content.replace(/<[^>]*>/g, '').trim()
    navigator.clipboard.writeText(plain).then(() => {
      toast.success(
        formatMessage(messages.equalityReport.previousEqualityPlan.copied),
      )
    })
  }

  if (loading) {
    return <SkeletonLoader height={300} />
  }

  // TODO: GET THIS TO WORK
  return (
    <Box>
      <Box display="flex" justifyContent="flexEnd" marginBottom={2}>
        <Button
          variant="utility"
          size="small"
          icon="copy"
          iconType="outline"
          onClick={handleCopy}
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
      />
    </Box>
  )
}

export default PreviousEqualityPlan
