import { Box } from '@island.is/island-ui/core'
import { OJOIFieldBaseProps } from '../lib/types'
import { CommentsList } from '../components/comments/CommentList'
import { useState } from 'react'
import { FormGroup } from '../components/form/FormGroup'

export const Comments = (props: OJOIFieldBaseProps) => {
  const [comments, setComments] = useState([])

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
        {/* <AddComment onAddComment={(c) => handleAddComment(c)} /> */}
      </Box>
    </FormGroup>
  )
}
