import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { NoOpenRecipientNotice } from '@/components/no-open-recipient-notice'
import { ServiceInstructions } from '@/components/service-instructions'
import { StackScreen } from '@/components/stack-screen'
import { toast, ToastHost } from '@/components/toast'
import {
  HealthDirectorateHealthConversationRecipientAvailability,
  LocaleEnum,
  useCreateHealthConversationMutation,
  useGetHealthConversationRecipientsQuery,
  useReplyToHealthConversationMutation,
} from '@/graphql/types/schema'
import { useKeyboardHeight } from '@/hooks/use-keyboard-height'
import { useMyPagesLinks } from '@/lib/my-pages-links'
import { uiStore } from '@/stores/ui-store'
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
const SUBJECT_MAX_LENGTH = 150
// Two lines of the input's 20px line height: a long subject wraps, then
// scrolls instead of pushing the message field down.
const SUBJECT_MAX_HEIGHT = 40

// Node and group repeat across a provider's treatments, so only all three
// identify a recipient. Mirrors the my-pages getRecipientKey.
const getRecipientKey = (recipient: {
  nodeId: string
  groupId: number
  treatmentId?: string | null
}) =>
  `${recipient.nodeId}-${recipient.groupId}${
    recipient.treatmentId ? `-${recipient.treatmentId}` : ''
  }`

