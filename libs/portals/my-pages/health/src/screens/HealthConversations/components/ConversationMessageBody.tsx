import { Box, Icon, Stack, Tag, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  InlineLink,
  LinkButton,
  formatDate,
  getTime,
} from '@island.is/portals/my-pages/core'
import { HealthDirectorateHealthConversationSegmentType } from '@island.is/api/schema'
import { messages } from '../../../lib/messages'
import {
  HealthConversationMessageFragment,
  HealthConversationSegmentedContentFragment,
  HealthConversationTextContentFragment,
  HealthConversationVideoContentFragment,
} from '../HealthConversationDetail.generated'
import { linkifyText } from '../utils/linkify'
import { mapWeekday } from '../../../utils/mappers'

interface Props {
  message: HealthConversationMessageFragment
}

const TextContent = ({
  content,
}: {
  content: HealthConversationTextContentFragment
}) => (
  <Box marginBottom={4} style={{ whiteSpace: 'pre-line' }}>
    <Text fontWeight="light">
      {linkifyText(content.text).map((part, index) =>
        part.type === 'link' && part.href ? (
          <InlineLink key={index} to={part.href}>
            {part.value}
          </InlineLink>
        ) : (
          <span key={index}>{part.value}</span>
        ),
      )}
    </Text>
  </Box>
)

const SegmentedContent = ({
  content,
}: {
  content: HealthConversationSegmentedContentFragment
}) => (
  <Box marginBottom={4}>
    <Text fontWeight="light">
      {content.segments.map((segment, index) =>
        segment.type === HealthDirectorateHealthConversationSegmentType.LINK &&
        segment.href ? (
          <InlineLink key={index} to={segment.href}>
            {segment.label ?? segment.href}
          </InlineLink>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </Text>
  </Box>
)

const VideoContent = ({
  content,
}: {
  content: HealthConversationVideoContentFragment
}) => {
  const { formatMessage } = useLocale()

  const weekday = content.appointmentDate
    ? mapWeekday(content.appointmentDate, formatMessage)
    : undefined

  return (
    <Box marginBottom={4}>
      <Stack space={2}>
        <Box display="flex" alignItems="center" columnGap={1}>
          <Icon icon="videoCam" size="small" color="blue400" type="outline" />
          <Text>{formatMessage(messages.appointmentModalityVideo)}</Text>
          {content.isCanceled && (
            <Tag variant="red" outlined disabled>
              {formatMessage(messages.healthConversationVideoCallCanceled)}
            </Tag>
          )}
        </Box>
        {content.appointmentDate && (
          <Box display="flex" alignItems="center" columnGap={1}>
            <Icon
              icon="calendar"
              size="small"
              color="blue400"
              type="outline"
            />
            <Text>
              {weekday ? `${weekday}, ` : ''}
              {formatDate(content.appointmentDate)}
            </Text>
          </Box>
        )}
        {content.appointmentDate && (
          <Box display="flex" alignItems="center" columnGap={1}>
            <Icon icon="time" size="small" color="blue400" type="outline" />
            <Text>{getTime(content.appointmentDate)}</Text>
          </Box>
        )}
      </Stack>

      {content.appointmentHostName && (
        <Text fontWeight="light" marginTop={2}>
          {content.appointmentHostName}
        </Text>
      )}
      {content.description && (
        <Text fontWeight="light" marginTop={2}>
          {content.description}
        </Text>
      )}

      {!content.isCanceled && (
        <Box marginTop={3}>
          <Text marginBottom={2}>
            {formatMessage(messages.healthConversationVideoCallInstruction)}
          </Text>
          <LinkButton
            to={content.url}
            text={formatMessage(messages.appointmentVideoCallLink)}
            icon="videoCam"
            variant="primary"
            size="small"
          />
        </Box>
      )}
    </Box>
  )
}

const ConversationMessageBody = ({ message }: Props) => {
  const content = message.content

  if (!content) {
    return null
  }

  switch (content.__typename) {
    case 'HealthDirectorateHealthConversationTextContent':
      return <TextContent content={content} />
    case 'HealthDirectorateHealthConversationSegmentedContent':
      return <SegmentedContent content={content} />
    case 'HealthDirectorateHealthConversationVideoContent':
      return <VideoContent content={content} />
    default:
      return null
  }
}

export default ConversationMessageBody
