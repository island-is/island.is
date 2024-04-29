import {
  GetUserProfileByNationalIdDocument,
  GetUserProfileByNationalIdQuery,
  GetUserProfileByNationalIdQueryVariables,
} from './User.generated'
import { redirect } from 'react-router-dom'

import { WrappedLoaderFn } from '@island.is/portals/core'
import { decryptText } from '@island.is/shared/utils'

import { ServiceDeskPaths } from '../../lib/paths'

export type UserProfileResult = NonNullable<
  GetUserProfileByNationalIdQuery['GetUserProfileByNationalId']
>

export const userLoader: WrappedLoaderFn = ({ client, userInfo }) => {
  return async ({ params }): Promise<UserProfileResult | Response> => {
    const nationalId = params['nationalId']

    if (!nationalId) throw new Error('User not found')

    const unMaskedNationalId =
      (await decryptText(nationalId, userInfo.profile.nationalId)) ?? ''

    const res = await client.query<
      GetUserProfileByNationalIdQuery,
      GetUserProfileByNationalIdQueryVariables
    >({
      query: GetUserProfileByNationalIdDocument,
      fetchPolicy: 'network-only',
      variables: {
        nationalId: unMaskedNationalId,
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
