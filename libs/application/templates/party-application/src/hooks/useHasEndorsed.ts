import { useQuery } from '@apollo/client'
import { GetUserEndorsements } from '../graphql/queries'
import { Endorsement, EndorsementListOpenTagsEnum } from '../types/schema'

interface EndorsementData {
  endorsementSystemUserEndorsements?: Endorsement[]
}

export const useHasEndorsed = () => {
  const {
    data: endorsementsData,
    loading,
    refetch,
  } = useQuery<EndorsementData>(GetUserEndorsements)

  const restrictedTags = [
    EndorsementListOpenTagsEnum.PartyApplicationNordausturkjordaemi2021,
    EndorsementListOpenTagsEnum.PartyApplicationNordvesturkjordaemi2021,
    EndorsementListOpenTagsEnum.PartyApplicationReykjavikurkjordaemiNordur2021,
    EndorsementListOpenTagsEnum.PartyApplicationReykjavikurkjordaemiSudur2021,
    EndorsementListOpenTagsEnum.PartyApplicationSudurkjordaemi2021,
    EndorsementListOpenTagsEnum.PartyApplicationSudvesturkjordaemi2021,
  ]

  const endorsements = endorsementsData?.endorsementSystemUserEndorsements

  // user has endorsed if any tags of his endorsements match the list of restricted tags
  const hasEndorsed = endorsements?.some((endorsement) => {
    const endorsementListTags = endorsement.endorsementList?.tags ?? []
    return endorsementListTags.some((tag) => restrictedTags.includes(tag))
  })

  return { hasEndorsed, loading, refetch }
}
