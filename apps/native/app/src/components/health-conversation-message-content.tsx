import React from 'react'
import { useIntl } from 'react-intl'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { HealthConversationMessageContentFragment } from '@/graphql/types/schema'
import { useBrowser } from '@/hooks/use-browser'
import { Button, Label, Typography } from '@/ui'
import { linkifyText } from '@/utils/linkify-text'

const bodyTextStyle = { fontSize: 16, lineHeight: 24 }

// A run of message text, with any bare URL in it rendered as a tappable link.
// Message bodies are plain text (no markup), so URLs are not marked up as links
// by the sender and have to be detected here.
const MessageText = ({ text }: { text: string }) => {
  const theme = useTheme()
  const { openBrowser } = useBrowser()

  return (
    <>
      {linkifyText(text).map((part, index) => {
        const href = part.href
        if (part.type === 'link' && href) {
          return (
            <Typography
              key={index}
              variant="body2"
              weight="600"
              color={theme.color.blue400}
              style={{ ...bodyTextStyle, textDecorationLine: 'underline' }}
              accessibilityRole="link"
              onPress={() => openBrowser(href)}
            >
              {part.value}
            </Typography>
          )
        }
        return (
          <Typography
            key={index}
            variant="body2"
            color={theme.color.dark400}
            style={bodyTextStyle}
          >
            {part.value}
          </Typography>
        )
      })}
    </>
  )
}

// Renders a health conversation message body from the structured `content`
// union: plain text, segmented text/link content, or a video-call card.
// Mirrors the my-pages ConversationMessageBody, adapted to native primitives.
export const HealthConversationMessageContent = ({
  content,
}: {
  content?: HealthConversationMessageContentFragment | null
}) => {
  const intl = useIntl()
  const theme = useTheme()
  const { openBrowser } = useBrowser()

  if (!content) {
    return null
  }

  switch (content.__typename) {
    case 'HealthDirectorateHealthConversationTextContent':
      return (
        <Typography
          variant="body2"
          color={theme.color.dark400}
          style={bodyTextStyle}
        >
          <MessageText text={content.text} />
        </Typography>
      )

    case 'HealthDirectorateHealthConversationSegmentedContent':
      return (
        <Typography
          variant="body2"
          color={theme.color.dark400}
          style={bodyTextStyle}
        >
          {(content.segments ?? []).map((segment, index) => {
            // Treat any segment carrying an href as a link (robust to enum
            // casing); everything else renders as text — which can still hold a
            // bare URL, so it goes through the same linkifying renderer.
            if (segment.href) {
              const href = segment.href
              return (
                <Typography
                  key={index}
                  variant="body2"
                  weight="600"
                  color={theme.color.blue400}
                  style={{ ...bodyTextStyle, textDecorationLine: 'underline' }}
                  accessibilityRole="link"
                  onPress={() => openBrowser(href)}
                >
                  {segment.label ?? href}
                </Typography>
              )
            }
            return (
              <MessageText
                key={index}
                text={segment.text ?? segment.label ?? ''}
              />
            )
          })}
        </Typography>
      )

    case 'HealthDirectorateHealthConversationVideoContent': {
      const appointmentDate = content.appointmentDate
        ? new Date(content.appointmentDate)
        : undefined

      return (
        <View
          style={{
            borderWidth: theme.border.width.standard,
            borderColor: theme.color.blue200,
            borderRadius: theme.border.radius.large,
            padding: theme.spacing[2],
            rowGap: theme.spacing[1],
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: theme.spacing[1],
            }}
          >
            <Typography variant="heading5">
              {intl.formatMessage({ id: 'health.messages.videoCall' })}
            </Typography>
            {content.isCanceled ? (
              <Label color="danger">
                {intl.formatMessage({
                  id: 'health.messages.videoCallCanceled',
                })}
              </Label>
            ) : null}
          </View>
          {appointmentDate ? (
            <Typography variant="body3">
              {`${intl.formatDate(appointmentDate, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })} - ${intl.formatTime(appointmentDate, {
                hour: '2-digit',
                minute: '2-digit',
              })}`}
            </Typography>
          ) : null}
          {content.appointmentHostName ? (
            <Typography variant="body3">
              {content.appointmentHostName}
            </Typography>
          ) : null}
          {content.description ? (
            <Typography variant="body3">{content.description}</Typography>
          ) : null}
          {!content.isCanceled ? (
            <View style={{ marginTop: theme.spacing[1] }}>
              <Button
                title={intl.formatMessage({
                  id: 'health.messages.startVideoCall',
                })}
                onPress={() => openBrowser(content.url)}
              />
            </View>
          ) : null}
        </View>
      )
    }

    default:
      return null
  }
}
