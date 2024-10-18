import { redirect } from 'react-router-dom'

import { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetCustomDelegationsAdminDocument,
  GetCustomDelegationsAdminQuery,
  GetCustomDelegationsAdminQueryVariables,
} from './DelegationAdmin.generated'
import { DelegationAdminPaths } from '../../lib/paths'
import { unmaskString } from '@island.is/shared/utils'

export type DelegationAdminResult = NonNullable<
  GetCustomDelegationsAdminQuery['authAdminDelegationAdmin']
>

export type Delegations = NonNullable<
  GetCustomDelegationsAdminQuery['authAdminDelegationAdmin']['incoming']
>

export const delegationAdminLoader: WrappedLoaderFn = ({
  client,
  userInfo,
}) => {
  return async ({ params }): Promise<DelegationAdminResult | Response> => {
    const nationalId = params['nationalId']

    if (!nationalId) throw new Error('NationalId not found')

    const unMaskNationalId =
      (await unmaskString(nationalId, userInfo.profile.nationalId)) ?? ''

    const res = await client.query<
      GetCustomDelegationsAdminQuery,
      GetCustomDelegationsAdminQueryVariables
    >({
      query: GetCustomDelegationsAdminDocument,
      fetchPolicy: 'network-only',
      variables: {
        nationalId: unMaskNationalId,
      },
    })

    if (res.error) {
      throw res.error
    }

    if (!res.data?.authAdminDelegationAdmin) {
      return redirect(DelegationAdminPaths.Root)
    }

    return res.data.authAdminDelegationAdmin
  }
}
