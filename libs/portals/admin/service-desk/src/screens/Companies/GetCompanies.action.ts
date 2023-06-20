import {
  RawRouterActionResponse,
  WrappedActionFn,
} from '@island.is/portals/core'
import { z } from 'zod'
import { companiesMock, Company } from '../mockProcures'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'

const schema = z.object({
  companyId: z.string().nonempty(),
})

export type GetCompaniesResult = RawRouterActionResponse<
  Company[],
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
      globalError: false,
    }
  }

  try {
    // Replace this with a call to the backend
    const companies = companiesMock.filter((company) => {
      return (
        company.nationalId.includes(data.companyId) ||
        company.name.toLowerCase().includes(data.companyId.toLowerCase())
      )
    })

    return {
      errors: null,
      data: companies,
      globalError: false,
    }
  } catch (e) {
    return {
      errors: null,
      data: [],
      globalError: true,
    }
  }
}
