import {
  AlertMessage,
  AlertMessageType,
  Box,
  Checkbox,
  GridColumn,
  GridRow,
  Hidden,
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
  useIsPhoneWidth,
} from '@island.is/portals/my-pages/core'
import ConversationAvailabilityAlert from './components/ConversationAvailabilityAlert'
import ConversationBackButton from './components/ConversationBackButton'
import ConversationCancelSubmit from './components/ConversationCancelSubmit'
import ConversationMobileBackHeader from './components/ConversationMobileBackHeader'
import ConversationTermsModal from './components/ConversationTermsModal'
import MobileActionFooter from './components/MobileActionFooter'
import CertificateRequestForm, {
  CertificateFormState,
  toCertificateRequestInput,
} from './components/CertificateRequestForm'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { LocaleEnum } from '@island.is/portals/my-pages/graphql'
import { getMessagingWindowInfo } from './utils/messagingWindow'
import { HealthDirectorateHealthConversationRecipientBlockedReason } from '@island.is/api/schema'
import * as styles from './HealthConversations.css'
import {
  useGetHealthConversationRecipientsForNewQuery,
  useCreateHealthConversationMutation,
  useCreateHealthCertificateRequestMutation,
} from './NewHealthConversation.generated'

interface CertificateAlert {
  type: AlertMessageType
  title?: string
  message?: string
}

const getRecipientKey = (recipient: { nodeId: string; groupId: number }) =>
  `${recipient.nodeId}-${recipient.groupId}`

const MAX_MESSAGE_LENGTH = 300

