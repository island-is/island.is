import { z } from 'zod'
import { redirect } from 'react-router-dom'
import * as kennitala from 'kennitala'
import { WrappedActionFn } from '@island.is/portals/core'
import { validateFormData } from '@island.is/react-spa/shared'

const schema = z.object({
  searchQuery: z.string().min(1).max(10),
})

export const UsersAction: WrappedActionFn =
  ({ client }) =>
  async ({ request }): Promise<Response | null> => {
    const formData = await request.formData()

    const { data, errors } = await validateFormData({
      formData,
      schema,
    })

    if (errors || !data) {
      return null
    }

    const searchTerm = kennitala.isValid(data.searchQuery)
      ? kennitala.sanitize(data.searchQuery)
      : data.searchQuery

    return redirect(`/users/${searchTerm}`)
  }
