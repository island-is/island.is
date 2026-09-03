import { Box, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatDate,
  LinkButton,
  LinkResolver,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../../lib/messages'
import { HealthPaths } from '../../../lib/paths'
import * as conversationStyles from '../../HealthOverview/components/HealthConversationsBox/HealthConversationsBox.css'

interface ConversationSummary {
  id: string
  title?: string | null
  lastMessageSentAt?: string | null
  senderName?: string | null
}

interface Props {
  conversations: ConversationSummary[]
}

export const TreatmentMessages = ({ conversations }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      background="white"
      border="standard"
      borderColor="blue200"
      borderRadius="large"
      paddingY={3}
    >
      <Box
        display="flex"
        alignItems="center"
        columnGap={2}
        marginBottom={2}
        paddingX={3}
      >
        <Icon icon="chatbubble" type="outline" color="blue400" size="medium" />
        <Text variant="h4" as="h2" color="blue400">
          {formatMessage(messages.treatmentMessagesFromTeam)}
        </Text>
      </Box>

      {conversations.length === 0 && (
        <Problem type="no_data" size="small" noBorder />
      )}

      {conversations.map((conversation) => (
        <LinkResolver
          key={conversation.id}
          href={HealthPaths.HealthConversationsDetail.replace(
            ':id',
            conversation.id,
          )}
          className={conversationStyles.conversationLink}
        >
          <Box paddingX={3}>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              columnGap={2}
              borderTopWidth="standard"
              borderColor="blue200"
              style={{ paddingTop: 12, paddingBottom: 12 }}
            >
              <Box overflow="hidden">
                <Text variant="medium" marginBottom="smallGutter">
                  {conversation.senderName?.trim() ||
                    formatMessage(messages.treatmentTeam)}
                </Text>
                <Text color="blue400" fontWeight="regular" truncate>
                  {conversation.title ??
                    formatMessage(messages.treatmentMessagesFromTeam)}
                </Text>
              </Box>
              {conversation.lastMessageSentAt && (
                <Text variant="medium" whiteSpace="nowrap">
                  {formatDate(conversation.lastMessageSentAt)}
                </Text>
              )}
            </Box>
          </Box>
        </LinkResolver>
      ))}

      <Box display="flex" justifyContent="center" paddingTop={3}>
        <LinkButton
          to={HealthPaths.HealthConversations}
          text={formatMessage(messages.seeAllMessages)}
          variant="text"
          size="small"
          icon="arrowForward"
        />
      </Box>
    </Box>
  )
}

export default TreatmentMessages
