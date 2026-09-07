import { Box, Divider, Input, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import { forwardRef, Ref } from 'react'
import { messages } from '../../../lib/messages'
import ConversationAvatar from './ConversationAvatar'

interface Props {
  /**
   * Renders the divider and sender (avatar + name) header above the input —
   * used on desktop where the form is appended below the visible thread.
   * Without it only the "To: X" line and the input render — used on mobile
   * where the form replaces the thread.
   */
  withSenderHeader?: boolean
  senderName?: string
  replyToName?: string
  value: string
  onChange: (value: string) => void
  inputRef: Ref<HTMLTextAreaElement>
}

export const ConversationReplyForm = forwardRef<HTMLDivElement, Props>(
  (
    { withSenderHeader, senderName, replyToName, value, onChange, inputRef },
    ref,
  ) => {
    const { formatMessage } = useLocale()

    const toLine = replyToName
      ? formatMessage(messages.healthConversationTo, { arg: replyToName })
      : undefined

    return (
      <div ref={ref}>
        {withSenderHeader ? (
          <>
            <Box paddingY={1}>
              <Divider />
            </Box>

            <Box
              display="flex"
              flexDirection="row"
              paddingTop={3}
              marginBottom={3}
            >
              <ConversationAvatar
                variant="user"
                name={senderName ?? ''}
                large
              />
              <Box
                display="flex"
                flexDirection="column"
                marginLeft={2}
                justifyContent="center"
              >
                <Text variant="eyebrow" fontWeight="medium" truncate>
                  {senderName}
                </Text>
                {toLine && <Text variant="medium">{toLine}</Text>}
              </Box>
            </Box>
          </>
        ) : (
          toLine && (
            <Text variant="medium" marginBottom={3}>
              {toLine}
            </Text>
          )
        )}

        <Box marginBottom={3}>
          <Input
            textarea
            rows={6}
            name="reply-message"
            label={formatMessage(m.messages)}
            backgroundColor="blue"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            ref={inputRef}
          />
        </Box>
      </div>
    )
  },
)

export default ConversationReplyForm
