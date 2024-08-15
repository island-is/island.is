import { AlertMessage, Box, SkeletonLoader } from '@island.is/island-ui/core'
import { OJOIFieldBaseProps } from '../lib/types'
import { CommentsList } from '../components/comments/CommentList'
import { FormGroup } from '../components/form/FormGroup'
import { useComments } from '../hooks/useComments'

export const Comments = ({ application }: OJOIFieldBaseProps) => {
  const { comments, error, loading } = useComments({
    applicationId: application.id,
  })

  if (error) {
    return (
      <FormGroup>
        <AlertMessage
          type="error"
          title="Villa kom upp við að sækja athugasemdir"
          message="Ekki tókst að sækja athugasemdir, reynið aftur síðar"
        />
      </FormGroup>
    )
  }

  if (loading) {
    return (
      <FormGroup>
        <SkeletonLoader
          height={32}
          repeat={4}
          borderRadius="standard"
          space={2}
        />
      </FormGroup>
    )
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
        {/* <AddComment onAddComment={(c) => handleAddComment(c)} /> */}
      </Box>
    </FormGroup>
  )
}
