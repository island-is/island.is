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
import MessageAvatar from './MessageAvatar'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import {
  useGetHealthMessagingRecipientsForNewQuery,
  useCreateHealthMessageMutation,
} from './NewHealthMessage.generated'

const NewHealthMessage = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const userInfo = useUserInfo()

  const [selectedTypeCode, setSelectedTypeCode] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const { data, loading, error } = useGetHealthMessagingRecipientsForNewQuery({
    variables: { locale: lang },
  })

  const [createMessage, { loading: sending }] = useCreateHealthMessageMutation()

  const recipient = data?.healthDirectorateHealthMessagingRecipients?.find(
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
    if (!canSubmit || !recipient) return
    const selectedType = recipient.allowedMessageTypes.find(
      (t) => t.patientInitiatedTypeCode === selectedTypeCode,
    )
    try {
      const result = await createMessage({
        variables: {
          input: {
            nodeId: recipient.nodeId,
            groupId: recipient.groupId,
            patientInitiatedTypeCode: selectedTypeCode!,
            title: selectedType?.title,
            messageTextContent: messageText,
          },
        },
      })
      const id = result.data?.healthDirectorateCreateHealthMessage?.id
      if (id) {
        navigate(HealthPaths.HealthMessagesDetail.replace(':id', id), {
          state: { justCreated: true },
        })
      } else {
        navigate(HealthPaths.HealthMessages)
      }
    } catch {
      toast.error(formatMessage(m.errorTitle))
    }
  }

  return (
    <IntroWrapper
      title={messages.healthMessagesNewTitle}
      intro={messages.healthMessagesNewIntro}
      desktopContentSpan="10/12"
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && !recipient && (
        <EmptyState title={messages.healthMessagesNoRecipient} />
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
            <MessageAvatar variant="user" name={userInfo.profile.name ?? ''} />
            <Box>
              <Text variant="medium">
                {formatMessage(messages.healthMessageTo, {
                  arg: recipient?.name ?? '',
                })}
              </Text>
              <Text fontWeight="semiBold">
                {formatMessage(messages.healthMessagesCreate)}
              </Text>
            </Box>
          </Box>

          <Divider />

          <Box paddingX={4} paddingY={4}>
            <Box marginBottom={3}>
              <Select
                name="service-type"
                label={formatMessage(messages.healthMessagesNewSelectService)}
                placeholder={formatMessage(
                  messages.healthMessagesNewSelectServicePlaceholder,
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
                  messages.healthMessagesNewBodyPlaceholder,
                )}
                backgroundColor="blue"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </Box>

            <Box marginBottom={4}>
              <Checkbox
                id="terms-accept"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                label={`${formatMessage(
                  messages.healthMessagesNewTermsAccept,
                )} ${formatMessage(messages.healthMessagesNewTermsLinkText)}`}
              />
            </Box>

            <Box display="flex" justifyContent="flexEnd">
              <Button
                onClick={handleSubmit}
                loading={sending}
                disabled={!canSubmit}
              >
                {formatMessage(messages.healthMessageSend)}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </IntroWrapper>
  )
}

export default NewHealthMessage
