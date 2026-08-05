import { Box, Tag, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  InlineLink,
  LinkButton,
  formatDateWithTime,
} from '@island.is/portals/my-pages/core'
import { HealthDirectorateHealthConversationSegmentType } from '@island.is/api/schema'
import { messages } from '../../../lib/messages'
import {
  HealthConversationMessageFragment,
  HealthConversationSegmentedContentFragment,
  HealthConversationTextContentFragment,
  HealthConversationVideoContentFragment,
} from '../HealthConversationDetail.generated'

interface Props {
  message: HealthConversationMessageFragment
}

const TextContent = ({
  content,
}: {
  content: HealthConversationTextContentFragment
}) => (
  <Box marginBottom={4} style={{ whiteSpace: 'pre-line' }}>
    <Text fontWeight="light">{content.text}</Text>
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
  return (
    <Box
      borderColor="blue200"
      borderWidth="standard"
      borderRadius="large"
      padding={3}
      marginBottom={4}
    >
      <Box display="flex" alignItems="center" columnGap={2} marginBottom={1}>
        <Text fontWeight="semiBold">
          {formatMessage(messages.appointmentModalityVideo)}
        </Text>
        {content.isCanceled && (
          <Tag variant="red" outlined disabled>
            {formatMessage(messages.healthConversationVideoCallCanceled)}
          </Tag>
        )}
      </Box>
      {content.appointmentDate && (
        <Text fontWeight="light">
          {formatDateWithTime(content.appointmentDate)}
        </Text>
      )}
      {content.appointmentHostName && (
        <Text fontWeight="light">{content.appointmentHostName}</Text>
      )}
      {content.description && (
        <Text fontWeight="light">{content.description}</Text>
      )}
      {!content.isCanceled && (
        <Box marginTop={2}>
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
