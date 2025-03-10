import { useLazyQuery, useQuery } from '@apollo/client'
import { INVOLVED_PARTY_SIGNATURES_QUERY } from '../graphql/queries'
import { OfficialJournalOfIcelandApplicationInvolvedPartySignatureResponse } from '@island.is/api/schema'

type LastSignatureResponse = {
  officialJournalOfIcelandApplicationInvolvedPartySignature: OfficialJournalOfIcelandApplicationInvolvedPartySignatureResponse
}

type Props = {
  involvedPartyId?: string
  onCompleted?: (data: LastSignatureResponse) => void
  onError?: (error: Error) => void
}

export const useLastSignature = ({ involvedPartyId }: Props) => {
  const { data, loading, error } = useQuery<LastSignatureResponse>(
    INVOLVED_PARTY_SIGNATURES_QUERY,
    {
      skip: !involvedPartyId,
      variables: {
        input: {
          involvedPartyId: involvedPartyId,
        },
      },
      fetchPolicy: 'no-cache',
    },
  )

  return {
    lastSignature:
      data?.officialJournalOfIcelandApplicationInvolvedPartySignature,
    error,
    loading,
  }
}

export const useLastSignatureLazy = ({
  involvedPartyId,
  onCompleted,
  onError,
}: Props) => {
  return useLazyQuery<LastSignatureResponse>(INVOLVED_PARTY_SIGNATURES_QUERY, {
    variables: {
      input: {
        involvedPartyId: involvedPartyId,
      },
    },
    fetchPolicy: 'no-cache',
    onCompleted: onCompleted,
    onError: onError,
  })
}
