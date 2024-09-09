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
import { useComments } from '../../hooks/useComments'

type Props = {
  applicationId: string
}

export const AddComment = ({ applicationId }: Props) => {
  const { formatMessage: f } = useLocale()
  const { addComment, addCommentLoading, addCommentSuccess } = useComments({
    applicationId,
  })

  const [comment, setComment] = useState('')

  const onAddComment = () => {
    addComment({
      comment: comment,
    })
    setComment('')
  }

  return (
    <Stack space={4}>
      {addCommentSuccess === false && (
        <AlertMessage
          type="error"
          title={f(comments.warnings.postCommentFailedTitle)}
          message={f(comments.warnings.postCommentFailedMessage)}
        />
      )}
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
