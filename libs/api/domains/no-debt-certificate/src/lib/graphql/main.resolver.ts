import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { NoDebtCertificateService } from '../noDebtCertificate.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(
    private readonly noDebtCertificateService: NoDebtCertificateService,
  ) {}

  @Query(() => Boolean)
  async noDebtCertificateValidation(@CurrentUser() user: User) {
    return await this.noDebtCertificateService.validateNoDebtCertificate(
      user.nationalId,
    )
  }
}
