import { redirect } from 'react-router-dom'

import { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetCompanyRelationshipsDocument,
  GetCompanyRelationshipsQuery,
} from './Procurers.generated'
import { ServiceDeskPaths } from '../../lib/paths'

export type CompanyRelationshipResult = GetCompanyRelationshipsQuery['authAdminProcureGetCompanyRelationships']

export const procurersLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<CompanyRelationshipResult | Response> => {
    const nationalId = params['nationalId']

    if (!nationalId) throw new Error('Company not found')

    const res = await client.query<GetCompanyRelationshipsQuery>({
      query: GetCompanyRelationshipsDocument,
      fetchPolicy: 'network-only',
      variables: {
        nationalId,
      },
    })

    if (res.error) {
      throw res.error
    }

    if (!res.data?.authAdminProcureGetCompanyRelationships) {
      return redirect(ServiceDeskPaths.Root)
    }

    return res.data.authAdminProcureGetCompanyRelationships
  }
}
