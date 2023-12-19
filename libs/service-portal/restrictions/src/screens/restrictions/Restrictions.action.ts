import { WrappedActionFn } from '@island.is/portals/core'
import { validateFormData } from '@island.is/react-spa/shared'

import { z } from 'zod'
import { m } from '../../lib/messages'

export enum RestrictionsIntent {
  Enable = 'enable',
  Disable = 'disable',
}

const schema = z.object({
  intent: z.nativeEnum(RestrictionsIntent),
})

export type RestrictionsResponse = null | {
  errors: {
    intent: string
  }
}

export const restrictionsAction: WrappedActionFn = ({ formatMessage }) => {
  return async ({ request }): Promise<RestrictionsResponse> => {
    const { data, errors } = await validateFormData({
      formData: await request.formData(),
      schema,
    })

    if (errors) {
      return {
        errors: {
          intent: formatMessage(m.invalidIntent),
        },
      }
    }

    console.log(data)
    // TODO make query to api

    return null
  }
}
