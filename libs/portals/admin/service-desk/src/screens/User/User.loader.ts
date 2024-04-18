import { ServiceDeskPaths } from '../../lib/paths'
import { WrappedLoaderFn } from '@island.is/portals/core'
import {
  GetUserProfileByNationalIdDocument,
  GetUserProfileByNationalIdQuery,
  GetUserProfileByNationalIdQueryVariables,
} from './User.generated'
import { redirect } from 'react-router-dom'

export type UserProfileResult = NonNullable<
  GetUserProfileByNationalIdQuery['GetUserProfileByNationalId']
>

export const userLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<UserProfileResult | Response> => {
    const nationalId = params['nationalId']

    if (!nationalId) throw new Error('User not found')

    const res = await client.query<
      GetUserProfileByNationalIdQuery,
      GetUserProfileByNationalIdQueryVariables
    >({
      query: GetUserProfileByNationalIdDocument,
      fetchPolicy: 'network-only',
      variables: {
        nationalId,
      },
    })

    if (res.error) {
      throw res.error
    }

    if (!res.data?.GetUserProfileByNationalId) {
      return redirect(ServiceDeskPaths.Root)
    }

    return res.data.GetUserProfileByNationalId
  }
}
