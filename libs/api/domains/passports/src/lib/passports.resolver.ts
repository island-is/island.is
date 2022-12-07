import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { PassportsService } from '@island.is/clients/passports'
import { IdentityDocument } from './models/identityDocument.model'
import { IdentityDocumentChild } from './models/identityDocumentChild.model'
import { Passport } from './models/passport.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PassportsResolver {
  constructor(private passportApi: PassportsService) {}

  @Query(() => [IdentityDocument])
  getallPassports(@CurrentUser() user: User): Promise<IdentityDocument[]> {
    return this.passportApi.getPassports(user)
  }

  @Query(() => [IdentityDocumentChild])
  getChildrenPassports(
    @CurrentUser() user: User,
  ): Promise<IdentityDocumentChild[]> {
    return this.passportApi.getChildPassports(user)
  }

  @Query(() => Passport)
  getPassport(@CurrentUser() user: User): Promise<Passport> {
    return this.passportApi.getCurrentPassport(user)
  }
}
