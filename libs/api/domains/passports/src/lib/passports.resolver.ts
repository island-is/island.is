import { Args, Directive, Query, Resolver } from '@nestjs/graphql'

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
import { IdentityDocument } from './models/identityDocument'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PassportsResolver {
  constructor(private passportApi: PassportsService) {}

  @Query(() => [IdentityDocument])
  getPassport(@CurrentUser() user: User): Promise<IdentityDocument[]> {
    return this.passportApi.getPassports(user)
  }
}
