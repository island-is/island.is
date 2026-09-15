import { Box, Icon, Text, VisuallyHidden } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatDate,
  LinkButton,
  LinkResolver,
  m,
} from '@island.is/portals/my-pages/core'
import cn from 'classnames'
import isToday from 'date-fns/isToday'
import { messages } from '../../../lib/messages'
import { HealthPaths } from '../../../lib/paths'
import * as conversationStyles from '../../HealthOverview/components/HealthConversationsBox/HealthConversationsBox.css'
import * as listStyles from '../../HealthConversations/HealthConversations.css'

interface ConversationSummary {
  id: string
  title?: string | null
  lastMessageSentAt?: string | null
  senderName?: string | null
  isRead?: boolean
}

interface Props {
  conversations: ConversationSummary[]
  newMessageHref?: string
}

// The design shows at most 3 recent messages; the server's cap is unspecified.
const MAX_CONVERSATIONS = 3

export const TreatmentMessages = ({ conversations, newMessageHref }: Props) => {
  const { formatMessage } = useLocale()
  const visibleConversations = conversations.slice(0, MAX_CONVERSATIONS)

  return (
    <Box
      background="white"
      border="standard"
      borderColor="blue200"
      borderRadius="large"
      paddingY={3}
      position="relative"
    >
      <Box
        display="flex"
        alignItems="center"
        columnGap={2}
        marginBottom={3}
        paddingX={3}
      >
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

      {visibleConversations.map((conversation) => {
        const unread = conversation.isRead === false
        return (
          <LinkResolver
            key={conversation.id}
            href={HealthPaths.HealthConversationsDetail.replace(
              ':id',
              conversation.id,
            )}
            className={conversationStyles.conversationLink}
          >
            <Box paddingX={[0, 0, 3]}>
              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems="flexStart"
                columnGap={2}
                paddingY={2}
                paddingX={[3, 3, 2]}
                borderTopWidth="standard"
                borderColor="blue200"
                className={cn(
                  listStyles.conversationRow,
                  unread && conversationStyles.unreadRow,
                )}
              >
                <Box overflow="hidden">
                  <Text variant="medium" marginBottom="smallGutter">
                    {conversation.senderName?.trim() ||
                      formatMessage(messages.treatmentTeam)}
                  </Text>
                  <Text
                    color="blue400"
                    fontWeight={unread ? 'medium' : 'regular'}
                    truncate
                  >
                    {conversation.title?.trim() ||
                      formatMessage(messages.treatmentMessagesFromTeam)}
                    {unread && (
                      <VisuallyHidden>
                        {` - ${formatMessage(m.notificationUnread)}`}
                      </VisuallyHidden>
                    )}
                  </Text>
                </Box>
                {conversation.lastMessageSentAt && (
                  <Text variant="medium" whiteSpace="nowrap">
                    {isToday(new Date(conversation.lastMessageSentAt))
                      ? formatMessage(m.today)
                      : formatDate(conversation.lastMessageSentAt)}
                  </Text>
                )}
              </Box>
            </Box>
          </LinkResolver>
        )
      })}

      <Box paddingX={[0, 0, 3]}>
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
    </Box>
  )
}

export default TreatmentMessages
