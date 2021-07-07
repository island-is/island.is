import { useQuery } from '@apollo/client'
import { GetUserEndorsements } from '../graphql/queries'
import { Endorsement } from '../types/schema'

interface EndorsementData {
  endorsementSystemUserEndorsements?: Endorsement[]
}

export const useHasEndorsed = (endorsementListId: string) => {
  const { data: endorsementsData } = useQuery<EndorsementData>(
    GetUserEndorsements,
  )

  const endorsements = endorsementsData?.endorsementSystemUserEndorsements
  return (
    endorsements?.some((x) => x.endorsementListId === endorsementListId) ??
    false
  )
}
