import { UseGuards } from '@nestjs/common'
import { Query } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { PassportService } from './api-domains-passport.service'
import { IdentityDocumentModel } from './models/identityDocumentModel.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/api/passport' })
export class PassportResolver {
  constructor(private passportService: PassportService) {}

  @Query(() => IdentityDocumentModel, { nullable: true })
  @Audit()
  async getIdentityDocument(@CurrentUser() user: User) {
    return this.passportService.getIdentityDocument(user)
  }
}
