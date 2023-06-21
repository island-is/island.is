import { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetCompanyProcurersDocument,
  GetCompanyProcurersQuery,
} from './Procurers.generated'

export type CompanyProcurerResult = GetCompanyProcurersQuery['authAdminGetCompanyProcurers']

export const procurersLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<CompanyProcurerResult> => {
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
      throw new Error('Company procurers not found')
    }

    return res.data.authAdminGetCompanyProcurers
  }
}
