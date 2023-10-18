import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { redirect } from 'react-router-dom'

import { WrappedActionFn } from '@island.is/portals/core'
import {
  replaceParams,
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import { validatePermissionId } from '@island.is/auth/shared'
import { AuthAdminEnvironment } from '@island.is/api/schema'

import { IDSAdminPaths } from '../../../lib/paths'
import {
  CreateAuthAdminScopeDocument,
  CreateAuthAdminScopeMutation,
  CreateAuthAdminScopeMutationVariables,
} from './CreatePermission.generated'

const schema = z
  .object({
    displayName: z.string().nonempty('errorDisplayName'),
    description: z.string().nonempty('errorDescription'),
    name: z.string(),
    tenantId: z.string(),
    environments: zfd.repeatable(
      z.array(z.nativeEnum(AuthAdminEnvironment)).nonempty('errorEnvironment'),
    ),
  })
  // First refine is to check if the scope id is prefixed with the tenant and is empty
  .refine((data) => `${data.tenantId}/` !== data.name, {
    message: 'errorScopeId',
    path: ['name'],
  })
  // Second refine is to check if the scope id is prefixed with the tenant and matches the regex
  .refine(
    (data) =>
      validatePermissionId({
        prefix: data.tenantId,
        value: data.name,
      }),
    {
      message: 'errorScopeIdRegex',
      path: ['name'],
    },
  )

export type CreateScopeResult = ValidateFormDataResult<typeof schema> & {
  /**
   * Global error message if the mutation fails
   */
  globalError?: boolean
}

export const createPermissionAction: WrappedActionFn =
  ({ client }) =>
  async ({ request }): Promise<CreateScopeResult | Response> => {
    const formData = await request.formData()
    const result = await validateFormData({ formData, schema })

    if (result.errors || !result.data) {
      return result
    }

    const { data } = result

    try {
      await client.mutate<
        CreateAuthAdminScopeMutation,
        CreateAuthAdminScopeMutationVariables
      >({
        mutation: CreateAuthAdminScopeDocument,
        variables: {
          input: data,
        },
      })

      return redirect(
        replaceParams({
          href: IDSAdminPaths.IDSAdminPermission,
          params: {
            tenant: data?.tenantId,
            permission: data?.name,
          },
        }),
      )
    } catch (e) {
      return {
        errors: null,
        data: null,
        globalError: true,
      }
    }
  }
