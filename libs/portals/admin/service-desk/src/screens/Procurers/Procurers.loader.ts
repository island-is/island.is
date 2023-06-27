import { redirect } from 'react-router-dom'

import { WrappedLoaderFn } from '@island.is/portals/core'

import {
  CompanyRelationshipsDocument,
  CompanyRelationshipsQuery,
  CompanyRelationshipsQueryVariables,
} from './Procurers.generated'
import { ServiceDeskPaths } from '../../lib/paths'

export type CompanyRelationshipResult = NonNullable<
  CompanyRelationshipsQuery['companyRegistryCompany']
>

export const procurersLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<CompanyRelationshipResult | Response> => {
    const nationalId = params['nationalId']

    if (!nationalId) throw new Error('Company not found')

    const res = await client.query<
      CompanyRelationshipsQuery,
      CompanyRelationshipsQueryVariables
    >({
      query: CompanyRelationshipsDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          nationalId,
        },
      },
    })

    if (res.error) {
      throw res.error
    }

    if (!res.data?.companyRegistryCompany) {
      return redirect(ServiceDeskPaths.Root)
    }

    return res.data.companyRegistryCompany
  }
}
