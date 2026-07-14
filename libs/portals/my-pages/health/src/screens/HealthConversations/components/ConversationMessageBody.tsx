import { Box, Tag, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  InlineLink,
  LinkButton,
  formatDateWithTime,
} from '@island.is/portals/my-pages/core'
import {
  HealthDirectorateHealthConversationMessageType,
  HealthDirectorateHealthConversationSegmentType,
} from '@island.is/api/schema'
import { messages } from '../../../lib/messages'
import { HealthConversationMessageFragment } from '../HealthConversationDetail.generated'

interface Props {
  message: HealthConversationMessageFragment
}

const ConversationMessageBody = ({ message }: Props) => {
  const { formatMessage } = useLocale()

  if (
    message.messageType ===
      HealthDirectorateHealthConversationMessageType.VIDEO &&
    message.videoConversation
  ) {
    const video = message.videoConversation
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
          {video.isCanceled && (
            <Tag variant="red" outlined disabled>
              {formatMessage(messages.healthConversationVideoCallCanceled)}
            </Tag>
          )}
        </Box>
        {video.appointmentDate && (
          <Text fontWeight="light">
            {formatDateWithTime(video.appointmentDate)}
          </Text>
        )}
        {video.appointmentHostName && (
          <Text fontWeight="light">{video.appointmentHostName}</Text>
        )}
        {video.description && (
          <Text fontWeight="light">{video.description}</Text>
        )}
        {!video.isCanceled && (
          <Box marginTop={2}>
            <LinkButton
              to={video.url}
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

  if (
    message.messageType ===
      HealthDirectorateHealthConversationMessageType.SEGMENTED &&
    message.contentSegments?.length
  ) {
    return (
      <Box marginBottom={4}>
        <Text fontWeight="light">
          {message.contentSegments.map((segment, index) =>
            segment.type ===
              HealthDirectorateHealthConversationSegmentType.LINK &&
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
  }

  if (!message.messageTextContent) {
    return null
  }

  return (
    <Box marginBottom={4} style={{ whiteSpace: 'pre-line' }}>
      <Text fontWeight="light">{message.messageTextContent}</Text>
    </Box>
  )
}

export default ConversationMessageBody
