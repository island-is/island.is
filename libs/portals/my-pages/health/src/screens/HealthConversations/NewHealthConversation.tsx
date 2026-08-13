import {
  Box,
  Button,
  Checkbox,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Input,
  Select,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale, useNamespaces } from '@island.is/localization'
import { CardLoader, InlineLink, m } from '@island.is/portals/my-pages/core'
import ConversationAvailabilityAlert from './components/ConversationAvailabilityAlert'
import ConversationCancelSubmit from './components/ConversationCancelSubmit'
import ConversationTermsModal from './components/ConversationTermsModal'
import MobileActionFooter from './components/MobileActionFooter'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWindowSize } from 'react-use'
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
  const { width } = useWindowSize()
  const isMobileWidth = width < theme.breakpoints.sm

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

  const backButton = (
    <Button
      variant="text"
      size="default"
      colorScheme="light"
      aria-label={formatMessage(m.goBack)}
      onClick={() => navigate(HealthPaths.HealthConversations)}
    >
      <Icon icon="arrowBack" type="filled" />
    </Button>
  )

  return (
    <GridContainer>
      <GridRow marginTop={[1, 1, 2]}>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12', '10/12']}>
          {/* On mobile the back arrow sits above the title; on desktop it
              moves inside the message card below (see the other render site) */}
          {isMobileWidth && (
            <Box className={styles.backButton} marginBottom={4}>
              {backButton}
            </Box>
          )}

          <Box marginBottom={4}>
            <Text variant="h2" as="h1">
              {formatMessage(messages.healthConversationsNewTitle)}
            </Text>
            <Text variant="default" paddingTop={1}>
              {introText}
            </Text>
          </Box>

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
              {!isMobileWidth && (
                <Box
                  paddingX={[2, 2, 5]}
                  paddingTop={[2, 2, 3]}
                  className={styles.backButton}
                >
                  {backButton}
                </Box>
              )}
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
                paddingBottom={[10, 10, 5]}
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
                      onChange={(opt) =>
                        setSelectedTypeCode(opt?.value ?? null)
                      }
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
                    submitLabel={formatMessage(
                      messages.healthConversationSend,
                    )}
                    onCancel={() => navigate(HealthPaths.HealthConversations)}
                    onSubmit={handleSubmit}
                    submitDisabled={!canSubmit}
                    loading={sending}
                    fluid={isMobileWidth}
                  />
                </MobileActionFooter>
              </Box>
            </Box>
          )}
          <ConversationTermsModal
            isOpen={termsModalOpen}
            onClose={() => setTermsModalOpen(false)}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default NewHealthConversation
