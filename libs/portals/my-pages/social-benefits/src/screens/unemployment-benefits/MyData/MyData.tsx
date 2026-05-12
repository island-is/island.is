import { IntroWrapper, UserInfoLine } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import {
  useGetApplicantAvailableActionsQuery,
  useGetApplicantRequestedAttachmentsQuery,
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
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionButtons } from '../components/ActionButtons'
import { Problem } from '@island.is/react-spa/shared'
import { useCallback } from 'react'

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

  const availableActions = actionsData?.vmstApplicantAvailableActions
  const requestedAttachments =
    attachmentsData?.vmstApplicantRequestedAttachments
  const attachmentTypes =
    attachmentTypesData?.vmstAttachmentTypes?.attachmentTypes

  const loading = actionsLoading || attachmentsLoading || attachmentTypesLoading
  const attachmentsHasError = !!attachmentsError || !!attachmentTypesError

  const attachmentTypeMap = new Map(
    attachmentTypes?.map((t) => [t.id, t]) ?? [],
  )

  const missingAttachments =
    requestedAttachments?.filter((a) => !a.attachmentId) ?? []
  const submittedAttachments =
    requestedAttachments?.filter((a) => a.attachmentId) ?? []

  const getAttachmentName = (attachmentTypeId?: string | null) => {
    if (!attachmentTypeId) return ''
    const type = attachmentTypeMap.get(attachmentTypeId)
    return type?.name ?? ''
  }

  const [fetchAttachment] = useGetAttachmentLazyQuery({
    fetchPolicy: 'no-cache',
  })

  const openAttachment = useCallback(
    (attachmentId: string) => {
      fetchAttachment({
        variables: { id: attachmentId },
        onCompleted: (result) => {
          const attachment = result.vmstAttachment
          if (!attachment.data) return

          const byteCharacters = atob(attachment.data)
          const byteNumbers = new Uint8Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const blob = new Blob([byteNumbers], {
            type: attachment.contentType,
          })
          const blobUrl = URL.createObjectURL(blob)

          const viewableTypes = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'image/heic',
          ]

          if (viewableTypes.includes(attachment.contentType)) {
            window.open(blobUrl, '_blank')
          } else {
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = attachment.name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(blobUrl)
          }
        },
      })
    },
    [fetchAttachment],
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
            {submittedAttachments.map((attachment, index) => (
              <Box key={attachment.id ?? index}>
                <UserInfoLine
                  label={getAttachmentName(attachment.attachmentTypeId)}
                  button={{
                    title: formatMessage(um.myDataViewDocument),
                    onClick: () => {
                      if (attachment.attachmentId) {
                        openAttachment(attachment.attachmentId)
                      }
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
