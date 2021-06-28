import { useQuery } from '@apollo/client'

import { GetUserEndorsements } from '../graphql/queries'
import { Endorsement, EndorsementListTagsEnum } from '../types/schema'

interface EndorsementData {
  endorsementSystemUserEndorsements?: Endorsement[]
}

export const useHasEndorsed = () => {
  const {
    data: endorsementsData,
    loading,
    refetch,
  } = useQuery<EndorsementData>(GetUserEndorsements, {
    variables: {
      input: {
        tags: [
          EndorsementListTagsEnum.PartyApplicationNordausturkjordaemi2021,
          EndorsementListTagsEnum.PartyApplicationNordvesturkjordaemi2021,
          EndorsementListTagsEnum.PartyApplicationReykjavikurkjordaemiNordur2021,
          EndorsementListTagsEnum.PartyApplicationReykjavikurkjordaemiSudur2021,
          EndorsementListTagsEnum.PartyApplicationSudurkjordaemi2021,
          EndorsementListTagsEnum.PartyApplicationSudvesturkjordaemi2021,
        ],
      },
    },
  })

  const endorsements = endorsementsData?.endorsementSystemUserEndorsements
  const hasEndorsed = (endorsements && endorsements.length > 0) ?? false
  return { hasEndorsed, loading, refetch }
}
