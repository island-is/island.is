import { useLazyQuery, useQuery } from '@apollo/client'
import { INVOLVED_PARTY_SIGNATURES_QUERY } from '../graphql/queries'
import {
  OfficialJournalOfIcelandApplicationInvolvedPartySignaturesCommittee,
  OfficialJournalOfIcelandApplicationInvolvedPartySignaturesRegular,
} from '@island.is/api/schema'

type LastSignatureResponse = {
  officialJournalOfIcelandApplicationInvolvedPartySignatures: {
    success: boolean
    data:
      | OfficialJournalOfIcelandApplicationInvolvedPartySignaturesCommittee
      | OfficialJournalOfIcelandApplicationInvolvedPartySignaturesRegular
  }
}

type Props = {
  involvedPartyId?: string
}

export const useLastSignature = ({ involvedPartyId }: Props) => {
  const { data, loading, error, refetch } = useQuery<LastSignatureResponse>(
    INVOLVED_PARTY_SIGNATURES_QUERY,
    {
      variables: {
        input: {
          involvedPartyId: involvedPartyId,
          skip: !involvedPartyId,
        },
      },
      fetchPolicy: 'no-cache',
    },
  )

  return {
    lastSignature:
      data?.officialJournalOfIcelandApplicationInvolvedPartySignatures.data,
    error,
    loading,
    refetch,
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
