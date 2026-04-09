import { AuthAdminEnvironment } from '@island.is/api/schema'
import { RouterActionResponse, WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'

import {
  UpdateTenantDocument,
  UpdateTenantMutation,
  UpdateTenantMutationVariables,
} from '../Tenants.generated'
import { authAdminEnvironments } from '../../../utils/environments'
import { getIntent } from '../../../utils/getIntent'
import {
  editTenantSchema,
  MergedEditTenantFormDataSchema,
  TenantFormTypes,
} from './EditTenant.schema'

export type EditTenantActionResult = RouterActionResponse<
  UpdateTenantMutation['updateAuthAdminTenant'],
  ValidateFormDataResult<MergedEditTenantFormDataSchema>['errors'],
  keyof typeof TenantFormTypes
>

export const editTenantAction: WrappedActionFn =
  ({ client }) =>
  async ({ request, params }): Promise<EditTenantActionResult> => {
    const tenantId = params['tenant']

    if (!tenantId) {
      throw new Error('Tenant id not found')
    }

    const formData = await request.formData()
    const { intent, sync } = getIntent(formData, TenantFormTypes)
    const saveInAllEnvironments =
      formData.get(`${intent}_saveInAllEnvironments`) ?? false

    const { data, errors } = await validateFormData({
      formData,
      schema: editTenantSchema[intent],
    })

    if (errors || !data) {
      return {
        errors,
        data: null,
        globalError: false,
        intent,
      }
    }

    const { syncEnvironments, environment, ...rest } = data

    const environments: AuthAdminEnvironment[] = []

    // "Sync settings from this environment" clicked for this section: push the
    // user-selected sync environments.
    if (sync && syncEnvironments && syncEnvironments.length > 0) {
      environments.push(...syncEnvironments)
    } else if (saveInAllEnvironments) {
      environments.push(...authAdminEnvironments)
    } else {
      environments.push(environment)
    }

    const globalErrorResponse: EditTenantActionResult = {
      errors: null,
      data: null,
      globalError: true,
      intent,
    }

    try {
      const response = await client.mutate<
        UpdateTenantMutation,
        UpdateTenantMutationVariables
      >({
        mutation: UpdateTenantDocument,
        variables: {
          input: {
            tenantId,
            environments,
            nationalId: rest.nationalId,
            displayName: rest.displayName,
            description: rest.description,
            organisationLogoKey: rest.organisationLogoKey,
            contactEmail: rest.contactEmail || undefined,
          },
        },
      })

      if (response.errors?.length) {
        return globalErrorResponse
      }

      return {
        data: response.data?.updateAuthAdminTenant ?? null,
        errors: null,
        globalError: false,
        intent,
      }
    } catch (error) {
      return globalErrorResponse
    }
  }
