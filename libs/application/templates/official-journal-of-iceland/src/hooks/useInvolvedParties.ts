import { useQuery } from '@apollo/client'
import { OfficialJournalOfIcelandApplicationGetUserInvolvedPartiesResponse } from '@island.is/api/schema'
import { INVOLVED_PARTIES_QUERY } from '../graphql/queries'

type Props = {
  applicationId?: string
  onComplete?: (data: InvolvedPartiesResponse) => void
  onError?: (error: Error) => void
}

type InvolvedPartiesResponse = {
  officialJournalOfIcelandApplicationGetUserInvolvedParties: OfficialJournalOfIcelandApplicationGetUserInvolvedPartiesResponse
}
export const useInvolvedParties = ({
  applicationId,
  onComplete,
  onError,
}: Props) => {
  const { data, loading, error } = useQuery<InvolvedPartiesResponse>(
    INVOLVED_PARTIES_QUERY,
    {
      skip: !applicationId,
      fetchPolicy: 'no-cache',
      variables: {
        input: {
          applicationId: applicationId,
        },
      },
      onCompleted: (data) => {
        onComplete && onComplete(data)
      },
      onError: (error) => {
        onError && onError(error)
      },
    },
  )

  return {
    involvedParties:
      data?.officialJournalOfIcelandApplicationGetUserInvolvedParties
        .involvedParties,
    loading,
    error,
  }
}
