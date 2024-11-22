import {
  AlertMessage,
  Box,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { OJOIFieldBaseProps } from '../lib/types'
import { CommentsList } from '../components/comments/CommentList'
import { FormGroup } from '../components/form/FormGroup'
import { useComments } from '../hooks/useComments'
import { useLocale } from '@island.is/localization'
import {
  error as errorMessages,
  comments as commentMessages,
} from '../lib/messages'
import { OJOI_INPUT_HEIGHT } from '../lib/constants'
import { AddComment } from '../components/comments/AddComment'

type Props = OJOIFieldBaseProps & {
  canAddComment?: boolean
}

export const Comments = ({ application, canAddComment = true }: Props) => {
  const { formatMessage: f } = useLocale()
  const {
    comments,
    loading,
    error,
    addComment,
    addCommentLoading,
    addCommentSuccess,
    addCommentError,
  } = useComments({
    applicationId: application.id,
  })

  const showCommentsList = comments && comments.length > 0

  if (loading) {
    return (
      <SkeletonLoader
        repeat={3}
        height={OJOI_INPUT_HEIGHT}
        space={2}
        borderRadius="xs"
      />
    )
  }

  return (
    <FormGroup title={f(commentMessages.general.title)}>
      <Stack space={2}>
        {error && (
          <AlertMessage
            type="error"
            title={f(errorMessages.fetchCommentsFailedTitle)}
            message={f(errorMessages.fetchCommentsFailedMessage)}
          />
        )}
        {!showCommentsList && !error && (
          <AlertMessage
            type="info"
            title={f(commentMessages.warnings.noCommentsTitle)}
            message={f(commentMessages.warnings.noCommentsMessage)}
          />
        )}
        {showCommentsList && (
          <Box
            display="flex"
            flexDirection="column"
            rowGap={4}
            paddingX={5}
            paddingTop={2}
            paddingBottom={5}
            background="blue100"
          >
            <CommentsList comments={comments} />
          </Box>
        )}
        {canAddComment && (
          <AddComment
            addComment={addComment}
            addCommentError={addCommentError}
            addCommentLoading={addCommentLoading}
            addCommentSuccess={addCommentSuccess}
          />
        )}
      </Stack>
    </FormGroup>
  )
}
