import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Platform, ScrollView, View } from 'react-native'
import { NativeStackHeaderItem } from '@react-navigation/native-stack'
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useTheme } from 'styled-components/native'

import { ConversationAvailabilityAlert } from '@/components/conversation-availability-alert'
import { HealthMessageIntro } from '@/components/health-message-intro'
import { ServiceInstructions } from '@/components/service-instructions'
import { StackScreen } from '@/components/stack-screen'
import { toast, ToastHost } from '@/components/toast'
import {
  HealthDirectorateHealthConversationRecipientBlockedReason,
  LocaleEnum,
  useCreateHealthConversationMutation,
  useGetHealthConversationRecipientsQuery,
  useReplyToHealthConversationMutation,
} from '@/graphql/types/schema'
import { useKeyboardHeight } from '@/hooks/use-keyboard-height'
import { useMyPagesLinks } from '@/lib/my-pages-links'
import { uiStore } from '@/stores/ui-store'
import { getMessagingWindowInfo } from '@/utils/messaging-window'
import { useLocale } from '@/hooks/use-locale'
import {
  Button,
  GeneralCardSkeleton,
  Problem,
  ProblemTemplate,
  Select,
  TextField,
  Typography,
} from '@/ui'

const MESSAGE_MAX_LENGTH = 300

// A recipient is only unique across all three identifiers: the same node and
// group can appear more than once, once per treatment. Mirrors the my-pages
// getRecipientKey so both clients key the dropdown the same way.
const getRecipientKey = (recipient: {
  nodeId: string
  groupId: number
  treatmentId?: string | null
}) =>
  `${recipient.nodeId}-${recipient.groupId}${
    recipient.treatmentId ? `-${recipient.treatmentId}` : ''
  }`

