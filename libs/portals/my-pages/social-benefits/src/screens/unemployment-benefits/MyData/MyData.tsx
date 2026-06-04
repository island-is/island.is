import {
  IntroWrapper,
  UserInfoLine,
  formSubmit,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import {
  useGetApplicantAvailableActionsQuery,
  useGetApplicantRequestedAttachmentsQuery,
  useGetApplicantAttachmentsQuery,
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
import { Problem } from '@island.is/react-spa/shared'

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

  const coreLoading = actionsLoading || attachmentTypesLoading
  const requestedLoading = coreLoading || attachmentsLoading
  const submittedLoading = coreLoading || applicantAttachmentsLoading

  const requestedAttachmentsHasError = !!attachmentsError
  const submittedAttachmentsHasError = !!applicantAttachmentsError

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

  return (
    <IntroWrapper
      title={formatMessage(um.myDataTitle)}
      intro={formatMessage(um.myDataIntro)}
      serviceProvider={{
        slug: 'vinnumalastofnun',
        tooltip: formatMessage(um.tooltip),
      }}
      loading={coreLoading}
    >
      <ActionButtons
        availableActions={availableActions}
        loading={coreLoading}
      />
      {!coreLoading && !!attachmentTypesError && (
        <Box paddingTop={4}>
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(coreMessages.noData)}
            message={formatMessage(coreMessages.noDataFoundDetail)}
            imgSrc="./assets/images/sofa.svg"
          />
        </Box>
      )}
      {!attachmentTypesError && (
        <>
          {/* Missing / requested attachments section */}
          <Box paddingTop={4}>
            <Text variant="eyebrow" color="purple600" marginBottom={2}>
              {formatMessage(um.myDataMissingAttachmentsHeading)}
            </Text>
            {requestedLoading && <SkeletonLoader repeat={3} space={2} />}
            {!requestedLoading && requestedAttachmentsHasError && (
              <Problem type="no_data" noBorder={false} />
            )}
            {!requestedLoading &&
              !requestedAttachmentsHasError &&
              missingAttachments.length > 0 && (
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
              )}
          </Box>

          {/* Submitted attachments section */}
          <Box paddingTop={4}>
            <Text variant="eyebrow" color="purple600" marginBottom={2}>
              {formatMessage(um.myDataSubmittedAttachmentsHeading)}
            </Text>
            {submittedLoading && <SkeletonLoader repeat={3} space={2} />}
            {!submittedLoading && submittedAttachmentsHasError && (
              <Problem type="no_data" noBorder={false} />
            )}
            {!submittedLoading &&
              !submittedAttachmentsHasError &&
              submittedAttachments.length > 0 && (
                <Stack space={0}>
                  {submittedAttachments.map((attachment) => (
                    <Box key={attachment.id}>
                      <UserInfoLine
                        label={
                          getAttachmentName(attachment.typeId) ||
                          attachment.name
                        }
                        button={
                          attachment.downloadServiceUrl
                            ? {
                                title: formatMessage(um.myDataViewDocument),
                                icon: 'arrowForward',
                                onClick: () => {
                                  if (attachment.downloadServiceUrl) {
                                    formSubmit(attachment.downloadServiceUrl)
                                  }
                                },
                              }
                            : undefined
                        }
                      />
                      <Divider />
                    </Box>
                  ))}
                </Stack>
              )}
          </Box>
        </>
      )}
    </IntroWrapper>
  )
}

export default MyData
