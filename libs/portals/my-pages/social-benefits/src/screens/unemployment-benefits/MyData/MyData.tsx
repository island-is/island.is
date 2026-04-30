import { IntroWrapperV2, UserInfoLine } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import {
  useGetApplicantAvailableActionsQuery,
  useGetApplicantRequestedAttachmentsQuery,
  useGetAttachmentTypesQuery,
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

const MyData = () => {
  useNamespaces('sp.social-benefits-unemployment')
  const { formatMessage } = useLocale()

  const { data: actionsData, loading: actionsLoading } =
    useGetApplicantAvailableActionsQuery()

  const { data: attachmentsData, loading: attachmentsLoading } =
    useGetApplicantRequestedAttachmentsQuery()

  const { data: attachmentTypesData, loading: attachmentTypesLoading } =
    useGetAttachmentTypesQuery()

  const availableActions = actionsData?.vmstApplicantAvailableActions
  const requestedAttachments =
    attachmentsData?.vmstApplicantRequestedAttachments
  const attachmentTypes =
    attachmentTypesData?.vmstAttachmentTypes?.attachmentTypes

  const loading = actionsLoading || attachmentsLoading || attachmentTypesLoading

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

  return (
    <IntroWrapperV2
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
      {!loading && missingAttachments.length > 0 && (
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
                    url: 'https://island.is/umsoknir/breyta-upplysingum-atvinnuleysisbaetur',
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
      {!loading && submittedAttachments.length > 0 && (
        <Box paddingTop={4}>
          <Text variant="eyebrow" color="purple600" marginBottom={2}>
            {formatMessage(um.myDataSubmittedAttachmentsHeading)}
          </Text>
          <Stack space={0}>
            {submittedAttachments.map((attachment, index) => (
              <Box key={attachment.id ?? index}>
                <UserInfoLine
                  label={getAttachmentName(attachment.attachmentTypeId)}
                  editLink={{
                    // TODO This is incomplete and will be finished when we get document data from Galdur
                    url: '',
                    title: formatMessage(um.myDataViewDocument),
                    icon: 'arrowForward',
                  }}
                />
                <Divider />
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </IntroWrapperV2>
  )
}

export default MyData
