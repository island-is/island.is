import {
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
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { LocaleEnum } from '@island.is/portals/my-pages/graphql'
import { getMessagingWindowInfo } from './utils/messagingWindow'
import * as styles from './HealthConversations.css'
import {
  useGetHealthConversationRecipientsForNewQuery,
  useCreateHealthConversationMutation,
} from './NewHealthConversation.generated'

const NewHealthConversation = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const { isPhoneWidth } = useIsPhoneWidth()

  const [selectedTypeCode, setSelectedTypeCode] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
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

  const recipients = data?.healthDirectorateHealthConversationRecipients
  const recipient =
    recipients?.find((r) => r.allowsMessaging) ?? recipients?.[0]

  const typeOptions =
    recipient?.allowedMessageTypes
      .filter((t) => !t.isCertificate)
      .map((t) => ({ label: t.title, value: t.patientInitiatedTypeCode })) ?? []

  const selectedOption =
    typeOptions.find((o) => o.value === selectedTypeCode) ?? null

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

  const isFormValid =
    !!selectedTypeCode && !!messageText.trim() && termsAccepted

  const canSubmit = isFormValid && !sending && !isFormLocked

  const handleSubmit = async () => {
    if (!canSubmit || !recipient || !selectedTypeCode) return
    const selectedType = recipient.allowedMessageTypes.find(
      (t) => t.patientInitiatedTypeCode === selectedTypeCode,
    )
    try {
      const result = await createMessage({
        variables: {
          input: {
            nodeId: recipient.nodeId,
            groupId: recipient.groupId,
            patientInitiatedTypeCode: selectedTypeCode,
            title: selectedType?.title,
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
    <Box marginTop={[1, 0, 0]}>
      <ConversationMobileBackHeader
        onClick={() => navigate(HealthPaths.HealthConversations)}
      />
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
              <Text variant="medium">
                {formatMessage(messages.healthConversationTo, {
                  arg: recipient?.name ?? '',
                })}
              </Text>
            </Box>

            <Box
              paddingX={[0, 5, 5]}
              paddingTop={[3, 3, 4]}
              paddingBottom={[10, 5, 5]}
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
                    onChange={(opt) => setSelectedTypeCode(opt?.value ?? null)}
                    backgroundColor="blue"
                    size="sm"
                    required
                    isDisabled={isFormLocked}
                  />
                </GridColumn>
              </GridRow>

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
                  loading={sending}
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
