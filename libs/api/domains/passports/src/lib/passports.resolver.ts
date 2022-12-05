import { Args, Directive, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UseGuards } from '@nestjs/common'

import {
  AuthMiddleware,
  BypassAuth,
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { PassportsService } from '@island.is/clients/passports'
import { IdentityDocument } from './models/identityDocument.model'
import { IdentityDocumentChild } from './models/identityDocumentChild.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PassportsResolver {
  constructor(private passportApi: PassportsService) {}

  @Query(() => [IdentityDocument])
  getPassport(@CurrentUser() user: User): Promise<IdentityDocument[]> {
    return this.passportApi.getPassports(user)
  }

  @Query(() => [IdentityDocumentChild])
  getChildrenPassports(
    @CurrentUser() user: User,
  ): Promise<IdentityDocumentChild[]> {
    return this.passportApi.getChildPassports(user)
  }

  // @Mutation(() => )
}
