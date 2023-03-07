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
} from './CreateApplication.generated'
import { redirect } from 'react-router-dom'
import { IDSAdminPaths } from '../../../lib/paths'

const schema = z.object({
  displayName: z.string().nonempty('errorDisplayName'),
  applicationId: z.string().nonempty('errorApplicationId'),
  tenant: z.string(),
  environments: zfd.repeatable(
    z.array(z.nativeEnum(AuthAdminEnvironment)).nonempty('errorEnvironment'),
  ),
  applicationType: z.nativeEnum(AuthAdminApplicationType, {
    required_error: 'errorApplicationType',
  }),
})

export type CreateApplicationResult =
  | ValidateFormDataResult<typeof schema>
  | undefined

export const createApplicationAction: WrappedActionFn = ({ client }) => async ({
  request,
}) => {
  const result = await validateFormData({ request, schema })

  if (result.errors || !result.data) {
    return result
  }

  const { data } = result

  const res = await client.mutate<CreateApplicationMutation>({
    mutation: CreateApplicationDocument,
    variables: {
      input: {
        displayName: data.displayName,
        applicationId: `${data.tenant}/${data?.applicationId}`,
        environments: data.environments,
        applicationType: data?.applicationType,
      },
    },
  })

  if (res.errors) {
    throw res.errors
  }

  return redirect(
    replaceParams({
      href: IDSAdminPaths.IDSAdminTenants,
      params: { tenant: data?.tenant },
    }),
  )
}
