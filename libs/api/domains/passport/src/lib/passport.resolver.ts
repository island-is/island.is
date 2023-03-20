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
import { IdentityDocumentModel } from './models/identityDocumentModel.model'
import { IdentityDocumentModelChild } from './models/identityDocumentModelChild.model'
import { Passport } from './models/passport.model'
import { PassportsService } from '@island.is/clients/passports'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
@Audit({ namespace: '@island.is/api/passport' })
export class PassportResolver {
  constructor(private passportApi: PassportsService) {}

  @Query(() => [IdentityDocumentModel], { nullable: true })
  @Audit()
  async getIdentityDocument(@CurrentUser() user: User) {
    const res = await this.passportApi.getIdentityDocument(user)
    return res
  }

  @Query(() => [IdentityDocumentModelChild], { nullable: true })
  @Audit()
  async getIdentityDocumentChildren(@CurrentUser() user: User) {
    const res = await this.passportApi.getIdentityDocumentChildren(user)
    return res
  }

  @Query(() => Passport)
  getPassport(@CurrentUser() user: User): Promise<Passport> {
    return this.passportApi.getCurrentPassport(user)
  }
}