const NewHealthConversation = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const { isPhoneWidth } = useIsPhoneWidth()

  const [selectedRecipientKey, setSelectedRecipientKey] = useState<
    string | null
  >(null)
  const [selectedTypeCode, setSelectedTypeCode] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const [messageText, setMessageText] = useState('')
  const [certificateForm, setCertificateForm] = useState<CertificateFormState>(
    {},
  )
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [termsModalOpen, setTermsModalOpen] = useState(false)

  const { data, loading, error } =
    useGetHealthConversationRecipientsForNewQuery({
      fetchPolicy: 'cache-and-network',
      variables: { locale: lang === 'en' ? LocaleEnum.En : LocaleEnum.Is },
    })

  const initialLoading = loading && !data

  const [createMessage, { loading: sending }] =
    useCreateHealthConversationMutation({
      refetchQueries: ['GetHealthConversations'],
    })

  const [createCertificateRequest, { loading: sendingCertificate }] =
    useCreateHealthCertificateRequestMutation({
      refetchQueries: ['GetHealthConversations'],
    })

  const recipients = data?.healthDirectorateHealthConversationRecipients
  const hasRecipients = !!recipients?.length
  const hasMultipleRecipients = (recipients?.length ?? 0) > 1

  const recipientOptions =
    recipients?.map((r) => ({
      label: r.name,
      value: getRecipientKey(r),
    })) ?? []

  const preselectedNode = searchParams.get('node')
  const nodeMatches = preselectedNode
    ? recipients?.filter((r) => r.nodeId === preselectedNode)
    : undefined
  const nodeMatchKey =
    nodeMatches?.length === 1 ? getRecipientKey(nodeMatches[0]) : null

  const effectiveRecipientKey =
    selectedRecipientKey ??
    nodeMatchKey ??
    (recipients?.length === 1 ? getRecipientKey(recipients[0]) : null)

  const recipient = recipients?.find(
    (r) => getRecipientKey(r) === effectiveRecipientKey,
  )

  const selectedRecipientOption =
    recipientOptions.find((o) => o.value === effectiveRecipientKey) ?? null

  const typeOptions =
    recipient?.allowedMessageTypes.map((t) => ({
      label: t.title,
      value: t.patientInitiatedTypeCode,
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
    recipient?.patientReplyWindowDays !== undefined

  const introText = recipient
    ? hasWindowInfo
      ? formatMessage(messages.healthConversationsNewIntroWithWindow, {
          name: recipient.name,
          openTime: windowInfo.windowOpenLabel,
          closeTime: windowInfo.windowCloseLabel,
          days: recipient.patientReplyWindowDays,
        })
      : formatMessage(messages.healthConversationsNewIntroWithRecipient, {
          name: recipient.name,
        })
    : formatMessage(messages.healthConversationsNewIntro)

  const isCertificateBlocked =
    isCertificateSelected && recipient?.canRequestCertificate === false

  const isConversationBlocked = recipient?.canCreateConversation === false

  const certificateBlockedOutsideWindow =
    recipient?.certificateBlockedReason ===
      HealthDirectorateHealthConversationRecipientBlockedReason.OUTSIDE_MESSAGING_WINDOW &&
    !!windowInfo.windowOpenLabel &&
    !!windowInfo.windowCloseLabel

  const isFormLocked = isConversationBlocked || isCertificateBlocked

  const certificateAlert: CertificateAlert | undefined = !isCertificateBlocked
    ? undefined
    : certificateBlockedOutsideWindow
    ? {
        type: 'info',
        title: formatMessage(messages.healthConversationClosedTitle),
        message: formatMessage(messages.healthConversationClosedText, {
          currentTime: windowInfo.currentTimeLabel,
          openTime: windowInfo.windowOpenLabel,
          closeTime: windowInfo.windowCloseLabel,
        }),
      }
    : {
        type: 'warning',
        message: formatMessage(
          messages.healthConversationsCertificateBlockedText,
        ),
      }

  const certificateInput = toCertificateRequestInput(certificateForm)

  const isFormValid = isCertificateSelected
    ? !!certificateInput && termsAccepted
    : !!selectedTypeCode && !!messageText.trim() && termsAccepted

  const sendingAny = sending || sendingCertificate

  const canSubmit = isFormValid && !sendingAny && !isFormLocked

  const handleTypeChange = (typeCode: string | null) => {
    const newType = recipient?.allowedMessageTypes.find(
      (t) => t.patientInitiatedTypeCode === typeCode,
    )

    setSelectedTypeCode(typeCode)
    setCertificateForm({})
    if (newType?.isCertificate) {
      setMessageText('')
    }
  }

  const handleRecipientChange = (recipientKey: string | null) => {
    setSelectedRecipientKey(recipientKey)

    const newRecipient = recipients?.find(
      (r) => getRecipientKey(r) === recipientKey,
    )
    const typeStillAllowed = newRecipient?.allowedMessageTypes.some(
      (t) => t.patientInitiatedTypeCode === selectedTypeCode,
    )

    if (!typeStillAllowed) {
      handleTypeChange(null)
    }
  }

  const goToConversation = (conversationId?: string | null) => {
    if (conversationId) {
      navigate(
        HealthPaths.HealthConversationsDetail.replace(':id', conversationId),
      )
    } else {
      navigate(HealthPaths.HealthConversations)
    }
  }

  const handleSubmit = async () => {
    if (!canSubmit || !recipient || !selectedTypeCode || !selectedType) return

    try {
      if (isCertificateSelected) {
        if (!certificateInput) return
        const result = await createCertificateRequest({
          variables: {
            input: {
              nodeId: recipient.nodeId,
              groupId: recipient.groupId,
              ...certificateInput,
            },
          },
        })
        const certificateRequest =
          result.data?.healthDirectorateCreateCertificateRequest
        if (!certificateRequest) {
          toast.error(formatMessage(m.errorTitle))
          return
        }
        goToConversation(certificateRequest.conversationId)
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
      goToConversation(
        result.data?.healthDirectorateCreateHealthConversation?.id,
      )
    } catch {
      toast.error(formatMessage(m.errorTitle))
    }
  }

  return (
    <Box marginTop={[1, 0, 0]}>
      <ConversationMobileBackHeader
        onClick={() => navigate(HealthPaths.HealthConversations)}
      />
      <IntroWrapper
        title={messages.healthConversationsNewTitle}
        intro={introText}
        desktopContentSpan="10/12"
      >
        {initialLoading && <CardLoader />}
        {error && <Problem error={error} noBorder={false} />}
        {!initialLoading && !error && !hasRecipients && (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(messages.healthConversationsNoRecipient)}
          />
        )}
        {!initialLoading && !error && recipient && (
          <ConversationAvailabilityAlert recipient={recipient} />
        )}
        {!initialLoading && !error && hasRecipients && (
          <Box className={styles.messageCard} background="white">
            <Hidden below="sm">
              <Box
                paddingX={[0, 5, 5]}
                paddingTop={[2, 3, 3]}
                className={styles.backButton}
              >
                <ConversationBackButton
                  onClick={() => navigate(HealthPaths.HealthConversations)}
                />
              </Box>
            </Hidden>
            <Box paddingX={[0, 5, 5]} paddingTop={1}>
              <Text variant="h4" fontWeight="semiBold">
                {formatMessage(messages.healthConversationsCreate)}
              </Text>
              {!hasMultipleRecipients && recipient && (
                <Text variant="medium">
                  {formatMessage(messages.healthConversationTo, {
                    arg: recipient.name,
                  })}
                </Text>
              )}
            </Box>

            <Box
              paddingX={[0, 5, 5]}
              paddingTop={[3, 3, 4]}
              paddingBottom={[10, 5, 5]}
            >
              <GridRow marginBottom={3}>
                {hasMultipleRecipients && (
                  <GridColumn
                    span={['12/12', '6/12']}
                    paddingBottom={[2, 0, 0]}
                  >
                    <Select
                      name="recipient"
                      label={formatMessage(
                        messages.healthConversationsNewSelectRecipient,
                      )}
                      placeholder={formatMessage(
                        messages.healthConversationsNewSelectRecipientPlaceholder,
                      )}
                      options={recipientOptions}
                      value={selectedRecipientOption}
                      onChange={(opt) =>
                        handleRecipientChange(opt?.value ?? null)
                      }
                      backgroundColor="blue"
                      size="sm"
                      required
                    />
                  </GridColumn>
                )}
                <GridColumn
                  span={
                    hasMultipleRecipients
                      ? ['12/12', '6/12']
                      : ['12/12', '8/12']
                  }
                >
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
                    isDisabled={!recipient || isConversationBlocked}
                  />
                </GridColumn>
              </GridRow>

              {certificateAlert && (
                <Box marginBottom={3}>
                  <AlertMessage
                    type={certificateAlert.type}
                    title={certificateAlert.title}
                    message={certificateAlert.message}
                  />
                </Box>
              )}

              {isCertificateSelected ? (
                <CertificateRequestForm
                  formState={certificateForm}
                  onChange={(patch) =>
                    setCertificateForm((state) => ({ ...state, ...patch }))
                  }
                  disabled={isFormLocked}
                  hidePaymentNotice={isCertificateBlocked}
                />
              ) : (
                <Box>
                  <Input
                    textarea
                    rows={8}
                    name="message-body"
                    label={`${formatMessage(m.messages)} (${
                      messageText.length
                    }/${MAX_MESSAGE_LENGTH})`}
                    placeholder={formatMessage(
                      messages.healthConversationsNewBodyPlaceholder,
                    )}
                    backgroundColor="blue"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    maxLength={MAX_MESSAGE_LENGTH}
                    disabled={isFormLocked}
                  />
                </Box>
              )}

              <Box marginTop={4} marginBottom={4}>
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

              <MobileActionFooter>
                <ConversationCancelSubmit
                  cancelLabel={formatMessage(messages.cancel)}
                  submitLabel={formatMessage(messages.healthConversationSend)}
                  onCancel={() => navigate(HealthPaths.HealthConversations)}
                  onSubmit={handleSubmit}
                  submitDisabled={!canSubmit}
                  loading={sendingAny}
                  fluid={isPhoneWidth}
                />
              </MobileActionFooter>
            </Box>
          </Box>
        )}
        <ConversationTermsModal
          isOpen={termsModalOpen}
          onClose={() => setTermsModalOpen(false)}
        />
      </IntroWrapper>
    </Box>
  )
}

export default NewHealthConversation
