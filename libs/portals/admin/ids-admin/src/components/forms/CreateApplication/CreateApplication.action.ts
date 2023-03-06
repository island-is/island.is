import { z } from 'zod'
import { WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
  //ValidateFormDataResult,
} from '@island.is/react-spa/shared'

const schema = z.object({
  displayName: z.string(),
  clientId: z.string(),
  tenant: z.string(),
})

export type CreateApplicationResult = ValidateFormDataResult<typeof schema>

export const createApplicationAction: WrappedActionFn = () => async ({
  request,
}) => {
  const result = await validateFormData({ request, schema })

  // Do something with the data

  return result
}
