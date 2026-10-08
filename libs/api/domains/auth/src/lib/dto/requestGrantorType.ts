import { registerEnumType } from '@nestjs/graphql'

import { ScopesControllerFindCategoriesRequestGrantorTypeEnum } from '@island.is/clients/auth/delegation-api'

export const RequestGrantorType =
  ScopesControllerFindCategoriesRequestGrantorTypeEnum
export type RequestGrantorType =
  ScopesControllerFindCategoriesRequestGrantorTypeEnum

registerEnumType(ScopesControllerFindCategoriesRequestGrantorTypeEnum, {
  name: 'AuthDelegationRequestGrantorType',
})
