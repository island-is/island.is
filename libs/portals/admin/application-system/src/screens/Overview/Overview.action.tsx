import { WrappedActionFn } from '@island.is/portals/core'
import { validateFormData } from '@island.is/react-spa/shared'
import { z } from 'zod'

const schema = z.object({
  searchQuery: z.string().nonempty(),
})

export const OverviewAction: WrappedActionFn =
  ({ client }) =>
  async ({ request }): Promise<any> => {
    const formData = await request.formData()

    const { data, errors } = await validateFormData({ formData, schema })
  }
