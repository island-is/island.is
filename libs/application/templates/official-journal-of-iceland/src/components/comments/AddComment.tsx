import {
  AlertMessage,
  Box,
  Button,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { comments } from '../../lib/messages/comments'
import { useLocale } from '@island.is/localization'
import { AddCommentVariables } from '../../hooks/useComments'
import { ApolloError } from '@apollo/client'

type Props = {
  addComment: (variables: AddCommentVariables, cb?: () => void) => void
  addCommentLoading?: boolean
  addCommentSuccess?: boolean
  addCommentError?: ApolloError
}

export const AddComment = ({
  addComment,
  addCommentError,
  addCommentLoading,
  addCommentSuccess,
}: Props) => {
  const { formatMessage: f } = useLocale()
  const [comment, setComment] = useState('')

  const onAddComment = () => {
    addComment({
      comment: comment,
    })
    setComment('')
  }

  return (
    <Stack space={4}>
      {addCommentSuccess === false ||
        (addCommentError && (
          <AlertMessage
            type="error"
            title={f(comments.warnings.postCommentFailedTitle)}
            message={f(comments.warnings.postCommentFailedMessage)}
          />
        ))}
      <Box>
        <Input
          disabled={addCommentLoading}
          name="add-comment"
          textarea
          label={f(comments.inputs.addCommentTextarea.label)}
          placeholder={f(comments.inputs.addCommentTextarea.placeholder)}
          value={comment}
          rows={3}
          onChange={(e) => setComment(e.target.value)}
        />
      </Box>
      <Box display="flex" justifyContent="flexEnd">
        <Button size="small" loading={addCommentLoading} onClick={onAddComment}>
          {f(comments.inputs.addCommentButton.label)}
        </Button>
      </Box>
    </Stack>
  )
}
