import { z } from 'zod'
import { zfd } from 'zod-form-data'

import { RouterActionResponse, WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import { AuthAdminEnvironment } from '@island.is/api/schema'

import {
  PatchAuthAdminScopeDocument,
  PatchAuthAdminScopeMutation,
  PatchAuthAdminScopeMutationVariables,
} from './EditPermission.generated'
import { Languages } from '../../utils/languages'
import { authAdminEnvironments } from '../../utils/environments'
import { getIntent } from '../../utils/getIntent'
import { booleanCheckbox } from '../../utils/forms'

export enum PermissionFormTypes {
  CONTENT = 'CONTENT',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
}

const defaultSchema = z.object({
  environment: z.nativeEnum(AuthAdminEnvironment),
  syncEnvironments: zfd.repeatable(
    z.optional(z.array(z.nativeEnum(AuthAdminEnvironment))),
  ),
})

const contentSchema = z
  .object({
    is_displayName: z.string().nonempty('errorDisplayName'),
    is_description: z.string().nonempty('errorDescription'),
    en_displayName: z.optional(z.string()),
    en_description: z.optional(z.string()),
  })
  .merge(defaultSchema)
  .transform(
    ({
      is_description: isDescription,
      en_description: enDescription,
      is_displayName: isDisplayName,
      en_displayName: enDisplayName,
      ...rest
    }) => ({
      ...rest,
      displayName: [
        {
          locale: Languages.IS,
          value: isDisplayName,
        },
        {
          locale: Languages.EN,
          value: enDisplayName ?? '',
        },
      ],
      description: [
        {
          locale: Languages.IS,
          value: isDescription,
        },
        {
          locale: Languages.EN,
          value: enDescription ?? '',
        },
      ],
    }),
  )

const accessControlSchema = z
  .object({
    isAccessControlled: booleanCheckbox,
    grantToAuthenticatedUser: booleanCheckbox,
    grantToProcuringHolders: booleanCheckbox,
    grantToLegalGuardians: booleanCheckbox,
    allowExplicitDelegationGrant: booleanCheckbox,
    grantToPersonalRepresentatives: booleanCheckbox,
  })
  .merge(defaultSchema)

const schema = {
  [PermissionFormTypes.CONTENT]: contentSchema,
  [PermissionFormTypes.ACCESS_CONTROL]: accessControlSchema,
}

type MergedFormDataSchema = typeof schema[PermissionFormTypes.CONTENT] &
  typeof schema[PermissionFormTypes.ACCESS_CONTROL]

export type EditPermissionResult = RouterActionResponse<
  PatchAuthAdminScopeMutation['patchAuthAdminScope'],
  ValidateFormDataResult<MergedFormDataSchema>['errors'],
  keyof typeof PermissionFormTypes
>

export const editPermissionAction: WrappedActionFn = ({ client }) => async ({
  request,
  params,
}): Promise<EditPermissionResult> => {
  const tenantId = params['tenant']
  const scopeName = params['permission']

  if (!tenantId) throw new Error('Tenant id not found')
  if (!scopeName) throw new Error('Permission id not found')

  const formData = await request.formData()
  const { intent, sync } = getIntent(formData, PermissionFormTypes)
  const saveInAllEnvironments =
    formData.get(`${intent}_saveInAllEnvironments`) ?? false

  const result = await validateFormData({
    formData,
    schema: schema[intent],
  })

  if (result.errors || !result.data) {
    return {
      errors: result.errors,
      data: null,
      globalError: false,
      intent,
    }
  }

  const { syncEnvironments, environment, ...data } = result.data

  const environments: AuthAdminEnvironment[] = []

  // If sync settings from this environment was clicked for current form intent, i.e. form section
  // then update all environments with the same settings as the current environment intent
  if (sync && syncEnvironments && syncEnvironments.length > 0) {
    environments.push(...syncEnvironments)
    // If the save in all environments was enabled, then update all environments
  } else if (saveInAllEnvironments) {
    environments.push(...authAdminEnvironments)
  } else {
    // Otherwise, just update the current environment
    environments.push(environment)
  }

  const globalErrorResponse = {
    errors: null,
    data: null,
    globalError: true,
    intent,
  }

  try {
    const patchScopeResult = await client.mutate<
      PatchAuthAdminScopeMutation,
      PatchAuthAdminScopeMutationVariables
    >({
      mutation: PatchAuthAdminScopeDocument,
      variables: {
        input: {
          ...data,
          tenantId,
          scopeName,
          environments,
        },
      },
    })

    if (patchScopeResult.errors?.length) {
      return globalErrorResponse
    }

    return {
      data: patchScopeResult.data?.patchAuthAdminScope ?? null,
      intent,
    }
  } catch (e) {
    return globalErrorResponse
  }
}
