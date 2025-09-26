import { useMutation, useQuery } from '@apollo/client'
import { OjoiaGetCommentsResponse } from '@island.is/api/schema'
import { POST_COMMENT_MUTATION, GET_COMMENTS_QUERY } from '../graphql/queries'
import { useUserInfo } from '@island.is/react-spa/bff'

type Props = {
  applicationId: string
}

type CommentsResponse = {
  OJOIAGetComments: OjoiaGetCommentsResponse
}

export type AddCommentVariables = {
  comment: string
}

type PostCommentResponse = {
  OJOIAPostComment: {
    success: boolean
  }
}

export const useComments = ({ applicationId }: Props) => {
  const userInfo = useUserInfo()
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
          applicationUserName: userInfo?.profile.actor?.name ?? undefined,
        },
      },
    })

    cb && cb()
  }

  return {
    comments: data?.OJOIAGetComments.comments,
    loading,
    error,
    refetchComments: refetch,
    addComment,
    addCommentLoading,
    addCommentError,
    addCommentSuccess: addCommentSuccess?.OJOIAPostComment.success,
  }
}
