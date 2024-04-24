import { Box, Text } from '@island.is/island-ui/core'
import { OJOIFieldBaseProps } from '../lib/types'
import { CommentsList } from '../components/comments/CommentList'
import type { Props as CommentProps } from '../components/comments/Comment'
import { AddComment } from '../components/comments/AddComment'
import { useState } from 'react'
import { FormGroup } from '../components/form/FormGroup'

const MockComments = {
  lastUpdated: '2024-04-12T00:00:00Z',
  comments: [
    {
      from: 'Ármann',
      task: 'gerir athugasemd',
      date: '2024-04-11T00:00:00Z',
      type: 'received',
      comment:
        'Góðan dag, eins og sést í skráningu málsins [XYZ] er þar gerð athugasemd sem óskað er eftir svörum við.',
    },
    {
      from: 'Reykjavíkurborg (Jón Jónsson)',
      task: 'gerir athugasemd',
      date: '2024-04-12T00:00:00Z',
      type: 'sent',
      comment: 'Við skoðum með lögfræðisviðinu',
    },
  ] as Array<CommentProps>,
}

export const Comments = (props: OJOIFieldBaseProps) => {
  const [comments, setComments] = useState(MockComments.comments)

  const handleAddComment = (comment: string) => {
    setComments([
      ...comments,
      {
        from: 'Reykjavíkurborg (Jón Jónsson)',
        task: 'gerir athugasemd',
        type: 'sent',
        comment,
        date: new Date().toISOString(),
      },
    ])
  }
  return (
    <FormGroup title="Athugasemdir">
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
        <AddComment onAddComment={(c) => handleAddComment(c)} />
      </Box>
    </FormGroup>
  )
}
