import { useLazyQuery, useQuery } from '@apollo/client'
import { OfficialJournalOfIcelandApplicationInvolvedPartySignaturesResponse } from '@island.is/api/schema'
import { INVOLVED_PARTY_SIGNATURES_QUERY } from '../graphql/queries'

type Props = {
  involvedPartyId?: string
}

type LastSignaturesResponse = {
  officialJournalOfIcelandApplicationGetInvolvedPartySignatures: OfficialJournalOfIcelandApplicationInvolvedPartySignaturesResponse
}

export const useLastSignature = ({ involvedPartyId }: Props) => {
  const { data, loading, error } = useQuery<LastSignaturesResponse>(
    INVOLVED_PARTY_SIGNATURES_QUERY,
    {
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
      data?.officialJournalOfIcelandApplicationGetInvolvedPartySignatures,
    error,
    loading,
  }
}

export const useLastSignatureLazy = ({ involvedPartyId }: Props) => {
  return useLazyQuery<LastSignaturesResponse>(INVOLVED_PARTY_SIGNATURES_QUERY, {
    variables: {
      input: {
        involvedPartyId: involvedPartyId,
      },
    },
    fetchPolicy: 'no-cache',
  })
}
