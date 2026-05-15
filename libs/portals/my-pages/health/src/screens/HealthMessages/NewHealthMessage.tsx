import {
  Box,
  Button,
  Checkbox,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { CardLoader, IntroWrapper, getInitials, m } from '@island.is/portals/my-pages/core'
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

const UserInitialsAvatar = ({ name }: { name: string }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="full"
    background="blueberry100"
    style={{ width: 48, height: 48, flexShrink: 0 }}
  >
    <Text variant="h5" as="p">
      {getInitials(name)}
    </Text>
  </Box>
)

const NewHealthMessage = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const userInfo = useUserInfo()

  const [selectedTypeCode, setSelectedTypeCode] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const { data, loading, error } =
    useGetHealthMessagingRecipientsForNewQuery({
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

  const selectedOption = typeOptions.find((o) => o.value === selectedTypeCode) ?? null

  const canSubmit =
    !!selectedTypeCode && !!messageText.trim() && termsAccepted && !sending

  const handleSubmit = async () => {
    if (!canSubmit || !recipient) return
    const selectedType = recipient.allowedMessageTypes.find(
      (t) => t.patientInitiatedTypeCode === selectedTypeCode,
    )
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
  }

  return (
    <IntroWrapper
      title={messages.healthMessagesNewTitle}
      intro={messages.healthMessagesNewIntro}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && (
        <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '10/12']}>
              <Box
                background="white"
                borderColor="blue200"
                borderWidth="standard"
                borderRadius="large"
              >
                {/* Header */}
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  columnGap={2}
                  paddingX={4}
                  paddingY={3}
                >
                  <UserInitialsAvatar name={userInfo.profile.name ?? ''} />
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

                {/* Form */}
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
                      label={`${formatMessage(messages.healthMessagesNewTermsAccept)} ${formatMessage(messages.healthMessagesNewTermsLinkText)}`}
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
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
    </IntroWrapper>
  )
}

export default NewHealthMessage
