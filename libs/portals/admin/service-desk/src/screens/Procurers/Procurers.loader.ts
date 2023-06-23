import { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetCompanyProcurersDocument,
  GetCompanyProcurersQuery,
} from './Procurers.generated'
import { redirect } from 'react-router-dom'
import { ServiceDeskPaths } from '../../lib/paths'

export type CompanyProcurerResult = GetCompanyProcurersQuery['authAdminGetCompanyProcurers']

export const procurersLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<CompanyProcurerResult | Response> => {
    const nationalId = params['nationalId']

    if (!nationalId) throw new Error('Company not found')

    const res = await client.query<GetCompanyProcurersQuery>({
      query: GetCompanyProcurersDocument,
      fetchPolicy: 'network-only',
      variables: {
        nationalId,
      },
    })

    if (res.error) {
      throw res.error
    }

    if (!res.data?.authAdminGetCompanyProcurers) {
      return redirect(ServiceDeskPaths.Root)
    }

    return res.data.authAdminGetCompanyProcurers
  }
}
