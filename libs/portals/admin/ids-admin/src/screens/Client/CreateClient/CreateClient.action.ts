import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { RouterActionRedirect, WrappedActionFn } from '@island.is/portals/core'
import {
  replaceParams,
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import { validateClientId } from '@island.is/auth/shared'
import {
  AuthAdminCreateClientType,
  AuthAdminEnvironment,
} from '@island.is/api/schema'
import {
  CreateClientDocument,
  CreateClientMutation,
  CreateClientMutationVariables,
} from './CreateClient.generated'
import { redirect } from 'react-router-dom'
import { IDSAdminPaths } from '../../../lib/paths'
import { toast } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'

const schema = z
  .object({
    displayName: z.string().nonempty('errorDisplayName'),
    clientId: z.string(),
    tenant: z.string(),
    environments: zfd.repeatable(
      z.array(z.nativeEnum(AuthAdminEnvironment)).nonempty('errorEnvironment'),
    ),
    clientType: z.nativeEnum(AuthAdminCreateClientType, {
      required_error: 'errorClientType',
    }),
  })
  // First refine is to check if the clientId is prefixed with the tenant and is empty
  .refine((data) => `${data.tenant}/` !== data.clientId, {
    message: 'errorClientId',
    path: ['clientId'],
  })
  // Second refine is to check if the clientId is prefixed with the tenant and matches the regex
  .refine(
    (data) =>
      validateClientId({
        prefix: data.tenant,
        value: data.clientId,
      }),
    {
      message: 'errorClientIdRegex',
      path: ['clientId'],
    },
  )

export type CreateClientResult = RouterActionRedirect<
  ValidateFormDataResult<typeof schema>['errors']
>

export const createClientAction: WrappedActionFn =
  ({ client, formatMessage }) =>
  async ({ request }): Promise<CreateClientResult | Response> => {
    const formData = await request.formData()
    const result = await validateFormData({ formData, schema })

    if (result.errors || !result.data) {
      return result
    }

    const { data } = result

    try {
      const createdClient = await client.mutate<
        CreateClientMutation,
        CreateClientMutationVariables
      >({
        mutation: CreateClientDocument,
        variables: {
          input: {
            displayName: data.displayName,
            clientId: data.clientId,
            environments: data.environments,
            tenantId: data.tenant,
            clientType: data.clientType,
          },
        },
      })

      const partiallyCreated =
        createdClient.data?.createAuthAdminClient.map(
          (client) => client.environment,
        )?.length !== data?.environments?.length

      if (partiallyCreated) {
        toast.warning(formatMessage(m.partiallyCreatedClient))
      }

      return redirect(
        replaceParams({
          href: IDSAdminPaths.IDSAdminClient,
          params: {
            tenant: data?.tenant,
            client: data?.clientId,
          },
        }),
      )
    } catch (e) {
      return {
        errors: null,
        globalError: true,
      }
    }
  }
