import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  Divider,
  Input,
  Select,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  InlineLink,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import ConversationAvatar from './components/ConversationAvatar'
import ConversationAvailabilityAlert from './components/ConversationAvailabilityAlert'
import ConversationTermsModal from './components/ConversationTermsModal'
import CertificateRequestForm, {
  CertificateFormState,
  emptyCertificateFormState,
} from './components/CertificateRequestForm'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { LocaleEnum } from '@island.is/portals/my-pages/graphql'
import { getMessagingWindowInfo } from './utils/messagingWindow'
import {
  useGetHealthConversationRecipientsForNewQuery,
  useCreateHealthConversationMutation,
  useCreateHealthCertificateRequestMutation,
} from './NewHealthConversation.generated'

const NewHealthConversation = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const userInfo = useUserInfo()

  const [selectedTypeCode, setSelectedTypeCode] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [certificateForm, setCertificateForm] = useState<CertificateFormState>(
    emptyCertificateFormState,
  )
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [termsModalOpen, setTermsModalOpen] = useState(false)

  const { data, loading, error } =
    useGetHealthConversationRecipientsForNewQuery({
      variables: { locale: lang === 'en' ? LocaleEnum.En : LocaleEnum.Is },
    })

  const [createMessage, { loading: sending }] =
    useCreateHealthConversationMutation({
      refetchQueries: ['GetHealthConversations'],
    })

  const [createCertificateRequest, { loading: sendingCertificate }] =
    useCreateHealthCertificateRequestMutation({
      refetchQueries: ['GetHealthConversations'],
    })

  const recipients = data?.healthDirectorateHealthConversationRecipients
  const recipient =
    recipients?.find((r) => r.allowsMessaging) ?? recipients?.[0]

  const typeOptions =
    recipient?.allowedMessageTypes.map((t) => ({
      label: t.title,
      value: t.patientInitiatedTypeCode,
      disabled: t.isCertificate && recipient.canRequestCertificate === false,
    })) ?? []

  const selectedOption =
    typeOptions.find((o) => o.value === selectedTypeCode) ?? null

  const selectedType = recipient?.allowedMessageTypes.find(
    (t) => t.patientInitiatedTypeCode === selectedTypeCode,
  )
  const isCertificateSelected = !!selectedType?.isCertificate

  const windowInfo = getMessagingWindowInfo({
    windowOpen: recipient?.messagingWindowOpen,
    windowClose: recipient?.messagingWindowClose,
  })

  const hasWindowInfo =
    !!windowInfo.windowOpenLabel &&
    !!windowInfo.windowCloseLabel &&
    !!recipient?.patientReplyWindowDays

  const introText = hasWindowInfo
    ? formatMessage(messages.healthConversationsNewIntroWithWindow, {
        openTime: windowInfo.windowOpenLabel,
        closeTime: windowInfo.windowCloseLabel,
        days: recipient?.patientReplyWindowDays,
      })
    : formatMessage(messages.healthConversationsNewIntro)

  const isFormLocked = recipient?.canCreateConversation === false

  const isFormValid = isCertificateSelected
    ? !!certificateForm.certificateType &&
      !!certificateForm.recipientName.trim() &&
      !!certificateForm.startDate &&
      !!certificateForm.endDate &&
      termsAccepted
    : !!selectedTypeCode && !!messageText.trim() && termsAccepted

  const sendingAny = sending || sendingCertificate

  const canSubmit = isFormValid && !sendingAny && !isFormLocked

  const handleTypeChange = (typeCode: string | null) => {
    setSelectedTypeCode(typeCode)
    setMessageText('')
    setCertificateForm(emptyCertificateFormState)
  }

  const handleSubmit = async () => {
    if (!canSubmit || !recipient || !selectedTypeCode || !selectedType) return

    try {
      if (isCertificateSelected) {
        if (
          !certificateForm.certificateType ||
          !certificateForm.startDate ||
          !certificateForm.endDate
        ) {
          return
        }
        const result = await createCertificateRequest({
          variables: {
            input: {
              nodeId: recipient.nodeId,
              groupId: recipient.groupId,
              certificateType: certificateForm.certificateType,
              recipientName: certificateForm.recipientName.trim(),
              startDate: certificateForm.startDate,
              endDate: certificateForm.endDate,
              note: certificateForm.note.trim() || undefined,
            },
          },
        })
        const conversationId =
          result.data?.healthDirectorateCreateCertificateRequest
            ?.conversationId
        if (conversationId) {
          navigate(
            HealthPaths.HealthConversationsDetail.replace(
              ':id',
              conversationId,
            ),
            { state: { justCreated: true } },
          )
        } else {
          navigate(HealthPaths.HealthConversations)
        }
        return
      }

      const result = await createMessage({
        variables: {
          input: {
            nodeId: recipient.nodeId,
            groupId: recipient.groupId,
            patientInitiatedTypeCode: selectedTypeCode,
            title: selectedType.title,
            messageTextContent: messageText.trim(),
          },
        },
      })
      const id = result.data?.healthDirectorateCreateHealthConversation?.id
      if (id) {
        navigate(HealthPaths.HealthConversationsDetail.replace(':id', id), {
          state: { justCreated: true },
        })
      } else {
        navigate(HealthPaths.HealthConversations)
      }
    } catch {
      toast.error(formatMessage(m.errorTitle))
    }
  }

  return (
    <IntroWrapper
      title={messages.healthConversationsNewTitle}
      intro={introText}
      desktopContentSpan="10/12"
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && !recipient && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.healthConversationsNoRecipient)}
        />
      )}
      {!loading && !error && recipient && (
        <ConversationAvailabilityAlert recipient={recipient} />
      )}
      {!loading && !error && recipient && (
        <Box
          background="white"
          borderColor="blue200"
          borderWidth="standard"
          borderRadius="large"
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            columnGap={2}
            paddingX={4}
            paddingY={3}
          >
            <ConversationAvatar
              variant="user"
              name={userInfo.profile.name ?? ''}
            />
            <Box>
              <Text variant="medium">
                {formatMessage(messages.healthConversationTo, {
                  arg: recipient?.name ?? '',
                })}
              </Text>
              <Text fontWeight="semiBold">
                {formatMessage(messages.healthConversationsCreate)}
              </Text>
            </Box>
          </Box>

          <Divider />

          <Box paddingX={4} paddingY={4}>
            <Box marginBottom={3}>
              <Select
                name="service-type"
                label={formatMessage(
                  messages.healthConversationsNewSelectService,
                )}
                placeholder={formatMessage(
                  messages.healthConversationsNewSelectServicePlaceholder,
                )}
                options={typeOptions}
                value={selectedOption}
                onChange={(opt) => handleTypeChange(opt?.value ?? null)}
                backgroundColor="blue"
                size="sm"
                required
                isDisabled={isFormLocked}
              />
            </Box>

            {isCertificateSelected &&
              recipient.canRequestCertificate === false && (
                <Box marginBottom={3}>
                  <AlertMessage
                    type="warning"
                    message={formatMessage(
                      messages.healthConversationsCertificateBlockedText,
                    )}
                  />
                </Box>
              )}

            {isCertificateSelected ? (
              <CertificateRequestForm
                formState={certificateForm}
                setFormState={setCertificateForm}
                disabled={isFormLocked}
              />
            ) : (
              <Box marginBottom={3}>
                <Input
                  textarea
                  rows={8}
                  name="message-body"
                  label={formatMessage(m.messages)}
                  placeholder={formatMessage(
                    messages.healthConversationsNewBodyPlaceholder,
                  )}
                  backgroundColor="blue"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={isFormLocked}
                />
              </Box>
            )}

            <Box marginBottom={4}>
              <Checkbox
                id="terms-accept"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                label={formatMessage(
                  messages.healthConversationsNewTermsLabel,
                  {
                    link: (str: React.ReactNode) => (
                      <InlineLink onClick={() => setTermsModalOpen(true)}>
                        {str}
                      </InlineLink>
                    ),
                  },
                )}
                disabled={isFormLocked}
              />
            </Box>
            <Box display="flex" justifyContent="spaceBetween" columnGap={2}>
              <Button
                variant="ghost"
                onClick={() => navigate(HealthPaths.HealthConversations)}
              >
                {formatMessage(messages.cancel)}
              </Button>
              <Button
                onClick={handleSubmit}
                loading={sendingAny}
                disabled={!canSubmit}
              >
                {formatMessage(messages.healthConversationSend)}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      <ConversationTermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </IntroWrapper>
  )
}

export default NewHealthConversation
