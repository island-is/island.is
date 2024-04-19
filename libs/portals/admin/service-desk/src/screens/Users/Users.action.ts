import { z } from 'zod'
import { redirect } from 'react-router-dom'
import { isEmail } from 'class-validator'
import * as kennitala from 'kennitala'
import { parsePhoneNumber } from 'libphonenumber-js'

import {
  RawRouterActionResponse,
  WrappedActionFn,
} from '@island.is/portals/core'
import {
  replaceParams,
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import { maskString } from '@island.is/shared/utils'

import {
  GetPaginatedUserProfilesDocument,
  GetPaginatedUserProfilesQuery,
  type GetPaginatedUserProfilesQueryVariables,
} from './Users.generated'
import { ServiceDeskPaths } from '../../lib/paths'

export enum ErrorType {
  // Add more error types here when needed
  InvalidSearchQuery = 'INVALID_SEARCH_QUERY',
}

const schema = z.object({
  searchQuery: z.string().min(1),
})

export type GetUserProfilesResult = RawRouterActionResponse<
  GetPaginatedUserProfilesQuery['GetPaginatedUserProfiles'],
  ValidateFormDataResult<typeof schema>['errors']
>

export const UsersAction: WrappedActionFn =
  ({ client, userInfo }) =>
  async ({ request }): Promise<Response | GetUserProfilesResult> => {
    const formData = await request.formData()

    const { data, errors } = await validateFormData({
      formData,
      schema,
    })

    if (errors || !data) {
      return {
        errors,
        data: null,
      }
    }

    const isSearchTermValid = (searchTerm: string) => {
      try {
        if (!searchTerm) {
          return false
        } else if (
          !isEmail(searchTerm) &&
          !kennitala.isValid(searchTerm) &&
          !parsePhoneNumber(searchTerm, 'IS').isValid()
        ) {
          return false
        }
      } catch (e) {
        return false
      }

      return true
    }

    if (isSearchTermValid(data.searchQuery)) {
      try {
        const res = await client.query<
          GetPaginatedUserProfilesQuery,
          GetPaginatedUserProfilesQueryVariables
        >({
          query: GetPaginatedUserProfilesDocument,
          fetchPolicy: 'network-only',
          variables: {
            query: data.searchQuery,
          },
        })

        if (res.error) {
          throw res.error
        }

        const { data: respData, totalCount } = res.data.GetPaginatedUserProfiles

        if (totalCount === 1) {
          return redirect(
            replaceParams({
              href: ServiceDeskPaths.User,
              params: {
                nationalId: maskString(
                  respData[0].nationalId,
                  userInfo.profile.nationalId,
                ) as string,
              },
            }),
          )
        }

        return {
          data: res.data.GetPaginatedUserProfiles,
          errors: null,
        }
      } catch (e) {
        return {
          data: null,
          errors: null,
          globalError: true,
        }
      }
    } else {
      return {
        data: null,
        errors: {
          searchQuery: ErrorType.InvalidSearchQuery,
        },
      }
    }
  }
