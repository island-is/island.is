import { Box, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatDate,
  LinkButton,
  LinkResolver,
} from '@island.is/portals/my-pages/core'
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
  newMessageHref?: string
}

export const TreatmentMessages = ({ conversations, newMessageHref }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      background="white"
      border="standard"
      borderColor="blue200"
      borderRadius="large"
      padding={3}
      position="relative"
    >
      <Box display="flex" alignItems="center" columnGap={2} marginBottom={3}>
        <Icon icon="chatbubble" type="outline" color="blue400" size="medium" />
        <Text variant="h4" as="h2" color="blue400">
          {formatMessage(messages.treatmentMessagesFromTeam)}
        </Text>
      </Box>
      {newMessageHref && (
        <Box
          display={['none', 'none', 'block']}
          position="absolute"
          style={{ top: 14, right: 24 }}
        >
          <LinkButton
            to={newMessageHref}
            text={formatMessage(messages.healthConversationsCreate)}
            variant="primary"
            size="small"
          />
        </Box>
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
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexStart"
            columnGap={2}
            paddingY={2}
            paddingX={[0, 0, 2]}
            borderTopWidth="standard"
            borderColor="blue200"
          >
            <Box overflow="hidden">
              <Text variant="medium" marginBottom="smallGutter">
                {conversation.senderName?.trim() ||
                  formatMessage(messages.treatmentTeam)}
              </Text>
              <Text color="blue400" fontWeight="regular" truncate>
                {conversation.title?.trim() ||
                  formatMessage(messages.treatmentMessagesFromTeam)}
              </Text>
            </Box>
            {conversation.lastMessageSentAt && (
              <Text variant="medium" whiteSpace="nowrap">
                {formatDate(conversation.lastMessageSentAt)}
              </Text>
            )}
          </Box>
        </LinkResolver>
      ))}

      <Box
        display="flex"
        justifyContent="center"
        paddingTop={3}
        borderTopWidth="standard"
        borderColor="blue200"
      >
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
