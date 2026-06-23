import {
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
  EmptyState,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import ConversationAvatar from './components/ConversationAvatar'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { LocaleEnum } from '@island.is/portals/my-pages/graphql'
import {
  useGetHealthConversationRecipientsForNewQuery,
  useCreateHealthConversationMutation,
} from './NewHealthConversation.generated'

const NewHealthConversation = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const userInfo = useUserInfo()

  const [selectedTypeCode, setSelectedTypeCode] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const { data, loading, error } =
    useGetHealthConversationRecipientsForNewQuery({
      variables: { locale: lang === 'en' ? LocaleEnum.En : LocaleEnum.Is },
    })

  const [createMessage, { loading: sending }] =
    useCreateHealthConversationMutation({
      refetchQueries: ['GetHealthConversations'],
    })

  const recipient = data?.healthDirectorateHealthConversationRecipients?.find(
    (r) => r.allowsMessaging,
  )

  const typeOptions =
    recipient?.allowedMessageTypes
      .filter((t) => !t.isCertificate)
      .map((t) => ({ label: t.title, value: t.patientInitiatedTypeCode })) ?? []

  const selectedOption =
    typeOptions.find((o) => o.value === selectedTypeCode) ?? null

  const canSubmit =
    !!selectedTypeCode && !!messageText.trim() && termsAccepted && !sending

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
    <IntroWrapper
      title={messages.healthConversationsNewTitle}
      intro={messages.healthConversationsNewIntro}
      desktopContentSpan="10/12"
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && !recipient && (
        <EmptyState title={messages.healthConversationsNoRecipient} />
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
                onChange={(opt) => setSelectedTypeCode(opt?.value ?? null)}
                backgroundColor="blue"
                size="sm"
                required
              />
            </Box>
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
              />
            </Box>

            <Box marginBottom={4}>
              {/* TODO: Add terms and conditions link */}
              <Checkbox
                id="terms-accept"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                label={`${formatMessage(
                  messages.healthConversationsNewTermsAccept,
                )} ${formatMessage(
                  messages.healthConversationsNewTermsLinkText,
                )}`}
              />
            </Box>
            <Box display="flex" justifyContent="flexEnd">
              <Button
                onClick={handleSubmit}
                loading={sending}
                disabled={!canSubmit}
              >
                {formatMessage(messages.healthConversationSend)}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </IntroWrapper>
  )
}

export default NewHealthConversation
