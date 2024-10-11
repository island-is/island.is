import type { WrappedLoaderFn } from '@island.is/portals/core'
import { EndorsementList } from '../../lib/utils/types'
import {
  EndorsementSystemGetSingleEndorsementListDocument,
  EndorsementSystemGetSingleEndorsementListQuery,
} from './getSinglePetitionList.generated'
import {
  EndorsementSystemGetEndorsementsDocument,
  EndorsementSystemGetEndorsementsQuery,
} from './getEndorsements.generated'

export const petitionListLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<EndorsementList> => {
    if (!params.listId) {
      throw new Error('Listid not provided in parameters')
    }
    const { data: listData, error: listError } =
      await client.query<EndorsementSystemGetSingleEndorsementListQuery>({
        query: EndorsementSystemGetSingleEndorsementListDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            listId: params.listId,
          },
        },
      })
    if (listError) {
      throw listError
    }
    if (!listData) {
      throw new Error(`No list data found for ${params.listId}`)
    }

    const { data: endorsements, error: endorsementsError } =
      await client.query<EndorsementSystemGetEndorsementsQuery>({
        query: EndorsementSystemGetEndorsementsDocument,
        variables: {
          input: {
            listId: params.listId,
            // changing limit for admin to ensure all endorsements
            // are fetched for the download file feature
            limit: 1000000,
          },
        },
      })
    if (endorsementsError) {
      throw endorsementsError
    }

    return {
      listId: params.listId,
      petition: listData.endorsementSystemGetSingleEndorsementList,
      endorsements: endorsements?.endorsementSystemGetEndorsements,
    }
  }
}
