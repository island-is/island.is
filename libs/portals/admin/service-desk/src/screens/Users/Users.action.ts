import { z } from 'zod'
import { redirect } from 'react-router-dom'

import {
  RawRouterActionResponse,
  WrappedActionFn,
} from '@island.is/portals/core'
import {
  replaceParams,
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import { maskString, isSearchTermValid } from '@island.is/shared/utils'

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
  searchQuery: z
    .string()
    .min(1)
    .superRefine((value, ctx) => {
      const isValid = isSearchTermValid(value)
      if (!isValid)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: ErrorType.InvalidSearchQuery,
        })

      return isValid
    }),
})

export type GetUserProfilesResult = RawRouterActionResponse<
  GetPaginatedUserProfilesQuery['UserProfileAdminProfiles'],
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

      const { data: respData, totalCount } = res.data.UserProfileAdminProfiles

      if (totalCount === 1) {
        return redirect(
          replaceParams({
            href: ServiceDeskPaths.User,
            params: {
              nationalId: (await maskString(
                respData[0].nationalId,
                userInfo.profile.nationalId,
              )) as string,
            },
          }),
        )
      }

      return {
        data: res.data.UserProfileAdminProfiles,
        errors: null,
      }
    } catch (e) {
      return {
        data: null,
        errors: null,
        globalError: true,
      }
    }
  }
