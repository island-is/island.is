import { useQuery } from '@apollo/client'
import { GET_APPLICATION_COMMENTS_QUERY } from '../graphql/queries'

type Props = {
  applicationId: string
}
export const useComments = ({ applicationId }: Props) => {
  const { data, loading, error } = useQuery(GET_APPLICATION_COMMENTS_QUERY, {
    variables: {
      input: {
        id: applicationId,
      },
    },
  })

  return {
    comments: data?.officialJournalOfIcelandApplicationGetComments.comments,
    loading,
    error,
  }
}
