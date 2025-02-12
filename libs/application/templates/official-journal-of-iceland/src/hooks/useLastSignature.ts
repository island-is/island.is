import { useLazyQuery, useQuery } from '@apollo/client'
import { INVOLVED_PARTY_SIGNATURES_QUERY } from '../graphql/queries'
import { OfficialJournalOfIcelandApplicationInvolvedPartySignature } from '@island.is/api/schema'
type Props = {
  involvedPartyId?: string
}

type LastSignatureResponse = {
  officialJournalOfIcelandApplicationInvolvedPartySignatures: OfficialJournalOfIcelandApplicationInvolvedPartySignature
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
      data?.officialJournalOfIcelandApplicationInvolvedPartySignatures,
    error,
    loading,
  }
}

export const useLastSignatureLazy = ({ involvedPartyId }: Props) => {
  return useLazyQuery<LastSignatureResponse>(INVOLVED_PARTY_SIGNATURES_QUERY, {
    variables: {
      input: {
        involvedPartyId: involvedPartyId,
      },
    },
    fetchPolicy: 'no-cache',
  })
}
