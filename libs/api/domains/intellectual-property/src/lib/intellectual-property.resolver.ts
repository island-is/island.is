import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/intellectual-property' })
export class IntellectualPropertyResolver {
  constructor(private readonly ipService: any) {
    @Scopes(ApiScope.internal)
  }
}
