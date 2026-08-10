import {
  AlertMessage,
  AlertMessageType,
  Box,
  Button,
  Checkbox,
  GridColumn,
  GridRow,
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
import ConversationAvailabilityAlert from './components/ConversationAvailabilityAlert'
import ConversationTermsModal from './components/ConversationTermsModal'
import CertificateRequestForm, {
  CertificateFormState,
  emptyCertificateFormState,
} from './components/CertificateRequestForm'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

const NewHealthConversation = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()

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

  const isCertificateBlocked =
    isCertificateSelected && recipient?.canRequestCertificate === false

  const isFormLocked =
    recipient?.canCreateConversation === false || isCertificateBlocked

  const certificateAlert: CertificateAlert | undefined = isCertificateBlocked
    ? recipient?.certificateBlockedReason ===
        HealthDirectorateHealthConversationRecipientBlockedReason.OUTSIDE_MESSAGING_WINDOW &&
      windowInfo.windowOpenLabel &&
      windowInfo.windowCloseLabel
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
    : undefined

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
          result.data?.healthDirectorateCreateCertificateRequest?.conversationId
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
      desktopContentSpan="12/12"
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12', '10/12']}>
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
            <Box className={styles.messageCard} background="white">
              <Box
                paddingX={[2, 2, 5]}
                paddingTop={[2, 2, 3]}
                className={styles.backButton}
              >
                <Button
                  variant="text"
                  icon="arrowBack"
                  size="default"
                  colorScheme="light"
                  aria-label={formatMessage(m.goBack)}
                  onClick={() => navigate(HealthPaths.HealthConversations)}
                />
              </Box>
              <Box paddingX={[2, 2, 5]} paddingTop={1}>
                <Text variant="h4" fontWeight="semiBold">
                  {formatMessage(messages.healthConversationsCreate)}
                </Text>
                <Text variant="medium">
                  {formatMessage(messages.healthConversationTo, {
                    arg: recipient?.name ?? '',
                  })}
                </Text>
              </Box>

              <Box
                paddingX={[2, 2, 5]}
                paddingTop={[3, 3, 4]}
                paddingBottom={[2, 2, 5]}
              >
                <GridRow marginBottom={3}>
                  <GridColumn span={['12/12', '8/12']}>
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
                    setFormState={setCertificateForm}
                    disabled={isFormLocked}
                  />
                ) : (
                  <Box>
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
                <Box display="flex" justifyContent="spaceBetween" columnGap={2}>
                  <Button
                    variant="ghost"
                    size="medium"
                    onClick={() => navigate(HealthPaths.HealthConversations)}
                  >
                    {formatMessage(messages.cancel)}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    size="medium"
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
        </GridColumn>
      </GridRow>
    </IntroWrapper>
  )
}

export default NewHealthConversation
