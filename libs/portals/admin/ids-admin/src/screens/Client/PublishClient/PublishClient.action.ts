import { z } from 'zod'
import { redirect } from 'react-router-dom'

import {
  replaceParams,
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import { RouterActionRedirect, WrappedActionFn } from '@island.is/portals/core'
import { AuthAdminEnvironment } from '@island.is/api/schema'

import {
  PublishClientDocument,
  PublishClientMutation,
  PublishClientMutationVariables,
} from './PublishClient.generated'
import { IDSAdminPaths } from '../../../lib/paths'

const schema = z.object({
  targetEnvironment: z.nativeEnum(AuthAdminEnvironment),
  sourceEnvironment: z.nativeEnum(AuthAdminEnvironment),
})

export type PublishEnvironmentResult = RouterActionRedirect<
  ValidateFormDataResult<typeof schema>['errors']
>

export const publishClientAction: WrappedActionFn = ({ client }) => async ({
  request,
  params,
}): Promise<PublishEnvironmentResult | Response> => {
  const tenantId = params['tenant']
  const clientId = params['client']

  if (!tenantId) throw new Error('Tenant id not found')
  if (!clientId) throw new Error('Client id not found')

  const formData = await request.formData()
  const result = await validateFormData({ formData, schema })

  if (result.errors || !result.data) {
    return {
      errors: result.errors,
      globalError: false,
    }
  }

  const { data } = result

  try {
    const { errors } = await client.mutate<
      PublishClientMutation,
      PublishClientMutationVariables
    >({
      mutation: PublishClientDocument,
      variables: {
        input: {
          clientId,
          tenantId,
          targetEnvironment: data?.targetEnvironment,
          sourceEnvironment: data?.sourceEnvironment,
        },
      },
    })

    if (errors?.length) {
      return {
        globalError: true,
      }
    }

    const searchParams = new URLSearchParams(window.location.search)
    const env = searchParams.get('env')
    const href = replaceParams({
      href: IDSAdminPaths.IDSAdminClient,
      params: { tenant: tenantId, client: clientId },
    })

    return redirect(env ? `${href}?env=${env}` : href)
  } catch (e) {
    return {
      errors: null,
      globalError: true,
    }
  }
}
