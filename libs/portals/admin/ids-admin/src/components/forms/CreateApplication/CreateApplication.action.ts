import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { WrappedActionFn } from '@island.is/portals/core'
import {
  replaceParams,
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import {
  AuthAdminApplicationType,
  AuthAdminEnvironment,
} from '@island.is/api/schema'
import {
  CreateApplicationDocument,
  CreateApplicationMutation,
  CreateApplicationMutationVariables,
} from './CreateApplication.generated'
import { redirect } from 'react-router-dom'
import { IDSAdminPaths } from '../../../lib/paths'

/**
 * Validates that the applicationId is prefixed with the tenant and that it matches the regex
 * Value can only contain alphanumeric characters, hyphens, underscores, periods and forward slashes.
 */
export const validateApplicationId = ({
  prefix,
  value,
}: {
  prefix: string
  value: string
}) => new RegExp(`^${prefix}/[a-zA-Z0-9]+([-_/.][a-zA-Z0-9]+)*$`).test(value)

const schema = z
  .object({
    displayName: z.string().nonempty('errorDisplayName'),
    applicationId: z.string(),
    tenant: z.string(),
    environments: zfd.repeatable(
      z.array(z.nativeEnum(AuthAdminEnvironment)).nonempty('errorEnvironment'),
    ),
    applicationType: z.nativeEnum(AuthAdminApplicationType, {
      required_error: 'errorApplicationType',
    }),
  })
  // First refine is to check if the applicationId is prefixed with the tenant and is empty
  .refine((data) => `${data.tenant}/` !== data.applicationId, {
    message: 'errorApplicationId',
    path: ['applicationId'],
  })
  // Second refine is to check if the applicationId is prefixed with the tenant and matches the regex
  .refine(
    (data) =>
      validateApplicationId({
        prefix: data.tenant,
        value: data.applicationId,
      }),
    {
      message: 'errorApplicationIdRegex',
      path: ['applicationId'],
    },
  )

export type CreateApplicationResult =
  | (ValidateFormDataResult<typeof schema> & {
      /**
       * Global error message if the mutation fails
       */
      globalError?: boolean
    })
  | undefined

export const createApplicationAction: WrappedActionFn = ({ client }) => async ({
  request,
}) => {
  const result = await validateFormData({ request, schema })

  if (result.errors || !result.data) {
    return result
  }

  const { data } = result
  try {
    await client.mutate<
      CreateApplicationMutation,
      CreateApplicationMutationVariables
    >({
      mutation: CreateApplicationDocument,
      variables: {
        input: {
          displayName: data.displayName,
          applicationId: data.applicationId,
          environments: data.environments,
          tenantId: data.tenant,
          applicationType: data.applicationType,
        },
      },
    })

    // TODO: Check for partial creation, and show a warning modal

    return redirect(
      replaceParams({
        href: IDSAdminPaths.IDSAdminApplication,
        params: {
          tenant: data?.tenant,
          application: data?.applicationId,
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
