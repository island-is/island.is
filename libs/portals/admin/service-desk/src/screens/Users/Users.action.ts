import { z } from 'zod'
import * as kennitala from 'kennitala'
import {
  RawRouterActionResponse,
  WrappedActionFn,
} from '@island.is/portals/core'
import {
  replaceParams,
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import { isEmail } from 'class-validator'
import { parsePhoneNumber } from 'libphonenumber-js'
import {
  GetPaginatedUserProfilesDocument,
  GetPaginatedUserProfilesQuery,
  type GetPaginatedUserProfilesQueryVariables,
} from './Users.generated'
import { redirect } from 'react-router-dom'
import { ServiceDeskPaths } from '../../lib/paths'

const schema = z.object({
  searchQuery: z.string().min(1),
})

export type GetUserProfilesResult = RawRouterActionResponse<
  GetPaginatedUserProfilesQuery['GetPaginatedUserProfiles'],
  ValidateFormDataResult<typeof schema>['errors']
>

export const UsersAction: WrappedActionFn =
  ({ client }) =>
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

        if (totalCount === 0) {
          return {
            data: null,
            errors: {
              searchQuery: 'No users found',
            },
          }
        } else if (totalCount === 1) {
          return redirect(
            replaceParams({
              href: ServiceDeskPaths.User,
              params: {
                nationalId: respData[0].nationalId,
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
          errors: {
            searchQuery: 'Invalid search query',
          },
        }
      }
    } else {
      return {
        data: null,
        errors: {
          searchQuery: 'Invalid search query',
        },
      }
    }
  }
