import type { WrappedLoaderFn } from '@island.is/portals/core'
import { EndorsementList } from '../../shared/utils/types'
import {
  EndorsementSystemGetSingleEndorsementListDocument,
  EndorsementSystemGetSingleEndorsementListQuery,
} from '../../shared/queries/getSinglePetitionList.generated'
import {
  EndorsementSystemGetEndorsementsDocument,
  EndorsementSystemGetEndorsementsQuery,
} from '../../shared/queries/getEndorsements.generated'

export const petitionListLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<EndorsementList> => {
    if (!params.listId) {
      throw new Error('Listid not provided in parameters')
    }
    const {
      data: listData,
      error: listError,
    } = await client.query<EndorsementSystemGetSingleEndorsementListQuery>({
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

    const {
      data: endorsements,
      error: endorsementsError,
    } = await client.query<EndorsementSystemGetEndorsementsQuery>({
      query: EndorsementSystemGetEndorsementsDocument,
      variables: {
        input: {
          listId: params.listId,
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
