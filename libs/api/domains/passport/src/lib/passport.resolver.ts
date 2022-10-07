import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
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
import { PassportService } from './passport.service'
import { IdentityDocumentModel } from './models/identityDocumentModel.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
@Audit({ namespace: '@island.is/api/passport' })
export class PassportResolver {
  constructor(private passportService: PassportService) {}

  @Query(() => [IdentityDocumentModel], { nullable: true })
  @Audit()
  async getIdentityDocument(@CurrentUser() user: User) {
    const res = await this.passportService.getIdentityDocument(user)
    return res
  }
}
