import { z } from 'zod'

import {
  RawRouterActionResponse,
  WrappedActionFn,
} from '@island.is/portals/core'
import {
  replaceParams,
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'

import { GetCompaniesDocument, GetCompaniesQuery } from './Procures.generated'
import { redirect } from 'react-router-dom'
import { ServiceDeskPaths } from '../../lib/paths'

const schema = z.object({
  searchQuery: z.string().nonempty(),
})

export type GetCompaniesResult = RawRouterActionResponse<
  GetCompaniesQuery['authAdminProcureGetCompanies'],
  ValidateFormDataResult<typeof schema>['errors']
>

export const GetCompaniesAction: WrappedActionFn = ({ client }) => async ({
  request,
}): Promise<GetCompaniesResult | Response> => {
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

  try {
    const res = await client.query<GetCompaniesQuery>({
      query: GetCompaniesDocument,
      fetchPolicy: 'network-only',
      variables: {
        search: data.searchQuery,
      },
    })

    if (res.error) {
      throw res.error
    }

    if (res.data?.authAdminProcureGetCompanies?.length === 1) {
      return redirect(
        replaceParams({
          href: ServiceDeskPaths.Procurers,
          params: {
            nationalId: res.data.authAdminProcureGetCompanies[0].nationalId,
          },
        }),
      )
    }

    return {
      errors: null,
      data: res.data.authAdminProcureGetCompanies,
    }
  } catch (e) {
    return {
      errors: null,
      data: null,
      globalError: true,
    }
  }
}
