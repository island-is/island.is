import { z } from 'zod'
import { redirect } from 'react-router-dom'
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

import { ServiceDeskPaths } from '../../lib/paths'
import {
  SearchCompaniesQuery,
  SearchCompaniesDocument,
  SearchCompaniesQueryVariables,
} from './Companies.generated'

const schema = z.object({
  searchQuery: z.string().nonempty(),
})

export type GetCompaniesResult = RawRouterActionResponse<
  SearchCompaniesQuery['companyRegistryCompanies'],
  ValidateFormDataResult<typeof schema>['errors']
>

export const CompaniesAction: WrappedActionFn =
  ({ client }) =>
  async ({ request }): Promise<GetCompaniesResult | Response> => {
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

    const searchTerm = kennitala.isValid(data.searchQuery)
      ? kennitala.sanitize(data.searchQuery)
      : data.searchQuery

    try {
      const res = await client.query<
        SearchCompaniesQuery,
        SearchCompaniesQueryVariables
      >({
        query: SearchCompaniesDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            searchTerm,
            first: 40,
          },
        },
      })

      if (res.error) {
        throw res.error
      }

      const companies = res.data?.companyRegistryCompanies?.data

      // Redirect to Procurers screen if only one company is found
      if (companies?.length === 1) {
        return redirect(
          replaceParams({
            href: ServiceDeskPaths.Procurers,
            params: {
              nationalId: companies[0].nationalId,
            },
          }),
        )
      }

      return {
        errors: null,
        data: res.data.companyRegistryCompanies,
      }
    } catch (e) {
      return {
        errors: null,
        data: null,
        globalError: true,
      }
    }
  }
