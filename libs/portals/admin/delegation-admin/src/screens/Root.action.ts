import {
  RawRouterActionResponse,
  WrappedActionFn,
} from '@island.is/portals/core'
import { z } from 'zod'
import {
  replaceParams,
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import * as kennitala from 'kennitala'
import { redirect } from 'react-router-dom'
import { DelegationAdminPaths } from '../lib/paths'
import { maskString } from '@island.is/shared/utils'
import { GetCustomDelegationsAdminQuery } from './DelegationAdminDetails/DelegationAdmin.generated'

export enum ErrorType {
  InvalidNationalId = 'INVALID_NATIONAL_ID',
}

export type GetDelegationForNationalIdResult = RawRouterActionResponse<
  GetCustomDelegationsAdminQuery['authAdminDelegationAdmin'],
  ValidateFormDataResult<typeof schema>['errors']
>

const schema = z.object({
  nationalId: z
    .string()
    .length(10)
    .superRefine((value, ctx) => {
      if (!kennitala.isValid(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: ErrorType.InvalidNationalId,
        })
        return false
      }
      return true
    }),
})

export const FindDelegationForNationalId: WrappedActionFn =
  ({ userInfo }) =>
  async ({ request }) => {
    const formData = await request.formData()

    const { data, errors } = await validateFormData({
      formData,
      schema,
    })

    if (errors || !data) {
      return {
        errors,
        data: null,
      }
    }

    const nationalId = formData.get('nationalId') as string

    return redirect(
      replaceParams({
        href: DelegationAdminPaths.DelegationAdmin,
        params: {
          nationalId:
            (await maskString(nationalId, userInfo.profile.nationalId)) ?? '',
        },
      }),
    )
  }
