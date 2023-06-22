import { z } from 'zod'

import {
  RawRouterActionResponse,
  WrappedActionFn,
} from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'

import { GetCompaniesDocument, GetCompaniesQuery } from './Procures.generated'

const schema = z.object({
  searchQuery: z.string().nonempty(),
})

export type GetCompaniesResult = RawRouterActionResponse<
  GetCompaniesQuery['authAdminProcureGetCompanies'],
  ValidateFormDataResult<typeof schema>['errors']
>

export const GetCompaniesAction: WrappedActionFn = ({ client }) => async ({
  request,
}): Promise<GetCompaniesResult> => {
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

    return {
      errors: null,
      data: res.data.authAdminProcureGetCompanies,
    }
  } catch (e) {
    return {
      errors: null,
      data: [],
      globalError: true,
    }
  }
}
