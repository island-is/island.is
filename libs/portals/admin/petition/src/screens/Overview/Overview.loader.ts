import type { WrappedLoaderFn } from '@island.is/portals/core'
import { FilteredPetitions } from '../../lib/utils/types'
import {
  EndorsementSystemFindEndorsementListsDocument,
  EndorsementSystemFindEndorsementListsQuery,
} from './getAllEndorsementsLists.generated'
import { EndorsementListControllerFindByTagsTagsEnum } from '@island.is/api/schema'

export const overviewLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<FilteredPetitions> => {
    const { data, error } =
      await client.query<EndorsementSystemFindEndorsementListsQuery>({
        query: EndorsementSystemFindEndorsementListsDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            tags: [EndorsementListControllerFindByTagsTagsEnum.generalPetition],
            limit: 1000,
          },
        },
      })

    if (error) {
      throw error
    }
    const petitions = data?.endorsementSystemFindEndorsementLists.data ?? []

    return {
      active: petitions?.filter((list) => {
        return (
          new Date(list.openedDate) <= new Date() &&
          new Date() <= new Date(list.closedDate) &&
          !list.adminLock
        )
      }),
      closed: petitions?.filter((list) => {
        return new Date() >= new Date(list.closedDate) && !list.adminLock
      }),
      locked: petitions?.filter((list) => {
        return list.adminLock === true
      }),
    }
  }
}
