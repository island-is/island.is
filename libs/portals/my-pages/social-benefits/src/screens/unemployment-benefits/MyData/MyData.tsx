import { IntroWrapper, UserInfoLine } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import {
  useGetApplicantAvailableActionsQuery,
  useGetApplicantRequestedAttachmentsQuery,
  useGetApplicantAttachmentsQuery,
  useGetAttachmentTypesQuery,
  useGetAttachmentLazyQuery,
} from './MyData.generated'
import {
  Box,
  Divider,
  SkeletonLoader,
  Stack,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionButtons } from '../components/ActionButtons'
import { Problem } from '@island.is/react-spa/shared'
import { useCallback, useState } from 'react'

const VIEWABLE_CONTENT_TYPES = ['application/pdf', 'image/png', 'image/jpeg']

const base64ToBlob = (data: string, contentType: string): Blob => {
  const byteCharacters = atob(data)
  const byteNumbers = new Uint8Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  return new Blob([byteNumbers], { type: contentType })
}

const MyData = () => {
  useNamespaces('sp.social-benefits-unemployment')
  const { formatMessage } = useLocale()

  const { data: actionsData, loading: actionsLoading } =
    useGetApplicantAvailableActionsQuery()

  const {
    data: attachmentsData,
    loading: attachmentsLoading,
    error: attachmentsError,
  } = useGetApplicantRequestedAttachmentsQuery()

  const {
    data: attachmentTypesData,
    loading: attachmentTypesLoading,
    error: attachmentTypesError,
  } = useGetAttachmentTypesQuery()

  const {
    data: applicantAttachmentsData,
    loading: applicantAttachmentsLoading,
    error: applicantAttachmentsError,
  } = useGetApplicantAttachmentsQuery()

  const availableActions = actionsData?.vmstApplicantAvailableActions
  const requestedAttachments =
    attachmentsData?.vmstApplicantRequestedAttachments
  const attachmentTypes =
    attachmentTypesData?.vmstAttachmentTypes?.attachmentTypes

  const loading =
    actionsLoading ||
    attachmentsLoading ||
    attachmentTypesLoading ||
    applicantAttachmentsLoading
  const attachmentsHasError =
    !!attachmentsError || !!attachmentTypesError || !!applicantAttachmentsError

  const attachmentTypeMap = new Map(
    attachmentTypes?.map((t) => [t.id, t]) ?? [],
  )

  const missingAttachments =
    requestedAttachments?.filter((a) => !a.attachmentId) ?? []

  const submittedAttachments =
    applicantAttachmentsData?.vmstApplicantAttachments ?? []

  const getAttachmentName = (attachmentTypeId?: string | null) => {
    if (!attachmentTypeId) return ''
    const type = attachmentTypeMap.get(attachmentTypeId)
    return type?.name ?? ''
  }

  const [fetchAttachment] = useGetAttachmentLazyQuery({
    fetchPolicy: 'no-cache',
  })

  const [loadingAttachmentId, setLoadingAttachmentId] = useState<string | null>(
    null,
  )

  const openAttachment = useCallback(
    (attachmentId: string) => {
      if (loadingAttachmentId) return
      setLoadingAttachmentId(attachmentId)

      fetchAttachment({
        variables: { id: attachmentId },
        onCompleted: (result) => {
          try {
            const attachment = result.vmstAttachment
            if (!attachment.data) return

            const blob = base64ToBlob(attachment.data, attachment.contentType)
            const blobUrl = URL.createObjectURL(blob)

            if (VIEWABLE_CONTENT_TYPES.includes(attachment.contentType)) {
              window.open(blobUrl, '_blank')
              setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
            } else {
              const link = document.createElement('a')
              link.href = blobUrl
              link.download = attachment.name
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(blobUrl)
            }
          } catch {
            toast.error(formatMessage(um.myDataAttachmentError))
          } finally {
            setLoadingAttachmentId(null)
          }
        },
        onError: () => {
          toast.error(formatMessage(um.myDataAttachmentError))
          setLoadingAttachmentId(null)
        },
      })
    },
    [fetchAttachment, formatMessage, loadingAttachmentId],
  )

  return (
    <IntroWrapper
      title={formatMessage(um.myDataTitle)}
      intro={formatMessage(um.myDataIntro)}
      serviceProvider={{
        slug: 'vinnumalastofnun',
        tooltip: formatMessage(um.tooltip),
      }}
      loading={loading}
    >
      <ActionButtons availableActions={availableActions} loading={loading} />
      {loading && (
        <Box paddingTop={4}>
          <SkeletonLoader repeat={5} space={2} />
        </Box>
      )}
      {!loading && attachmentsHasError && (
        <Box paddingTop={4}>
          <Problem type="no_data" noBorder={false} />
        </Box>
      )}
      {!loading && !attachmentsHasError && missingAttachments.length > 0 && (
        <Box paddingTop={4}>
          <Text variant="eyebrow" color="purple600" marginBottom={2}>
            {formatMessage(um.myDataMissingAttachmentsHeading)}
          </Text>
          <Stack space={0}>
            {missingAttachments.map((attachment, index) => (
              <Box key={attachment.id ?? index}>
                <UserInfoLine
                  label={getAttachmentName(attachment.attachmentTypeId)}
                  renderContent={() => (
                    <Tag variant="red" outlined disabled>
                      {formatMessage(um.myDataMissingTag)}
                    </Tag>
                  )}
                  editLink={{
                    url: formatMessage(um.myDataSubmitDocumentsUrl),
                    title: formatMessage(um.myDataSubmitDocuments),
                    icon: 'arrowForward',
                  }}
                />
                <Divider />
              </Box>
            ))}
          </Stack>
        </Box>
      )}
      {!loading && !attachmentsHasError && submittedAttachments.length > 0 && (
        <Box paddingTop={4}>
          <Text variant="eyebrow" color="purple600" marginBottom={2}>
            {formatMessage(um.myDataSubmittedAttachmentsHeading)}
          </Text>
          <Stack space={0}>
            {submittedAttachments.map((attachment) => (
              <Box key={attachment.id}>
                <UserInfoLine
                  label={getAttachmentName(attachment.typeId)}
                  button={{
                    title: formatMessage(um.myDataViewDocument),
                    onClick: () => {
                      openAttachment(attachment.id)
                    },
                  }}
                />
                <Divider />
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </IntroWrapper>
  )
}

export default MyData