export default function HealthMessageComposeScreen() {
  const { conversationId, recipientName, subject } = useLocalSearchParams<{
    conversationId?: string
    recipientName?: string
    subject?: string
  }>()
  const intl = useIntl()
  const theme = useTheme()
  const locale = useLocale()
  const isReply = !!conversationId
  // Replies go straight to the form: the intro explains starting a new
  // conversation, and the consent it collects only applies to new ones.
  const hasIntro = !isReply

  const [message, setMessage] = useState('')
  const [recipientKey, setRecipientKey] = useState<string>()
  const [typeCode, setTypeCode] = useState<string>()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [recipientMenuOpen, setRecipientMenuOpen] = useState(false)
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false)
  const [step, setStep] = useState<'intro' | 'compose'>(
    hasIntro ? 'intro' : 'compose',
  )

  const recipientsRes = useGetHealthConversationRecipientsQuery({
    variables: { locale: locale === 'is' ? LocaleEnum.Is : LocaleEnum.En },
    skip: isReply,
  })
  // Every recipient the user has stays in the picker; whether each one can take
  // a new conversation right now is decided per selection by
  // canCreateConversation and explained by the availability alert.
  const recipients = useMemo(
    () =>
      recipientsRes.data?.healthDirectorateHealthConversationRecipients ?? [],
    [recipientsRes.data],
  )
  const selectedRecipient = recipients.find(
    (r) => getRecipientKey(r) === recipientKey,
  )

  // When the user has a single recipient that can't take a new conversation
  // (its window is closed, or it doesn't accept patient-initiated messages at
  // all), we replace the whole form with a full-screen explanation instead of a
  // disabled form.
  const soleRecipient =
    !isReply && recipients.length === 1 ? recipients[0] : undefined
  const isSoleBlocked = !!soleRecipient && !soleRecipient.canCreateConversation
  const soleWindowClosed =
    isSoleBlocked &&
    soleRecipient?.conversationBlockedReason ===
      HealthDirectorateHealthConversationRecipientBlockedReason.OutsideMessagingWindow
  const soleNotAllowed = isSoleBlocked && !soleWindowClosed
  const soleWindowInfo = getMessagingWindowInfo({
    windowOpen: soleRecipient?.messagingWindowOpen,
    windowClose: soleRecipient?.messagingWindowClose,
  })
  // Certificate types are shown in the dropdown too, but they can't be
  // submitted from the app — selecting one swaps the form for a notice that
  // links to My Pages (see the certificate branch in the render below).
  const serviceOptions = selectedRecipient?.allowedMessageTypes ?? []
  const selectedType = serviceOptions.find(
    (s) => s.patientInitiatedTypeCode === typeCode,
  )
  const isCertificateSelected = !isReply && !!selectedType?.isCertificate
  const { healthMessageNew: certificateUrl } = useMyPagesLinks()

  const recipientsLoading = !isReply && recipientsRes.loading
  const recipientsError =
    !isReply && !recipientsLoading && !!recipientsRes.error
  const noRecipients =
    !isReply &&
    !recipientsLoading &&
    !recipientsError &&
    recipients.length === 0

  // Default to the only recipient when there is a single option.
  useEffect(() => {
    if (!isReply && !recipientKey && recipients.length === 1) {
      setRecipientKey(getRecipientKey(recipients[0]))
    }
  }, [isReply, recipients, recipientKey])

  // Reset / default the service when the recipient changes.
  useEffect(() => {
    if (isReply) {
      return
    }
    if (serviceOptions.length === 1) {
      setTypeCode(serviceOptions[0].patientInitiatedTypeCode)
    } else if (
      typeCode &&
      !serviceOptions.some((s) => s.patientInitiatedTypeCode === typeCode)
    ) {
      setTypeCode(undefined)
    }
  }, [isReply, serviceOptions, typeCode])

  const onError = () => {
    toast.error(intl.formatMessage({ id: 'health.messages.compose.sendError' }))
  }

  const [replyToConversation, { loading: replying }] =
    useReplyToHealthConversationMutation({
      refetchQueries: ['GetHealthConversation', 'GetHealthConversations'],
      onCompleted: () => router.back(),
      onError,
    })

  const [createConversation, { loading: creating }] =
    useCreateHealthConversationMutation({
      refetchQueries: ['GetHealthConversations'],
      onCompleted: (data) => {
        const id = data.healthDirectorateCreateHealthConversation?.id
        if (id) {
          // Replace the compose screen so back returns to the inbox.
          router.replace({
            pathname: '/health/messages/[id]',
            params: { id, justCreated: 'true' },
          })
        } else {
          router.back()
        }
      },
      onError,
    })

  const sending = replying || creating

  // The recipient can't be messaged right now (outside window, messaging
  // disabled, etc.) — dim and disable the message inputs.
  const isFormLocked =
    !isReply && selectedRecipient?.canCreateConversation === false

  // A recipient that can't take a new conversation right now can't be sent to,
  // so hide the send button. Closing-soon still allows sending, so it keeps it.
  const hideSendButton = selectedRecipient?.canCreateConversation === false

  const canSend = isReply
    ? !!message.trim()
    : !!message.trim() &&
      !!selectedRecipient &&
      !!typeCode &&
      !isCertificateSelected &&
      !isFormLocked

  const onSend = () => {
    if (isReply && conversationId) {
      replyToConversation({
        variables: {
          input: { id: conversationId, messageTextContent: message.trim() },
        },
      })
      return
    }
    if (isCertificateSelected) {
      return
    }
    if (selectedRecipient && typeCode) {
      createConversation({
        variables: {
          input: {
            groupId: selectedRecipient.groupId,
            nodeId: selectedRecipient.nodeId,
            // Treatment-scoped recipients share a node and group with their
            // siblings, so the treatment is what tells them apart on send.
            treatmentId: selectedRecipient.treatmentId,
            patientInitiatedTypeCode: typeCode,
            title: selectedType?.title,
            messageTextContent: message.trim(),
          },
        },
      })
    }
  }

  const headerTitle = isReply
    ? subject ?? ''
    : intl.formatMessage({ id: 'health.messages.compose.newTitle' })

  // Fixed recipient (no dropdown): replying, or only one recipient available.
  const fixedRecipientName = isReply
    ? recipientName ?? ''
    : recipients.length === 1
    ? recipients[0].name
    : undefined

  // Keyboard up: lift the toast to 16px above the Send button (the Host adds its
  // own spacing[2] base gap). Keyboard down: rest it at the bottom.
  // iOS presents this as a form sheet that already covers the tab bar; Android
  // presents it in-place, so hide the tab bar while composing there.
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') {
        return
      }
      uiStore.setState({ tabsHidden: true })
      return () => {
        uiStore.setState({ tabsHidden: false })
      }
    }, []),
  )

  const keyboardHeight = useKeyboardHeight()
  const [sendButtonHeight, setSendButtonHeight] = useState(0)
  const toastBottomOffset =
    keyboardHeight > 0 && sendButtonHeight > 0
      ? sendButtonHeight + theme.spacing[4]
      : 0

  // A selection menu lives in its own platform view controller that is not
  // torn down with this sheet, so dragging the sheet away while one is open
  // leaves the menu stranded over whatever is shown next. Block the dismiss
  // gesture while a menu is up; the close button still works, because that
  // path lets us dismiss the menu before the sheet goes.
  const isMenuOpen = recipientMenuOpen || serviceMenuOpen

  const goBackToIntro = useCallback(() => setStep('intro'), [])

  // Android has no close item in the modal header, so the header arrow and the
  // hardware/gesture back all pop the sheet. Intercept those to step back to
  // the intro instead, while letting programmatic navigation (the replace after
  // a message is created) through untouched.
  const navigation = useNavigation()
  useEffect(() => {
    if (Platform.OS !== 'android' || !hasIntro || step !== 'compose') {
      return
    }
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type !== 'GO_BACK' && e.data.action.type !== 'POP') {
        return
      }
      e.preventDefault()
      goBackToIntro()
    })
    return unsubscribe
  }, [navigation, hasIntro, step, goBackToIntro])

  // iOS clears the header's left slot for modals (close lives on the right), so
  // the step-back chevron is added explicitly. Mirrors `blueBackItem`.
  const headerLeftItems = useCallback(
    (): NativeStackHeaderItem[] => [
      {
        type: 'button',
        label: '',
        icon: { type: 'sfSymbol', name: 'chevron.backward' },
        tintColor: theme.color.blue400,
        onPress: goBackToIntro,
      },
    ],
    [theme.color.blue400, goBackToIntro],
  )

  if (step === 'intro') {
    return (
      <>
        <StackScreen
          closeable
          options={{
            title: '',
            gestureEnabled: true,
            // Header options are merged per key, so the form's chevron has to
            // be cleared explicitly — omitting the key would leave it in place.
            headerLeftItems: [],
          }}
        />
        <HealthMessageIntro
          termsAccepted={termsAccepted}
          onToggleTerms={() => setTermsAccepted(!termsAccepted)}
          onContinue={() => setStep('compose')}
        />
      </>
    )
  }

  return (
    <>
      <StackScreen
        closeable
        options={{
          title: '',
          gestureEnabled: !isMenuOpen,
          ...(hasIntro && Platform.OS === 'ios' && { headerLeftItems }),
        }}
      />
      <ToastHost ignoreTabBar bottomOffset={toastBottomOffset} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: theme.spacing[2],
          paddingBottom: theme.spacing[4],
          rowGap: theme.spacing[2],
          // Let the full-screen "blocked" message fill the sheet.
          ...(isSoleBlocked && { flexGrow: 1 }),
        }}
        keyboardShouldPersistTaps="handled"
        // iOS: inset for the keyboard so the Send button clears it (Android
        // uses adjustResize).
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
        {!isSoleBlocked && (
          <Typography variant="heading3">{headerTitle}</Typography>
        )}

        {recipientsLoading ? (
          <View>
            <GeneralCardSkeleton height={64} />
            <GeneralCardSkeleton height={176} />
          </View>
        ) : recipientsError ? (
          <Problem
            type="error"
            error={recipientsRes.error}
            title={intl.formatMessage({ id: 'problem.error.title' })}
            message={intl.formatMessage({
              id: 'health.messages.errorMessage',
            })}
          />
        ) : soleWindowClosed ? (
          <Problem
            type="no_data"
            title={intl.formatMessage({
              id: 'health.messages.compose.closedTitle',
            })}
            message={[
              soleWindowInfo.windowOpenLabel && soleWindowInfo.windowCloseLabel
                ? intl.formatMessage(
                    { id: 'health.messages.compose.availabilityWindow' },
                    {
                      name: soleRecipient?.name,
                      openTime: soleWindowInfo.windowOpenLabel,
                      closeTime: soleWindowInfo.windowCloseLabel,
                    },
                  )
                : null,
              intl.formatMessage({
                id: 'health.messages.compose.availabilityInfo',
              }),
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ) : soleNotAllowed ? (
          <Problem
            type="no_data"
            title={intl.formatMessage({
              id: 'health.messages.compose.soleBlockedTitle',
            })}
            message={intl.formatMessage(
              { id: 'health.messages.compose.soleBlockedText' },
              { name: soleRecipient?.name },
            )}
          />
        ) : noRecipients ? (
          <Problem
            type="no_data"
            title={intl.formatMessage({
              id: 'health.messages.compose.noRecipient',
            })}
          />
        ) : (
          <>
            {fixedRecipientName !== undefined ? (
              <View
                style={{
                  marginHorizontal: -theme.spacing[2],
                  paddingHorizontal: theme.spacing[2],
                  paddingVertical: theme.spacing[1],
                  borderTopWidth: theme.border.width.hairline,
                  borderBottomWidth: theme.border.width.hairline,
                  borderColor: theme.color.blue200,
                }}
              >
                <Typography variant="body2">
                  {intl.formatMessage(
                    { id: 'health.messages.compose.to' },
                    { name: fixedRecipientName },
                  )}
                </Typography>
              </View>
            ) : (
              <Select
                label={intl.formatMessage({
                  id: 'health.messages.compose.selectRecipient',
                })}
                value={recipientKey}
                options={recipients.map((r) => ({
                  label: r.name,
                  value: getRecipientKey(r),
                }))}
                onSelect={setRecipientKey}
                onOpenChange={setRecipientMenuOpen}
              />
            )}
            {selectedRecipient && (
              <ConversationAvailabilityAlert recipient={selectedRecipient} />
            )}
            <View
              pointerEvents={isFormLocked ? 'none' : 'auto'}
              style={{
                opacity: isFormLocked ? 0.5 : 1,
                rowGap: theme.spacing[2],
              }}
            >
              {!isReply && serviceOptions.length > 0 && (
                <Select
                  label={intl.formatMessage({
                    id: 'health.messages.compose.selectService',
                  })}
                  placeholder={intl.formatMessage({
                    id: 'health.messages.compose.selectServicePlaceholder',
                  })}
                  value={typeCode}
                  options={serviceOptions.map((s) => ({
                    label: s.title,
                    value: s.patientInitiatedTypeCode,
                  }))}
                  onSelect={setTypeCode}
                  onOpenChange={setServiceMenuOpen}
                  disabled={isFormLocked}
                />
              )}
              {!isCertificateSelected && !!selectedType?.instructions && (
                <ServiceInstructions text={selectedType.instructions} />
              )}

              {!isCertificateSelected && (
                <View style={{ rowGap: theme.spacing.smallGutter }}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'health.messages.compose.messageLabel',
                    })}
                    placeholder={intl.formatMessage({
                      id: 'health.messages.compose.messagePlaceholder',
                    })}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={6}
                    inputStyle={{ minHeight: 120 }}
                    maxLength={MESSAGE_MAX_LENGTH}
                    disabled={isFormLocked}
                  />
                  <Typography
                    variant="body3"
                    color={theme.color.dark300}
                    textAlign="right"
                  >
                    {`${message.length}/${MESSAGE_MAX_LENGTH}`}
                  </Typography>
                </View>
              )}
            </View>
            {/* Certificate requests aren't supported in the app — point the
                user to My Pages instead of a send form. Rendered outside the
                lockable form wrapper so the link is always tappable. */}
            {isCertificateSelected && (
              <ProblemTemplate
                variant="info"
                showIcon
                title={intl.formatMessage({
                  id: 'health.messages.compose.certificateTitle',
                })}
                message={intl.formatMessage({
                  id: 'health.messages.compose.certificateText',
                })}
                detailLink={{
                  text: intl.formatMessage({
                    id: 'health.messages.compose.certificateLink',
                  }),
                  url: certificateUrl,
                }}
              />
            )}
            {!hideSendButton && !isCertificateSelected && (
              <View
                onLayout={(e) =>
                  setSendButtonHeight(e.nativeEvent.layout.height)
                }
              >
                <Button
                  title={intl.formatMessage({
                    id: 'health.messages.compose.send',
                  })}
                  onPress={onSend}
                  disabled={!canSend || sending}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </>
  )
}
