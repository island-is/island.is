import { FC } from 'react'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { conclusion as m } from '../../lib/messages'
import { COMMENT_ANSWER } from '../../utils/constants'

/** The applicant's comment as plain text: it is user input, never Markdown. */
export const CommentSummary: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const comment = getValueViaPath<string>(
    application.answers,
    COMMENT_ANSWER,
  )?.trim()

  if (!comment) {
    return null
  }

  return (
    <Box marginTop={3}>
      <AlertMessage
        type="info"
        title={formatMessage(m.yourCommentTitle)}
        message={
          <Text variant="small" whiteSpace="preWrap">
            {comment}
          </Text>
        }
      />
    </Box>
  )
}
