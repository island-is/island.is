import { redirect } from 'react-router-dom'

import { WrappedLoaderFn } from '@island.is/portals/core'
import { unmaskString } from '@island.is/shared/utils'

import { DelegationAdminPaths, NOT_FOUND_PARAM } from '../../lib/paths'
import {
  GetDelegationOverviewDocument,
  GetDelegationOverviewQuery,
  GetDelegationOverviewQueryVariables,
} from './DelegationOverview.generated'

export type DelegationOverviewResult =
  GetDelegationOverviewQuery['authAdminDelegationOverview']

export const delegationOverviewLoader: WrappedLoaderFn = ({
  client,
  userInfo,
}) => {
  return async ({ params }): Promise<DelegationOverviewResult | Response> => {
    const nationalId = params['nationalId']

    if (!nationalId) throw new Error('NationalId not found')

    const unMaskNationalId =
      (await unmaskString(nationalId, userInfo.profile.nationalId)) ?? ''

    const res = await client.query<
      GetDelegationOverviewQuery,
      GetDelegationOverviewQueryVariables
    >({
      query: GetDelegationOverviewDocument,
      fetchPolicy: 'network-only',
      variables: { nationalId: unMaskNationalId },
    })

    if (res.error) {
      throw res.error
    }

    if (!res.data?.authAdminDelegationOverview) {
      return redirect(DelegationAdminPaths.Root)
    }

    const overview = res.data.authAdminDelegationOverview

    if (overview.incoming.length === 0 && overview.outgoing.length === 0) {
      return redirect(`${DelegationAdminPaths.Root}?${NOT_FOUND_PARAM}=true`)
    }

    return overview
  }
}
