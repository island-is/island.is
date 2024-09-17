import { useMutation, useQuery } from '@apollo/client'
import { OfficialJournalOfIcelandApplicationGetCommentsResponse } from '@island.is/api/schema'
import { POST_COMMENT_MUTATION, GET_COMMENTS_QUERY } from '../graphql/queries'

type Props = {
  applicationId: string
}

type CommentsResponse = {
  officialJournalOfIcelandApplicationGetComments: OfficialJournalOfIcelandApplicationGetCommentsResponse
}

export type AddCommentVariables = {
  comment: string
}

type PostCommentResponse = {
  officialJournalOfIcelandApplicationPostComment: {
    success: boolean
  }
}

export const useComments = ({ applicationId }: Props) => {
  const { data, loading, error, refetch } = useQuery<CommentsResponse>(
    GET_COMMENTS_QUERY,
    {
      variables: {
        input: {
          id: applicationId,
        },
      },
      fetchPolicy: 'no-cache',
    },
  )

  const [
    addCommentMutation,
    {
      data: addCommentSuccess,
      loading: addCommentLoading,
      error: addCommentError,
    },
  ] = useMutation<PostCommentResponse>(POST_COMMENT_MUTATION, {
    onCompleted: () => {
      refetch()
    },
  })

  const addComment = (variables: AddCommentVariables, cb?: () => void) => {
    addCommentMutation({
      variables: {
        input: {
          id: applicationId,
          comment: variables.comment,
        },
      },
    })

    cb && cb()
  }

  return {
    comments: data?.officialJournalOfIcelandApplicationGetComments.comments,
    loading,
    error,
    refetchComments: refetch,
    addComment,
    addCommentLoading,
    addCommentError,
    addCommentSuccess:
      addCommentSuccess?.officialJournalOfIcelandApplicationPostComment.success,
  }
}
