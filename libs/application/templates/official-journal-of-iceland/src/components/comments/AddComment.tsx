import { Box, Button, Input } from '@island.is/island-ui/core'
import { useState } from 'react'
import { comments } from '../../lib/messages/comments'
import { useLocale } from '@island.is/localization'

type Props = {
  onCommentChange?: (comment: string) => void
  onAddComment?: (comment: string) => void
}

export const AddComment = ({ onCommentChange, onAddComment }: Props) => {
  const { formatMessage } = useLocale()

  const [comment, setComment] = useState('')

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setComment(event.target.value)
    if (onCommentChange) {
      onCommentChange(event.target.value)
    }
  }

  const handleAdd = () => {
    setComment('')
    if (onAddComment) {
      onAddComment(comment)
    }
  }

  return (
    <Box
      display="flex"
      background="white"
      padding={4}
      flexDirection="column"
      rowGap={4}
    >
      <Box>
        <Input
          name="add-comment"
          textarea
          label={formatMessage(comments.inputs.addCommentTextarea.label)}
          placeholder={formatMessage(
            comments.inputs.addCommentTextarea.placeholder,
          )}
          value={comment}
          rows={3}
          onChange={handleChange}
        />
      </Box>
      <Box display="flex" justifyContent="flexEnd">
        <Button size="small" onClick={handleAdd}>
          {formatMessage(comments.inputs.addCommentButton.label)}
        </Button>
      </Box>
    </Box>
  )
}
