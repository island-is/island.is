import { z } from 'zod'
import { WrappedActionFn } from '@island.is/portals/core'
import { validateFormData } from '@island.is/react-spa/shared'

const schema = z.object({
  displayName: z
    .string()
    .min(10, 'Display name must be at least 10 characters long'),
  clientId: z.string(),
  tenant: z.string(),
})

export const createApplicationFormAction: WrappedActionFn = () => ({
  request,
}) => validateFormData({ request, schema })
