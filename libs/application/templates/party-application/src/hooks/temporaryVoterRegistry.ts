import { useQuery } from '@apollo/client'
import { GetVoterRegion } from '../graphql/queries'
import { TemporaryVoterRegistry } from '../types/schema'
import { constituencyMapper, EndorsementListTags } from '../constants'

export type UserVoterRegion = Pick<TemporaryVoterRegistry, 'regionNumber'>

interface UserVoterRegionResponse {
  temporaryVoterRegistryGetVoterRegion: UserVoterRegion
}

export const useVoterRegion = (constituency: EndorsementListTags) => {
  const { data: userVoterRegionResponse } = useQuery<UserVoterRegionResponse>(
    GetVoterRegion,
  )

  const applicationRegion = constituencyMapper[constituency].region_number
  const regionNumber =
    userVoterRegionResponse?.temporaryVoterRegistryGetVoterRegion
      ?.regionNumber ?? 0
  const isInVoterRegistry = regionNumber > 0
  const isInConstituency = regionNumber === applicationRegion

  return {
    isInVoterRegistry,
    isInConstituency,
  }
}
