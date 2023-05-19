import { z } from 'zod'
import { zfd } from 'zod-form-data'

import { WrappedActionFn } from '@island.is/portals/core'
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
import { Languages } from '../../../shared/utils/languages'
import { authAdminEnvironments } from '../../../shared/utils/environments'

export enum PermissionFormTypes {
  CONTENT = 'CONTENT',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  NONE = 'NONE',
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

const booleanCheckbox = z.preprocess((value) => value === 'true', z.boolean())

const accessControlSchema = z
  .object({
    isAccessControlled: booleanCheckbox,
    grantToAuthenticatedUser: booleanCheckbox,
    grantToProcuringHolders: booleanCheckbox,
    grantToLegalGuardians: booleanCheckbox,
    allowExplicitDelegationGrant: booleanCheckbox,
    allowPermissionLevelOverrides: booleanCheckbox,
  })
  .merge(defaultSchema)

const schema = {
  [PermissionFormTypes.CONTENT]: contentSchema,
  [PermissionFormTypes.NONE]: defaultSchema,
  [PermissionFormTypes.ACCESS_CONTROL]: accessControlSchema,
}

function getIntent(formData: FormData) {
  const intent = formData.get('intent') as keyof typeof PermissionFormTypes

  if (!Object.values(PermissionFormTypes).some((type) => type === intent)) {
    throw new Error('wrong intent string')
  }

  return intent
}

type MergedFormDataSchema = typeof schema[PermissionFormTypes.CONTENT] &
  typeof schema[PermissionFormTypes.NONE]

type Result = ValidateFormDataResult<MergedFormDataSchema>

export type UpdatePermissionResult = {
  data: PatchAuthAdminScopeMutation['patchAuthAdminScope'] | null
  errors?: Result['errors'] | null
  /**
   * Global error message if the mutation fails
   */
  globalError?: boolean
  /**
   * Intent of the form
   */
  intent: keyof typeof PermissionFormTypes
}

export const updatePermissionAction: WrappedActionFn = ({ client }) => async ({
  request,
  params,
}): Promise<UpdatePermissionResult> => {
  const tenantId = params['tenant']
  const scopeName = params['permission']

  if (!tenantId) throw new Error('Tenant id not found')
  if (!scopeName) throw new Error('Permission id not found')

  const formData = await request.formData()
  const intent = getIntent(formData)
  const saveInAllEnvironments =
    formData.get(`${intent}_saveInAllEnvironments`) ?? false
  const syncIntent = formData.get(`${intent}-sync`)

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
  if (syncIntent && syncEnvironments && syncEnvironments.length > 0) {
    environments.push(...syncEnvironments)
    // If the save in all environments was enabled, then update all environments
  } else if (saveInAllEnvironments) {
    environments.push(...authAdminEnvironments)
  } else {
    // Otherwise, just update the current environment
    environments.push(environment)
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
      throw new Error(
        patchScopeResult.errors.map(({ message }) => message).join('\n'),
      )
    }

    return {
      data: patchScopeResult.data?.patchAuthAdminScope ?? null,
      intent,
    }
  } catch (e) {
    return {
      errors: null,
      data: null,
      globalError: true,
      intent,
    }
  }
}
