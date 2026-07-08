import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useTheme } from 'styled-components/native'

import { StackScreen } from '@/components/stack-screen'
import { toast, ToastHost } from '@/components/toast'
import {
  LocaleEnum,
  useCreateHealthConversationMutation,
  useGetHealthConversationRecipientsQuery,
  useReplyToHealthConversationMutation,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import {
  Button,
  GeneralCardSkeleton,
  Problem,
  Select,
  TextField,
  Typography,
} from '@/ui'

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

  const [message, setMessage] = useState('')
  const [recipientNodeId, setRecipientNodeId] = useState<string>()
  const [typeCode, setTypeCode] = useState<string>()

  const recipientsRes = useGetHealthConversationRecipientsQuery({
    variables: { locale: locale === 'is' ? LocaleEnum.Is : LocaleEnum.En },
    skip: isReply,
  })
  // Only recipients that currently accept patient-initiated messages, and
  // only non-certificate message types, can start a new conversation
  const recipients = useMemo(
    () =>
      (
        recipientsRes.data?.healthDirectorateHealthConversationRecipients ?? []
      ).filter((r) => r.allowsMessaging),
    [recipientsRes.data],
  )
  const selectedRecipient = recipients.find((r) => r.nodeId === recipientNodeId)
  const serviceOptions = (selectedRecipient?.allowedMessageTypes ?? []).filter(
    (s) => !s.isCertificate,
  )

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
    if (!isReply && !recipientNodeId && recipients.length === 1) {
      setRecipientNodeId(recipients[0].nodeId)
    }
  }, [isReply, recipients, recipientNodeId])

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
            params: { id },
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
    : !!message.trim() && !!selectedRecipient && !!typeCode

  const onSend = () => {
    if (isReply && conversationId) {
      replyToConversation({
        variables: {
          input: { id: conversationId, messageTextContent: message.trim() },
        },
      })
      return
    }
    if (selectedRecipient && typeCode) {
      const selectedType = serviceOptions.find(
        (s) => s.patientInitiatedTypeCode === typeCode,
      )
      createConversation({
        variables: {
          input: {
            groupId: selectedRecipient.groupId,
            nodeId: selectedRecipient.nodeId,
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

  const showForm =
    isReply || (!recipientsLoading && !recipientsError && !noRecipients)

  return (
    <>
      <StackScreen closeable options={{ title: '' }} />
      <ToastHost />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: theme.spacing[2],
            rowGap: theme.spacing[2],
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Typography variant="heading3">{headerTitle}</Typography>

          {recipientsLoading ? (
            <View>
              <GeneralCardSkeleton height={64} />
              <GeneralCardSkeleton height={176} />
            </View>
          ) : recipientsError ? (
            <Problem
              type="error"
              title={intl.formatMessage({ id: 'problem.error.title' })}
              message={intl.formatMessage({
                id: 'health.messages.errorMessage',
              })}
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
                  value={recipientNodeId}
                  options={recipients.map((r) => ({
                    label: r.name,
                    value: r.nodeId,
                  }))}
                  onSelect={setRecipientNodeId}
                />
              )}
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
                />
              )}

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
              />
            </>
          )}
        </ScrollView>
        {showForm && (
          <View
            style={{
              padding: theme.spacing[2],
              paddingBottom: theme.spacing[4],
            }}
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
      </KeyboardAvoidingView>
    </>
  )
}