// An open window is not enough: without a type — or a care team's own
// subject — there is nothing to submit.
const canStartConversation = (recipient: {
  canCreateConversation: boolean
  allowsCustomTitle: boolean
  treatmentId?: string | null
  allowedMessageTypes: unknown[]
}) =>
  recipient.canCreateConversation &&
  (recipient.allowedMessageTypes.length > 0 ||
    (!!recipient.treatmentId && recipient.allowsCustomTitle))

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
  // Replies skip the intro: its consent only covers new conversations.
  const hasIntro = !isReply

  const [message, setMessage] = useState('')
  const [subjectText, setSubjectText] = useState('')
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
  // Every recipient stays in the picker; canCreateConversation decides per
  // selection whether the form or an explanatory card follows.
  const recipients = useMemo(
    () =>
      recipientsRes.data?.healthDirectorateHealthConversationRecipients ?? [],
    [recipientsRes.data],
  )
  const selectedRecipient = recipients.find(
    (r) => getRecipientKey(r) === recipientKey,
  )
  // A care team takes a patient-written subject in place of a service type.
  const usesCustomTitle =
    !isReply &&
    !!selectedRecipient?.treatmentId &&
    !!selectedRecipient?.allowsCustomTitle

  // A picked recipient that can't be messaged — closed now, or not at all —
  // gets a card in place of the form; the card says which.
  const isSelectedBlocked =
    !isReply && selectedRecipient?.canCreateConversation === false
  // Certificate types appear in the dropdown but can't be submitted here;
  // selecting one swaps the form for a My Pages link.
  const serviceOptions = selectedRecipient?.allowedMessageTypes ?? []
  const selectedType = serviceOptions.find(
    (s) => s.patientInitiatedTypeCode === typeCode,
  )
  const isCertificateSelected =
    !isReply && !usesCustomTitle && !!selectedType?.isCertificate
  // Some types live elsewhere (the Heilsuvera web chat) and carry their own
  // destination.
  const externalLinkUrl = !isReply ? selectedType?.externalLinkUrl : undefined
  // Neither can be composed here: a notice replaces the field and send button.
  const hidesComposer = isCertificateSelected || !!externalLinkUrl
  const { healthMessageNew: certificateUrl } = useMyPagesLinks()

  const hasOpenRecipient = recipients.some(canStartConversation)
  // A closed window may have reopened since the cache was written.
  const hasClosedWindow = recipients.some(
    (r) =>
      r.availability ===
      HealthDirectorateHealthConversationRecipientAvailability.Closed,
  )
  // Show the cache on a revisit, unless it's all closed by a window: then
  // wait for the refetch.
  const recipientsLoading =
    !isReply &&
    recipientsRes.loading &&
    (!recipientsRes.data || (!hasOpenRecipient && hasClosedWindow))
  const recipientsError =
    !isReply && !recipientsLoading && !!recipientsRes.error
  // Nothing to send to: no form can open, so the notice takes over the sheet
  // and the intro is skipped.
  const noOpenRecipient =
    !isReply &&
    !recipientsLoading &&
    !recipientsError &&
    !hasOpenRecipient

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
    if (usesCustomTitle) {
      // No type is sent, so clear any code left by the previous recipient.
      setTypeCode(undefined)
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
  }, [isReply, usesCustomTitle, serviceOptions, typeCode])

  const onError = () => {
    toast.error(intl.formatMessage({ id: 'health.messages.compose.sendError' }))
  }

  const [replyToConversation, { loading: replying }] =
    useReplyToHealthConversationMutation({
      refetchQueries: ['GetHealthConversation', 'GetHealthConversations'],
      onCompleted: () => router.back(),
      onError,
    })

  // Set while navigating away after a send, so the Android step-back listener
  // lets it through instead of trapping the user on the compose screen.
  const isCompletingRef = useRef(false)

  const [createConversation, { loading: creating }] =
    useCreateHealthConversationMutation({
      refetchQueries: ['GetHealthConversations'],
      onCompleted: (data) => {
        isCompletingRef.current = true
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

  const canSend = isReply
    ? !!message.trim()
    : !!message.trim() &&
      !!selectedRecipient &&
      (usesCustomTitle ? !!subjectText.trim() : !!typeCode) &&
      !hidesComposer &&
      !isSelectedBlocked

  const onSend = () => {
    if (isReply && conversationId) {
      replyToConversation({
        variables: {
          input: { id: conversationId, messageTextContent: message.trim() },
        },
      })
      return
    }
    if (hidesComposer) {
      return
    }
    if (selectedRecipient && (usesCustomTitle || typeCode)) {
      createConversation({
        variables: {
          input: {
            groupId: selectedRecipient.groupId,
            nodeId: selectedRecipient.nodeId,
            // Siblings share a node and group; the treatment tells them apart.
            treatmentId: selectedRecipient.treatmentId,
            // Exclusive: a custom title replaces the type code.
            patientInitiatedTypeCode: usesCustomTitle ? undefined : typeCode,
            title: usesCustomTitle ? subjectText.trim() : selectedType?.title,
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

  // The iOS form sheet already covers the tab bar; Android composes in-place,
  // so hide it there.
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
  // Keyboard up: lift the toast 16px above the Send button (the Host adds its
  // own spacing[2]). Keyboard down: rest it at the bottom.
  const toastBottomOffset =
    keyboardHeight > 0 && sendButtonHeight > 0
      ? sendButtonHeight + theme.spacing[4]
      : 0

  // A menu lives in its own view controller and isn't torn down with the
  // sheet, so a drag-dismiss would strand it. Block that gesture while one is
  // open; the close button still works, it dismisses the menu first.
  const isMenuOpen = recipientMenuOpen || serviceMenuOpen

  const goBackToIntro = useCallback(() => setStep('intro'), [])
  // Nothing to step back to when the intro was skipped.
  const canReturnToIntro = hasIntro && !noOpenRecipient

  // Android has no header close item, so every back pops the sheet. Step back
  // to the intro instead — except after a send (see `isCompletingRef`).
  const navigation = useNavigation()
  useEffect(() => {
    if (Platform.OS !== 'android' || !canReturnToIntro || step !== 'compose') {
      return
    }
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isCompletingRef.current) {
        return
      }
      if (e.data.action.type !== 'GO_BACK' && e.data.action.type !== 'POP') {
        return
      }
      e.preventDefault()
      goBackToIntro()
    })
    return unsubscribe
  }, [navigation, canReturnToIntro, step, goBackToIntro])

  // iOS clears the modal header's left slot, so the chevron is added back
  // explicitly. Mirrors `blueBackItem`.
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

  if (step === 'intro' && !noOpenRecipient) {
    return (
      <>
        <StackScreen
          closeable
          options={{
            title: '',
            gestureEnabled: true,
            // Header options merge per key: omitting this would leave the
            // form's chevron in place.
            headerLeftItems: [],
          }}
        />
        <HealthMessageIntro
          loading={recipientsLoading}
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
          ...(canReturnToIntro && Platform.OS === 'ios' && { headerLeftItems }),
        }}
      />
      <ToastHost ignoreTabBar bottomOffset={toastBottomOffset} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: theme.spacing[2],
          // Android: this sheet is its own window, so MainActivity's
          // adjustResize doesn't reach it — pad by the keyboard height.
          paddingBottom:
            theme.spacing[4] + (Platform.OS === 'android' ? keyboardHeight : 0),
          rowGap: theme.spacing[2],
          // Let the full-screen "blocked" message fill the sheet.
          ...(noOpenRecipient && { flexGrow: 1 }),
        }}
        keyboardShouldPersistTaps="handled"
        // iOS: inset for the keyboard so the Send button clears it.
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
        {!noOpenRecipient && (
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
        ) : noOpenRecipient ? (
          <NoOpenRecipientNotice recipients={recipients} />
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
            {!isSelectedBlocked && (
              <>
                <View style={{ rowGap: theme.spacing[2] }}>
                  {!isReply && !usesCustomTitle && serviceOptions.length > 0 && (
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
                    />
                  )}
                  {!usesCustomTitle &&
                    !hidesComposer &&
                    !!selectedType?.instructions && (
                      <ServiceInstructions text={selectedType.instructions} />
                    )}

                  {usesCustomTitle && !hidesComposer && (
                    <View style={{ rowGap: theme.spacing.smallGutter }}>
                      <TextField
                        label={intl.formatMessage({
                          id: 'health.messages.compose.subjectLabel',
                        })}
                        placeholder={intl.formatMessage({
                          id: 'health.messages.compose.subjectPlaceholder',
                        })}
                        value={subjectText}
                        // One line that may wrap to two. Newlines are stripped
                        // so a pasted one can't reach the provider; Return
                        // dismisses the keyboard.
                        onChangeText={(text) =>
                          setSubjectText(text.replace(/\n/g, ' '))
                        }
                        multiline
                        submitBehavior="blurAndSubmit"
                        inputStyle={{ maxHeight: SUBJECT_MAX_HEIGHT }}
                        maxLength={SUBJECT_MAX_LENGTH}
                      />
                      <Typography
                        variant="body3"
                        color={theme.color.dark300}
                        textAlign="right"
                      >
                        {`${subjectText.length}/${SUBJECT_MAX_LENGTH}`}
                      </Typography>
                    </View>
                  )}

                  {!hidesComposer && (
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
                {/* Certificate requests aren't supported here — link to My
                Pages instead of a send form. */}
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
                {/* External services (the Heilsuvera web chat) are opened, not
                messaged. The server-side description covers opening hours. */}
                {!!externalLinkUrl && (
                  <ProblemTemplate
                    variant="info"
                    showIcon
                    title={selectedType?.title ?? ''}
                    message={selectedType?.description ?? ''}
                    detailLink={{
                      text: intl.formatMessage({
                        id: 'health.messages.compose.externalLink',
                      }),
                      url: externalLinkUrl,
                    }}
                  />
                )}
                {!hidesComposer && (
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
                      loading={sending}
                    />
                  </View>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </>
  )
}
